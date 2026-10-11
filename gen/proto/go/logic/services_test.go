package logic_test

import (
	"reflect"
	"testing"

	authpb "github.com/canda6/atlas-example/gen/proto/go/auth"
	logicpb "github.com/canda6/atlas-example/gen/proto/go/logic"
	"google.golang.org/grpc"
)

func TestBusinessRPCSurface(t *testing.T) {
	for _, tc := range []struct {
		desc grpc.ServiceDesc
		want []string
	}{
		{authpb.AuthClientService_ServiceDesc, []string{"Authenticate"}},
		{logicpb.LogicClientService_ServiceDesc, []string{"Login", "GetBags", "CreateRoom", "JoinRoom", "LeaveRoom"}},
		// Gate 的固定连接清理回调，不是服务间业务接口。
		{logicpb.LogicServerService_ServiceDesc, []string{"OnDisconnect"}},
	} {
		var got []string
		for _, method := range tc.desc.Methods {
			got = append(got, method.MethodName)
		}
		if !reflect.DeepEqual(got, tc.want) || len(tc.desc.Streams) != 0 {
			t.Errorf("%s methods = %v, want %v", tc.desc.ServiceName, got, tc.want)
		}
	}
}
