import './style.css';
import { GateClient } from './client';
import { auth,logic,room } from './gen/messages';

const root=document.querySelector<HTMLDivElement>('#app')!;
root.innerHTML=`<header><span class="brand">ATLAS</span><span class="muted">五子棋 · 与朋友来一局</span><span id="identity"></span></header>
<main><section id="login"><div class="intro"><p class="eyebrow">LET'S PLAY</p><h1>落下一子，开始一局。</h1><p class="muted">输入演示账号，邀请朋友一起下棋。</p></div><form id="login-form" class="panel"><label for="account">演示账号</label><input id="account" placeholder="例如 player-a" maxlength="30" required autocomplete="username"><button class="primary">进入大厅 →</button><p class="muted small">演示环境，无密码。两名玩家请使用不同账号。</p></form></section>
<section id="lobby" hidden><div class="intro"><p class="eyebrow">好友对局</p><h1>一张棋盘，两个人。</h1><p class="muted">开一间房，或者加入朋友的房间。</p></div><div class="lobby-grid"><div class="panel"><h2>开一间房</h2><p class="muted">你执黑，邀请一位朋友加入。</p><button id="create" class="primary">创建房间</button></div><form id="join-form" class="panel"><label for="room-input">加入朋友的房间</label><input id="room-input" placeholder="输入 8 位房间号" pattern="[a-fA-F0-9]{8}" maxlength="8" required><button>加入房间 →</button></form></div></section>
<section id="game" hidden><div class="row between"><div><p class="eyebrow">好友对局</p><h1>房间 <span id="room-id"></span></h1></div><div class="row"><button id="copy">复制房间号</button><button id="sync">同步棋盘</button><button id="leave">退出房间</button></div></div><div class="game-grid"><div><div class="board-wrap"><div id="board" aria-label="十五乘十五棋盘"></div></div><div class="row between board-note"><span id="moves"></span><span>黑棋先行 · 连成五子获胜</span></div></div><aside><div class="panel"><h2 id="turn" aria-live="polite"></h2><p id="hint" class="muted"></p><div id="members"></div><button id="ready" class="primary">准备</button></div><div class="panel"><span id="connection">● 已连接</span><p class="muted small">断线按退出处理，对局中判负，不支持续局。</p></div></aside></div></section>
<div id="notice" role="status" aria-live="polite"></div><button id="relogin" hidden>重新登录</button><details><summary>消息记录</summary><pre id="log"></pre></details></main><footer>Atlas Demo · 单节点 · 自由五子棋</footer>`;
function el<T extends HTMLElement=HTMLElement>(id:string){return document.getElementById(id) as T;}
let client:GateClient|undefined,userID='',snapshot:room.v1.RoomSnapshot|undefined,connected=false,busy=false,entering=false;
const L='/logic.client.v1.LogicClientService/',R='/room.client.v1.RoomClientService/';
const logs:string[]=[];
function log(t:string){logs.unshift(`${new Date().toLocaleTimeString()} ${t}`);logs.length=Math.min(logs.length,40);el('log').textContent=logs.join('\n');}
function notice(t:string){el('notice').textContent=t;}
function page(p:string){for(const id of ['login','lobby','game'])el(id).hidden=id!==p;}
function render(){
 root.querySelectorAll<HTMLButtonElement>('button').forEach(b=>b.disabled=busy);
 el('relogin').hidden=connected||!userID;
 if(!snapshot)return;
 el('room-id').textContent=snapshot.roomId;const mine=snapshot.members.find(m=>m.userId===userID);
 const phase=snapshot.phase;el('turn').textContent=!connected?'连接已断开':phase==='playing'?(mine?.stone===snapshot.turn?'轮到你落子':'等待对方落子'):phase==='finished'?(snapshot.winnerId===userID?'你赢了！':snapshot.winnerId?'对方获胜':'本局和棋'):snapshot.members.length<2?'等待好友加入':'双方就位';
 el('hint').textContent=!connected?'重新登录后返回大厅':phase==='finished'?(snapshot.result==='leave'?'对手退出，本局结束':'重新准备可再来一局'):phase==='playing'?'选择棋盘上的空位':'双方准备后开始';
 el('connection').textContent=connected?'● 已连接':'○ 已断开';
 const members=el('members');members.replaceChildren();
 for(let i=0;i<2;i++){const m=snapshot.members[i],row=document.createElement('div');row.className='member';const stone=document.createElement('span');stone.className=`stone ${i===1?'white':''}`;const text=document.createElement('div');text.textContent=m?`${m.name}${m.userId===userID?' · 你':''}`:'空席，等一位朋友';const label=document.createElement('div');label.className='muted small';label.textContent=`${i===0?'执黑 · 房主':'执白'}${m?.ready?' · 已准备':''}`;text.append(label);row.append(stone,text);members.append(row);}
 const ready=el<HTMLButtonElement>('ready');ready.hidden=phase==='playing';ready.textContent=mine?.ready?'已准备，等待对方':phase==='finished'?'准备再来一局':'准备';ready.disabled=busy||!connected||snapshot.members.length!==2||!!mine?.ready;
 const board=el('board');board.replaceChildren();for(let i=0;i<225;i++){const b=document.createElement('button');b.className='cell';b.dataset.stone=String(snapshot.board[i]||0);b.setAttribute('aria-label',`${String.fromCharCode(65+i%15)}${Math.floor(i/15)+1} ${(snapshot.board[i]===1?'黑棋':snapshot.board[i]===2?'白棋':'空位')}`);b.disabled=busy||!connected||phase!=='playing'||mine?.stone!==snapshot.turn||!!snapshot.board[i];b.onclick=()=>act(async()=>apply(room.v1.RoomSnapshot.decode(await client!.call(R+'PlaceStone',room.v1.PlaceStoneRequest.encode({roomId:snapshot!.roomId,x:i%15,y:Math.floor(i/15)}).finish()))));board.append(b);}
 el('moves').textContent=`已落 ${snapshot.board.filter(Boolean).length} 手`;el<HTMLButtonElement>('leave').disabled=busy||!connected;el<HTMLButtonElement>('sync').disabled=busy||!connected;
}
function apply(s:room.v1.RoomSnapshot){if(!s.members.some(m=>m.userId===userID))return;if(snapshot&&snapshot.roomId===s.roomId&&Number(snapshot.version)>Number(s.version))return;snapshot=s;page('game');render();}
async function act(fn:()=>Promise<void>){if(busy)return;busy=true;notice('');render();try{await fn();}catch(e){notice(e instanceof Error?e.message:String(e));}finally{busy=false;render();}}
el('login-form').onsubmit=e=>{e.preventDefault();void act(async()=>{client?.close();const c=new GateClient();client=c;c.onLog=log;c.onPush=(method,p)=>{if(method==='/push/room.v1.RoomSnapshot'&&(snapshot||entering))apply(room.v1.RoomSnapshot.decode(p));};c.onClose=()=>{if(client!==c)return;connected=false;notice('连接已断开：对局中断线按退出判负，请重新登录。');render();};await c.connect();connected=true;const account=el<HTMLInputElement>('account').value.trim();const a=auth.v1.AuthenticateResponse.decode(await c.call('/auth.client.v1.AuthClientService/Authenticate',auth.v1.AuthenticateRequest.encode({accountId:account,channel:'guest'}).finish()));if(!a.success)throw Error(a.message||'认证失败');const result=logic.v1.LoginResponse.decode(await c.call(L+'Login',logic.v1.LoginRequest.encode({userId:a.roleId}).finish()));if(!result.success)throw Error(result.message||'登录失败');userID=a.roleId;el('identity').textContent=account;snapshot=undefined;page('lobby');});};
async function enter(method:string,payload?:Uint8Array){entering=true;try{apply(room.v1.RoomSnapshot.decode(await client!.call(L+method,payload)));}finally{entering=false;}}
el('create').onclick=()=>act(()=>enter('CreateRoom'));
el('join-form').onsubmit=e=>{e.preventDefault();void act(()=>enter('JoinRoom',room.v1.RoomRequest.encode({roomId:el<HTMLInputElement>('room-input').value.trim().toLowerCase()}).finish()));};
el('ready').onclick=()=>act(async()=>apply(room.v1.RoomSnapshot.decode(await client!.call(R+'Ready',room.v1.RoomRequest.encode({roomId:snapshot!.roomId}).finish()))));
el('leave').onclick=()=>{if(snapshot?.phase==='playing'&&!confirm('现在退出会判负，确定退出？'))return;void act(async()=>{await client!.call(L+'LeaveRoom');snapshot=undefined;page('lobby');});};
el('sync').onclick=()=>act(async()=>apply(room.v1.RoomSnapshot.decode(await client!.call(R+'GetRoom',room.v1.RoomRequest.encode({roomId:snapshot!.roomId}).finish()))));
el('copy').onclick=()=>{void navigator.clipboard.writeText(snapshot!.roomId).then(()=>notice('房间号已复制'),()=>notice(`房间号：${snapshot!.roomId}`));};
el('relogin').onclick=()=>{client?.close();client=undefined;userID='';snapshot=undefined;connected=false;page('login');notice('');render();};
render();
