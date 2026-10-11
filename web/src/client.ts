import protobuf from 'protobufjs/minimal';

const errors: Record<number,string> = {2100:'你已在房间中，请先退出',3001:'房间不存在',3002:'你不是此房间的当前成员',3003:'房间已满或正在对局',3004:'当前不能在此落子',3005:'双方到齐后才能准备',3006:'房间号已占用，请重新创建'};
export class GateClient {
 private socket?: WebSocket;
 private id=0;
 private heartbeat?: ReturnType<typeof setInterval>;
 private pending=new Map<number,{resolve:(v:Uint8Array)=>void,reject:(e:Error)=>void,timer:ReturnType<typeof setTimeout>}>();
 onPush:(method:string,payload:Uint8Array)=>void=()=>{};
 onClose:()=>void=()=>{};
 onLog:(text:string)=>void=()=>{};
 async connect(){
  const ws=new WebSocket('ws://127.0.0.1:8081/ws');this.socket=ws;ws.binaryType='arraybuffer';
  ws.onmessage=e=>{try{this.receive(new Uint8Array(e.data));}catch{ws.close();}};
  ws.onclose=()=>{clearInterval(this.heartbeat);for(const p of this.pending.values()){clearTimeout(p.timer);p.reject(new Error('连接已断开'));}this.pending.clear();this.onClose();};
  await new Promise<void>((resolve,reject)=>{const timeout=setTimeout(()=>{ws.close();reject(new Error('连接超时'));},10000);ws.onopen=()=>{clearTimeout(timeout);resolve();};ws.onerror=()=>{clearTimeout(timeout);reject(new Error('无法连接服务器'));};});
  this.heartbeat=setInterval(()=>{if(ws.readyState===WebSocket.OPEN)ws.send(new Uint8Array([4]));},20000);
 }
 close(){this.socket?.close();}
 call(method:string,payload:Uint8Array=new Uint8Array()):Promise<Uint8Array>{
  const ws=this.socket;if(!ws||ws.readyState!==WebSocket.OPEN)return Promise.reject(new Error('请先登录'));
  const id=++this.id;const header=protobuf.Writer.create().uint32(1).uint64(id).string(method).finish();
  const bytes=new Uint8Array(header.length+payload.length);bytes.set(header);bytes.set(payload,header.length);
  this.onLog(`→ ${method.split('/').pop()}`);
  return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{this.pending.delete(id);reject(new Error('请求超时，未自动重试'));},15000);this.pending.set(id,{resolve,reject,timer});try{ws.send(bytes);}catch(e){clearTimeout(timer);this.pending.delete(id);reject(e);}});
 }
 private receive(bytes:Uint8Array){
  if(bytes.length>65536)throw Error('oversized frame');
  const r=protobuf.Reader.create(bytes),flag=r.uint32();if(flag&0xf0)throw Error('unsupported frame');
  if(flag===5)return;
  if(flag===3){const method=r.string();this.onLog(`← ${method.split('/').pop()}`);this.onPush(method,bytes.subarray(r.pos));return;}
  if(flag!==2)throw Error('invalid frame');
  const id=Number(r.uint64()),status=r.uint32(),code=r.sint32();const p=this.pending.get(id);if(!p)return;
  this.pending.delete(id);clearTimeout(p.timer);this.onLog(`← ${status} / ${code}`);
  if(code)p.reject(new Error(errors[code]||`请求失败（${status} / ${code}）`));else p.resolve(bytes.subarray(r.pos));
 }
}
