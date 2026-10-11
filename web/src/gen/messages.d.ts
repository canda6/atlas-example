import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace auth. */
export namespace auth {

    /** Namespace v1. */
    namespace v1 {

        /** Properties of an AuthenticateRequest. */
        interface IAuthenticateRequest {

            /** AuthenticateRequest sdkToken */
            sdkToken?: (string|null);

            /** AuthenticateRequest accountId */
            accountId?: (string|null);

            /** AuthenticateRequest channel */
            channel?: (string|null);
        }

        /** Represents an AuthenticateRequest. */
        class AuthenticateRequest implements IAuthenticateRequest {

            /**
             * Constructs a new AuthenticateRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: auth.v1.IAuthenticateRequest);

            /** AuthenticateRequest sdkToken. */
            public sdkToken: string;

            /** AuthenticateRequest accountId. */
            public accountId: string;

            /** AuthenticateRequest channel. */
            public channel: string;

            /**
             * Encodes the specified AuthenticateRequest message. Does not implicitly {@link auth.v1.AuthenticateRequest.verify|verify} messages.
             * @param message AuthenticateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: auth.v1.IAuthenticateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AuthenticateRequest message, length delimited. Does not implicitly {@link auth.v1.AuthenticateRequest.verify|verify} messages.
             * @param message AuthenticateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: auth.v1.IAuthenticateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AuthenticateRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AuthenticateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): auth.v1.AuthenticateRequest;

            /**
             * Decodes an AuthenticateRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AuthenticateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): auth.v1.AuthenticateRequest;

            /**
             * Gets the default type url for AuthenticateRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an AuthenticateResponse. */
        interface IAuthenticateResponse {

            /** AuthenticateResponse success */
            success?: (boolean|null);

            /** AuthenticateResponse message */
            message?: (string|null);

            /** AuthenticateResponse gameToken */
            gameToken?: (string|null);

            /** AuthenticateResponse roleId */
            roleId?: (string|null);
        }

        /** Represents an AuthenticateResponse. */
        class AuthenticateResponse implements IAuthenticateResponse {

            /**
             * Constructs a new AuthenticateResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: auth.v1.IAuthenticateResponse);

            /** AuthenticateResponse success. */
            public success: boolean;

            /** AuthenticateResponse message. */
            public message: string;

            /** AuthenticateResponse gameToken. */
            public gameToken: string;

            /** AuthenticateResponse roleId. */
            public roleId: string;

            /**
             * Encodes the specified AuthenticateResponse message. Does not implicitly {@link auth.v1.AuthenticateResponse.verify|verify} messages.
             * @param message AuthenticateResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: auth.v1.IAuthenticateResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AuthenticateResponse message, length delimited. Does not implicitly {@link auth.v1.AuthenticateResponse.verify|verify} messages.
             * @param message AuthenticateResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: auth.v1.IAuthenticateResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AuthenticateResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AuthenticateResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): auth.v1.AuthenticateResponse;

            /**
             * Decodes an AuthenticateResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AuthenticateResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): auth.v1.AuthenticateResponse;

            /**
             * Gets the default type url for AuthenticateResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}

/** Namespace logic. */
export namespace logic {

    /** Namespace v1. */
    namespace v1 {

        /** Properties of a PlayerInfo. */
        interface IPlayerInfo {

            /** PlayerInfo id */
            id?: (string|null);

            /** PlayerInfo name */
            name?: (string|null);
        }

        /** Represents a PlayerInfo. */
        class PlayerInfo implements IPlayerInfo {

            /**
             * Constructs a new PlayerInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: logic.v1.IPlayerInfo);

            /** PlayerInfo id. */
            public id: string;

            /** PlayerInfo name. */
            public name: string;

            /**
             * Encodes the specified PlayerInfo message. Does not implicitly {@link logic.v1.PlayerInfo.verify|verify} messages.
             * @param message PlayerInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: logic.v1.IPlayerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PlayerInfo message, length delimited. Does not implicitly {@link logic.v1.PlayerInfo.verify|verify} messages.
             * @param message PlayerInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: logic.v1.IPlayerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PlayerInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PlayerInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): logic.v1.PlayerInfo;

            /**
             * Decodes a PlayerInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PlayerInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): logic.v1.PlayerInfo;

            /**
             * Gets the default type url for PlayerInfo
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a LoginRequest. */
        interface ILoginRequest {

            /** LoginRequest userId */
            userId?: (string|null);
        }

        /** Represents a LoginRequest. */
        class LoginRequest implements ILoginRequest {

            /**
             * Constructs a new LoginRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: logic.v1.ILoginRequest);

            /** LoginRequest userId. */
            public userId: string;

            /**
             * Encodes the specified LoginRequest message. Does not implicitly {@link logic.v1.LoginRequest.verify|verify} messages.
             * @param message LoginRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: logic.v1.ILoginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LoginRequest message, length delimited. Does not implicitly {@link logic.v1.LoginRequest.verify|verify} messages.
             * @param message LoginRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: logic.v1.ILoginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LoginRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LoginRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): logic.v1.LoginRequest;

            /**
             * Decodes a LoginRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LoginRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): logic.v1.LoginRequest;

            /**
             * Gets the default type url for LoginRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a LoginResponse. */
        interface ILoginResponse {

            /** LoginResponse success */
            success?: (boolean|null);

            /** LoginResponse player */
            player?: (logic.v1.IPlayerInfo|null);

            /** LoginResponse message */
            message?: (string|null);
        }

        /** Represents a LoginResponse. */
        class LoginResponse implements ILoginResponse {

            /**
             * Constructs a new LoginResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: logic.v1.ILoginResponse);

            /** LoginResponse success. */
            public success: boolean;

            /** LoginResponse player. */
            public player?: (logic.v1.IPlayerInfo|null);

            /** LoginResponse message. */
            public message: string;

            /**
             * Encodes the specified LoginResponse message. Does not implicitly {@link logic.v1.LoginResponse.verify|verify} messages.
             * @param message LoginResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: logic.v1.ILoginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LoginResponse message, length delimited. Does not implicitly {@link logic.v1.LoginResponse.verify|verify} messages.
             * @param message LoginResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: logic.v1.ILoginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LoginResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LoginResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): logic.v1.LoginResponse;

            /**
             * Decodes a LoginResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LoginResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): logic.v1.LoginResponse;

            /**
             * Gets the default type url for LoginResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a GetBagsRequest. */
        interface IGetBagsRequest {

            /** GetBagsRequest userId */
            userId?: (string|null);
        }

        /** Represents a GetBagsRequest. */
        class GetBagsRequest implements IGetBagsRequest {

            /**
             * Constructs a new GetBagsRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: logic.v1.IGetBagsRequest);

            /** GetBagsRequest userId. */
            public userId: string;

            /**
             * Encodes the specified GetBagsRequest message. Does not implicitly {@link logic.v1.GetBagsRequest.verify|verify} messages.
             * @param message GetBagsRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: logic.v1.IGetBagsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GetBagsRequest message, length delimited. Does not implicitly {@link logic.v1.GetBagsRequest.verify|verify} messages.
             * @param message GetBagsRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: logic.v1.IGetBagsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GetBagsRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GetBagsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): logic.v1.GetBagsRequest;

            /**
             * Decodes a GetBagsRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GetBagsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): logic.v1.GetBagsRequest;

            /**
             * Gets the default type url for GetBagsRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a BagItem. */
        interface IBagItem {

            /** BagItem itemId */
            itemId?: (number|Long|null);

            /** BagItem count */
            count?: (number|Long|null);
        }

        /** Represents a BagItem. */
        class BagItem implements IBagItem {

            /**
             * Constructs a new BagItem.
             * @param [properties] Properties to set
             */
            constructor(properties?: logic.v1.IBagItem);

            /** BagItem itemId. */
            public itemId: (number|Long);

            /** BagItem count. */
            public count: (number|Long);

            /**
             * Encodes the specified BagItem message. Does not implicitly {@link logic.v1.BagItem.verify|verify} messages.
             * @param message BagItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: logic.v1.IBagItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BagItem message, length delimited. Does not implicitly {@link logic.v1.BagItem.verify|verify} messages.
             * @param message BagItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: logic.v1.IBagItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BagItem message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BagItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): logic.v1.BagItem;

            /**
             * Decodes a BagItem message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BagItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): logic.v1.BagItem;

            /**
             * Gets the default type url for BagItem
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a GetBagsResponse. */
        interface IGetBagsResponse {

            /** GetBagsResponse items */
            items?: (logic.v1.IBagItem[]|null);
        }

        /** Represents a GetBagsResponse. */
        class GetBagsResponse implements IGetBagsResponse {

            /**
             * Constructs a new GetBagsResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: logic.v1.IGetBagsResponse);

            /** GetBagsResponse items. */
            public items: logic.v1.IBagItem[];

            /**
             * Encodes the specified GetBagsResponse message. Does not implicitly {@link logic.v1.GetBagsResponse.verify|verify} messages.
             * @param message GetBagsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: logic.v1.IGetBagsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GetBagsResponse message, length delimited. Does not implicitly {@link logic.v1.GetBagsResponse.verify|verify} messages.
             * @param message GetBagsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: logic.v1.IGetBagsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GetBagsResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GetBagsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): logic.v1.GetBagsResponse;

            /**
             * Decodes a GetBagsResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GetBagsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): logic.v1.GetBagsResponse;

            /**
             * Gets the default type url for GetBagsResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}

/** Namespace room. */
export namespace room {

    /** Namespace v1. */
    namespace v1 {

        /** Properties of a Member. */
        interface IMember {

            /** Member userId */
            userId?: (string|null);

            /** Member name */
            name?: (string|null);

            /** Member stone */
            stone?: (number|null);

            /** Member ready */
            ready?: (boolean|null);
        }

        /** Represents a Member. */
        class Member implements IMember {

            /**
             * Constructs a new Member.
             * @param [properties] Properties to set
             */
            constructor(properties?: room.v1.IMember);

            /** Member userId. */
            public userId: string;

            /** Member name. */
            public name: string;

            /** Member stone. */
            public stone: number;

            /** Member ready. */
            public ready: boolean;

            /**
             * Encodes the specified Member message. Does not implicitly {@link room.v1.Member.verify|verify} messages.
             * @param message Member message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: room.v1.IMember, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Member message, length delimited. Does not implicitly {@link room.v1.Member.verify|verify} messages.
             * @param message Member message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: room.v1.IMember, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Member message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Member
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): room.v1.Member;

            /**
             * Decodes a Member message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Member
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): room.v1.Member;

            /**
             * Gets the default type url for Member
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a RoomSnapshot. */
        interface IRoomSnapshot {

            /** RoomSnapshot roomId */
            roomId?: (string|null);

            /** RoomSnapshot members */
            members?: (room.v1.IMember[]|null);

            /** RoomSnapshot board */
            board?: (number[]|null);

            /** RoomSnapshot phase */
            phase?: (string|null);

            /** RoomSnapshot turn */
            turn?: (number|null);

            /** RoomSnapshot winnerId */
            winnerId?: (string|null);

            /** RoomSnapshot result */
            result?: (string|null);

            /** RoomSnapshot version */
            version?: (number|Long|null);
        }

        /** Represents a RoomSnapshot. */
        class RoomSnapshot implements IRoomSnapshot {

            /**
             * Constructs a new RoomSnapshot.
             * @param [properties] Properties to set
             */
            constructor(properties?: room.v1.IRoomSnapshot);

            /** RoomSnapshot roomId. */
            public roomId: string;

            /** RoomSnapshot members. */
            public members: room.v1.IMember[];

            /** RoomSnapshot board. */
            public board: number[];

            /** RoomSnapshot phase. */
            public phase: string;

            /** RoomSnapshot turn. */
            public turn: number;

            /** RoomSnapshot winnerId. */
            public winnerId: string;

            /** RoomSnapshot result. */
            public result: string;

            /** RoomSnapshot version. */
            public version: (number|Long);

            /**
             * Encodes the specified RoomSnapshot message. Does not implicitly {@link room.v1.RoomSnapshot.verify|verify} messages.
             * @param message RoomSnapshot message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: room.v1.IRoomSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RoomSnapshot message, length delimited. Does not implicitly {@link room.v1.RoomSnapshot.verify|verify} messages.
             * @param message RoomSnapshot message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: room.v1.IRoomSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RoomSnapshot message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RoomSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): room.v1.RoomSnapshot;

            /**
             * Decodes a RoomSnapshot message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RoomSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): room.v1.RoomSnapshot;

            /**
             * Gets the default type url for RoomSnapshot
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a RoomRequest. */
        interface IRoomRequest {

            /** RoomRequest roomId */
            roomId?: (string|null);
        }

        /** Represents a RoomRequest. */
        class RoomRequest implements IRoomRequest {

            /**
             * Constructs a new RoomRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: room.v1.IRoomRequest);

            /** RoomRequest roomId. */
            public roomId: string;

            /**
             * Encodes the specified RoomRequest message. Does not implicitly {@link room.v1.RoomRequest.verify|verify} messages.
             * @param message RoomRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: room.v1.IRoomRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RoomRequest message, length delimited. Does not implicitly {@link room.v1.RoomRequest.verify|verify} messages.
             * @param message RoomRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: room.v1.IRoomRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RoomRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RoomRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): room.v1.RoomRequest;

            /**
             * Decodes a RoomRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RoomRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): room.v1.RoomRequest;

            /**
             * Gets the default type url for RoomRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a PlaceStoneRequest. */
        interface IPlaceStoneRequest {

            /** PlaceStoneRequest roomId */
            roomId?: (string|null);

            /** PlaceStoneRequest x */
            x?: (number|null);

            /** PlaceStoneRequest y */
            y?: (number|null);
        }

        /** Represents a PlaceStoneRequest. */
        class PlaceStoneRequest implements IPlaceStoneRequest {

            /**
             * Constructs a new PlaceStoneRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: room.v1.IPlaceStoneRequest);

            /** PlaceStoneRequest roomId. */
            public roomId: string;

            /** PlaceStoneRequest x. */
            public x: number;

            /** PlaceStoneRequest y. */
            public y: number;

            /**
             * Encodes the specified PlaceStoneRequest message. Does not implicitly {@link room.v1.PlaceStoneRequest.verify|verify} messages.
             * @param message PlaceStoneRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: room.v1.IPlaceStoneRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PlaceStoneRequest message, length delimited. Does not implicitly {@link room.v1.PlaceStoneRequest.verify|verify} messages.
             * @param message PlaceStoneRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: room.v1.IPlaceStoneRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PlaceStoneRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PlaceStoneRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): room.v1.PlaceStoneRequest;

            /**
             * Decodes a PlaceStoneRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PlaceStoneRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): room.v1.PlaceStoneRequest;

            /**
             * Gets the default type url for PlaceStoneRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a MembershipRequest. */
        interface IMembershipRequest {

            /** MembershipRequest roomId */
            roomId?: (string|null);

            /** MembershipRequest userId */
            userId?: (string|null);

            /** MembershipRequest name */
            name?: (string|null);

            /** MembershipRequest session */
            session?: (atlas.gate.v1.ISessionRef|null);
        }

        /** Represents a MembershipRequest. */
        class MembershipRequest implements IMembershipRequest {

            /**
             * Constructs a new MembershipRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: room.v1.IMembershipRequest);

            /** MembershipRequest roomId. */
            public roomId: string;

            /** MembershipRequest userId. */
            public userId: string;

            /** MembershipRequest name. */
            public name: string;

            /** MembershipRequest session. */
            public session?: (atlas.gate.v1.ISessionRef|null);

            /**
             * Encodes the specified MembershipRequest message. Does not implicitly {@link room.v1.MembershipRequest.verify|verify} messages.
             * @param message MembershipRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: room.v1.IMembershipRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MembershipRequest message, length delimited. Does not implicitly {@link room.v1.MembershipRequest.verify|verify} messages.
             * @param message MembershipRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: room.v1.IMembershipRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MembershipRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MembershipRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): room.v1.MembershipRequest;

            /**
             * Decodes a MembershipRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MembershipRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): room.v1.MembershipRequest;

            /**
             * Gets the default type url for MembershipRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}

/** Namespace atlas. */
export namespace atlas {

    /** Namespace gate. */
    namespace gate {

        /** Namespace v1. */
        namespace v1 {

            /** Properties of an Empty. */
            interface IEmpty {
            }

            /** Represents an Empty. */
            class Empty implements IEmpty {

                /**
                 * Constructs a new Empty.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: atlas.gate.v1.IEmpty);

                /**
                 * Encodes the specified Empty message. Does not implicitly {@link atlas.gate.v1.Empty.verify|verify} messages.
                 * @param message Empty message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: atlas.gate.v1.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Empty message, length delimited. Does not implicitly {@link atlas.gate.v1.Empty.verify|verify} messages.
                 * @param message Empty message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: atlas.gate.v1.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Empty message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Empty
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): atlas.gate.v1.Empty;

                /**
                 * Decodes an Empty message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Empty
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): atlas.gate.v1.Empty;

                /**
                 * Gets the default type url for Empty
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a SessionRef. */
            interface ISessionRef {

                /** SessionRef gateId */
                gateId?: (string|null);

                /** SessionRef sessionId */
                sessionId?: (string|null);
            }

            /** Represents a SessionRef. */
            class SessionRef implements ISessionRef {

                /**
                 * Constructs a new SessionRef.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: atlas.gate.v1.ISessionRef);

                /** SessionRef gateId. */
                public gateId: string;

                /** SessionRef sessionId. */
                public sessionId: string;

                /**
                 * Encodes the specified SessionRef message. Does not implicitly {@link atlas.gate.v1.SessionRef.verify|verify} messages.
                 * @param message SessionRef message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: atlas.gate.v1.ISessionRef, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SessionRef message, length delimited. Does not implicitly {@link atlas.gate.v1.SessionRef.verify|verify} messages.
                 * @param message SessionRef message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: atlas.gate.v1.ISessionRef, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SessionRef message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SessionRef
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): atlas.gate.v1.SessionRef;

                /**
                 * Decodes a SessionRef message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SessionRef
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): atlas.gate.v1.SessionRef;

                /**
                 * Gets the default type url for SessionRef
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a SetRequest. */
            interface ISetRequest {

                /** SetRequest session */
                session?: (atlas.gate.v1.ISessionRef|null);

                /** SetRequest key */
                key?: (string|null);

                /** SetRequest value */
                value?: (string|null);

                /** SetRequest immutable */
                immutable?: (boolean|null);
            }

            /** Represents a SetRequest. */
            class SetRequest implements ISetRequest {

                /**
                 * Constructs a new SetRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: atlas.gate.v1.ISetRequest);

                /** SetRequest session. */
                public session?: (atlas.gate.v1.ISessionRef|null);

                /** SetRequest key. */
                public key: string;

                /** SetRequest value. */
                public value: string;

                /** SetRequest immutable. */
                public immutable: boolean;

                /**
                 * Encodes the specified SetRequest message. Does not implicitly {@link atlas.gate.v1.SetRequest.verify|verify} messages.
                 * @param message SetRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: atlas.gate.v1.ISetRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SetRequest message, length delimited. Does not implicitly {@link atlas.gate.v1.SetRequest.verify|verify} messages.
                 * @param message SetRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: atlas.gate.v1.ISetRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SetRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SetRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): atlas.gate.v1.SetRequest;

                /**
                 * Decodes a SetRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SetRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): atlas.gate.v1.SetRequest;

                /**
                 * Gets the default type url for SetRequest
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a DeleteRequest. */
            interface IDeleteRequest {

                /** DeleteRequest session */
                session?: (atlas.gate.v1.ISessionRef|null);

                /** DeleteRequest key */
                key?: (string|null);
            }

            /** Represents a DeleteRequest. */
            class DeleteRequest implements IDeleteRequest {

                /**
                 * Constructs a new DeleteRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: atlas.gate.v1.IDeleteRequest);

                /** DeleteRequest session. */
                public session?: (atlas.gate.v1.ISessionRef|null);

                /** DeleteRequest key. */
                public key: string;

                /**
                 * Encodes the specified DeleteRequest message. Does not implicitly {@link atlas.gate.v1.DeleteRequest.verify|verify} messages.
                 * @param message DeleteRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: atlas.gate.v1.IDeleteRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DeleteRequest message, length delimited. Does not implicitly {@link atlas.gate.v1.DeleteRequest.verify|verify} messages.
                 * @param message DeleteRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: atlas.gate.v1.IDeleteRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DeleteRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DeleteRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): atlas.gate.v1.DeleteRequest;

                /**
                 * Decodes a DeleteRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DeleteRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): atlas.gate.v1.DeleteRequest;

                /**
                 * Gets the default type url for DeleteRequest
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a PushRequest. */
            interface IPushRequest {

                /** PushRequest session */
                session?: (atlas.gate.v1.ISessionRef|null);

                /** PushRequest method */
                method?: (string|null);

                /** PushRequest payload */
                payload?: (Uint8Array|null);
            }

            /** Represents a PushRequest. */
            class PushRequest implements IPushRequest {

                /**
                 * Constructs a new PushRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: atlas.gate.v1.IPushRequest);

                /** PushRequest session. */
                public session?: (atlas.gate.v1.ISessionRef|null);

                /** PushRequest method. */
                public method: string;

                /** PushRequest payload. */
                public payload: Uint8Array;

                /**
                 * Encodes the specified PushRequest message. Does not implicitly {@link atlas.gate.v1.PushRequest.verify|verify} messages.
                 * @param message PushRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: atlas.gate.v1.IPushRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PushRequest message, length delimited. Does not implicitly {@link atlas.gate.v1.PushRequest.verify|verify} messages.
                 * @param message PushRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: atlas.gate.v1.IPushRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PushRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PushRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): atlas.gate.v1.PushRequest;

                /**
                 * Decodes a PushRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PushRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): atlas.gate.v1.PushRequest;

                /**
                 * Gets the default type url for PushRequest
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** PushCode enum. */
            enum PushCode {
                PUSH_CODE_UNSPECIFIED = 0,
                PUSH_CODE_ENQUEUED = 1,
                PUSH_CODE_SESSION_CHANGED = 2
            }

            /** Properties of a PushResponse. */
            interface IPushResponse {

                /** PushResponse code */
                code?: (atlas.gate.v1.PushCode|null);
            }

            /** Represents a PushResponse. */
            class PushResponse implements IPushResponse {

                /**
                 * Constructs a new PushResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: atlas.gate.v1.IPushResponse);

                /** PushResponse code. */
                public code: atlas.gate.v1.PushCode;

                /**
                 * Encodes the specified PushResponse message. Does not implicitly {@link atlas.gate.v1.PushResponse.verify|verify} messages.
                 * @param message PushResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: atlas.gate.v1.IPushResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PushResponse message, length delimited. Does not implicitly {@link atlas.gate.v1.PushResponse.verify|verify} messages.
                 * @param message PushResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: atlas.gate.v1.IPushResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PushResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PushResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): atlas.gate.v1.PushResponse;

                /**
                 * Decodes a PushResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PushResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): atlas.gate.v1.PushResponse;

                /**
                 * Gets the default type url for PushResponse
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** DisconnectReason enum. */
            enum DisconnectReason {
                DISCONNECT_REASON_UNSPECIFIED = 0,
                DISCONNECT_REASON_AUTH_FAILED = 1,
                DISCONNECT_REASON_LOGGED_IN_ELSEWHERE = 2,
                DISCONNECT_REASON_SERVER_REQUEST = 3,
                DISCONNECT_REASON_CLIENT_CLOSED = 4,
                DISCONNECT_REASON_NETWORK_ERROR = 5,
                DISCONNECT_REASON_SERVER_SHUTDOWN = 6,
                DISCONNECT_REASON_SLOW_CLIENT = 7,
                DISCONNECT_REASON_PROTOCOL_ERROR = 8,
                DISCONNECT_REASON_IDLE_TIMEOUT = 9
            }

            /** Properties of a DisconnectRequest. */
            interface IDisconnectRequest {

                /** DisconnectRequest session */
                session?: (atlas.gate.v1.ISessionRef|null);

                /** DisconnectRequest reason */
                reason?: (atlas.gate.v1.DisconnectReason|null);
            }

            /** Represents a DisconnectRequest. */
            class DisconnectRequest implements IDisconnectRequest {

                /**
                 * Constructs a new DisconnectRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: atlas.gate.v1.IDisconnectRequest);

                /** DisconnectRequest session. */
                public session?: (atlas.gate.v1.ISessionRef|null);

                /** DisconnectRequest reason. */
                public reason: atlas.gate.v1.DisconnectReason;

                /**
                 * Encodes the specified DisconnectRequest message. Does not implicitly {@link atlas.gate.v1.DisconnectRequest.verify|verify} messages.
                 * @param message DisconnectRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: atlas.gate.v1.IDisconnectRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DisconnectRequest message, length delimited. Does not implicitly {@link atlas.gate.v1.DisconnectRequest.verify|verify} messages.
                 * @param message DisconnectRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: atlas.gate.v1.IDisconnectRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DisconnectRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DisconnectRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): atlas.gate.v1.DisconnectRequest;

                /**
                 * Decodes a DisconnectRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DisconnectRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): atlas.gate.v1.DisconnectRequest;

                /**
                 * Gets the default type url for DisconnectRequest
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an OnDisconnectRequest. */
            interface IOnDisconnectRequest {

                /** OnDisconnectRequest session */
                session?: (atlas.gate.v1.ISessionRef|null);

                /** OnDisconnectRequest reason */
                reason?: (atlas.gate.v1.DisconnectReason|null);
            }

            /** Represents an OnDisconnectRequest. */
            class OnDisconnectRequest implements IOnDisconnectRequest {

                /**
                 * Constructs a new OnDisconnectRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: atlas.gate.v1.IOnDisconnectRequest);

                /** OnDisconnectRequest session. */
                public session?: (atlas.gate.v1.ISessionRef|null);

                /** OnDisconnectRequest reason. */
                public reason: atlas.gate.v1.DisconnectReason;

                /**
                 * Encodes the specified OnDisconnectRequest message. Does not implicitly {@link atlas.gate.v1.OnDisconnectRequest.verify|verify} messages.
                 * @param message OnDisconnectRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: atlas.gate.v1.IOnDisconnectRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified OnDisconnectRequest message, length delimited. Does not implicitly {@link atlas.gate.v1.OnDisconnectRequest.verify|verify} messages.
                 * @param message OnDisconnectRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: atlas.gate.v1.IOnDisconnectRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an OnDisconnectRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns OnDisconnectRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): atlas.gate.v1.OnDisconnectRequest;

                /**
                 * Decodes an OnDisconnectRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns OnDisconnectRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): atlas.gate.v1.OnDisconnectRequest;

                /**
                 * Gets the default type url for OnDisconnectRequest
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }
}
