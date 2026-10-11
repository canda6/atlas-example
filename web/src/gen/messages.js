/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const auth = $root.auth = (() => {

    /**
     * Namespace auth.
     * @exports auth
     * @namespace
     */
    const auth = {};

    auth.v1 = (function() {

        /**
         * Namespace v1.
         * @memberof auth
         * @namespace
         */
        const v1 = {};

        v1.AuthenticateRequest = (function() {

            /**
             * Properties of an AuthenticateRequest.
             * @memberof auth.v1
             * @interface IAuthenticateRequest
             * @property {string|null} [sdkToken] AuthenticateRequest sdkToken
             * @property {string|null} [accountId] AuthenticateRequest accountId
             * @property {string|null} [channel] AuthenticateRequest channel
             */

            /**
             * Constructs a new AuthenticateRequest.
             * @memberof auth.v1
             * @classdesc Represents an AuthenticateRequest.
             * @implements IAuthenticateRequest
             * @constructor
             * @param {auth.v1.IAuthenticateRequest=} [properties] Properties to set
             */
            function AuthenticateRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AuthenticateRequest sdkToken.
             * @member {string} sdkToken
             * @memberof auth.v1.AuthenticateRequest
             * @instance
             */
            AuthenticateRequest.prototype.sdkToken = "";

            /**
             * AuthenticateRequest accountId.
             * @member {string} accountId
             * @memberof auth.v1.AuthenticateRequest
             * @instance
             */
            AuthenticateRequest.prototype.accountId = "";

            /**
             * AuthenticateRequest channel.
             * @member {string} channel
             * @memberof auth.v1.AuthenticateRequest
             * @instance
             */
            AuthenticateRequest.prototype.channel = "";

            /**
             * Encodes the specified AuthenticateRequest message. Does not implicitly {@link auth.v1.AuthenticateRequest.verify|verify} messages.
             * @function encode
             * @memberof auth.v1.AuthenticateRequest
             * @static
             * @param {auth.v1.IAuthenticateRequest} message AuthenticateRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.sdkToken != null && Object.hasOwnProperty.call(message, "sdkToken"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.sdkToken);
                if (message.accountId != null && Object.hasOwnProperty.call(message, "accountId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.accountId);
                if (message.channel != null && Object.hasOwnProperty.call(message, "channel"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.channel);
                return writer;
            };

            /**
             * Encodes the specified AuthenticateRequest message, length delimited. Does not implicitly {@link auth.v1.AuthenticateRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof auth.v1.AuthenticateRequest
             * @static
             * @param {auth.v1.IAuthenticateRequest} message AuthenticateRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AuthenticateRequest message from the specified reader or buffer.
             * @function decode
             * @memberof auth.v1.AuthenticateRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {auth.v1.AuthenticateRequest} AuthenticateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.v1.AuthenticateRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.sdkToken = reader.string();
                            break;
                        }
                    case 2: {
                            message.accountId = reader.string();
                            break;
                        }
                    case 3: {
                            message.channel = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an AuthenticateRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof auth.v1.AuthenticateRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {auth.v1.AuthenticateRequest} AuthenticateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Gets the default type url for AuthenticateRequest
             * @function getTypeUrl
             * @memberof auth.v1.AuthenticateRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AuthenticateRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/auth.v1.AuthenticateRequest";
            };

            return AuthenticateRequest;
        })();

        v1.AuthenticateResponse = (function() {

            /**
             * Properties of an AuthenticateResponse.
             * @memberof auth.v1
             * @interface IAuthenticateResponse
             * @property {boolean|null} [success] AuthenticateResponse success
             * @property {string|null} [message] AuthenticateResponse message
             * @property {string|null} [gameToken] AuthenticateResponse gameToken
             * @property {string|null} [roleId] AuthenticateResponse roleId
             */

            /**
             * Constructs a new AuthenticateResponse.
             * @memberof auth.v1
             * @classdesc Represents an AuthenticateResponse.
             * @implements IAuthenticateResponse
             * @constructor
             * @param {auth.v1.IAuthenticateResponse=} [properties] Properties to set
             */
            function AuthenticateResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AuthenticateResponse success.
             * @member {boolean} success
             * @memberof auth.v1.AuthenticateResponse
             * @instance
             */
            AuthenticateResponse.prototype.success = false;

            /**
             * AuthenticateResponse message.
             * @member {string} message
             * @memberof auth.v1.AuthenticateResponse
             * @instance
             */
            AuthenticateResponse.prototype.message = "";

            /**
             * AuthenticateResponse gameToken.
             * @member {string} gameToken
             * @memberof auth.v1.AuthenticateResponse
             * @instance
             */
            AuthenticateResponse.prototype.gameToken = "";

            /**
             * AuthenticateResponse roleId.
             * @member {string} roleId
             * @memberof auth.v1.AuthenticateResponse
             * @instance
             */
            AuthenticateResponse.prototype.roleId = "";

            /**
             * Encodes the specified AuthenticateResponse message. Does not implicitly {@link auth.v1.AuthenticateResponse.verify|verify} messages.
             * @function encode
             * @memberof auth.v1.AuthenticateResponse
             * @static
             * @param {auth.v1.IAuthenticateResponse} message AuthenticateResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
                if (message.gameToken != null && Object.hasOwnProperty.call(message, "gameToken"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.gameToken);
                if (message.roleId != null && Object.hasOwnProperty.call(message, "roleId"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.roleId);
                return writer;
            };

            /**
             * Encodes the specified AuthenticateResponse message, length delimited. Does not implicitly {@link auth.v1.AuthenticateResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof auth.v1.AuthenticateResponse
             * @static
             * @param {auth.v1.IAuthenticateResponse} message AuthenticateResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AuthenticateResponse message from the specified reader or buffer.
             * @function decode
             * @memberof auth.v1.AuthenticateResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {auth.v1.AuthenticateResponse} AuthenticateResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateResponse.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.v1.AuthenticateResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.success = reader.bool();
                            break;
                        }
                    case 2: {
                            message.message = reader.string();
                            break;
                        }
                    case 3: {
                            message.gameToken = reader.string();
                            break;
                        }
                    case 4: {
                            message.roleId = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an AuthenticateResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof auth.v1.AuthenticateResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {auth.v1.AuthenticateResponse} AuthenticateResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Gets the default type url for AuthenticateResponse
             * @function getTypeUrl
             * @memberof auth.v1.AuthenticateResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AuthenticateResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/auth.v1.AuthenticateResponse";
            };

            return AuthenticateResponse;
        })();

        return v1;
    })();

    return auth;
})();

export const logic = $root.logic = (() => {

    /**
     * Namespace logic.
     * @exports logic
     * @namespace
     */
    const logic = {};

    logic.v1 = (function() {

        /**
         * Namespace v1.
         * @memberof logic
         * @namespace
         */
        const v1 = {};

        v1.PlayerInfo = (function() {

            /**
             * Properties of a PlayerInfo.
             * @memberof logic.v1
             * @interface IPlayerInfo
             * @property {string|null} [id] PlayerInfo id
             * @property {string|null} [name] PlayerInfo name
             */

            /**
             * Constructs a new PlayerInfo.
             * @memberof logic.v1
             * @classdesc Represents a PlayerInfo.
             * @implements IPlayerInfo
             * @constructor
             * @param {logic.v1.IPlayerInfo=} [properties] Properties to set
             */
            function PlayerInfo(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PlayerInfo id.
             * @member {string} id
             * @memberof logic.v1.PlayerInfo
             * @instance
             */
            PlayerInfo.prototype.id = "";

            /**
             * PlayerInfo name.
             * @member {string} name
             * @memberof logic.v1.PlayerInfo
             * @instance
             */
            PlayerInfo.prototype.name = "";

            /**
             * Encodes the specified PlayerInfo message. Does not implicitly {@link logic.v1.PlayerInfo.verify|verify} messages.
             * @function encode
             * @memberof logic.v1.PlayerInfo
             * @static
             * @param {logic.v1.IPlayerInfo} message PlayerInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PlayerInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                return writer;
            };

            /**
             * Encodes the specified PlayerInfo message, length delimited. Does not implicitly {@link logic.v1.PlayerInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof logic.v1.PlayerInfo
             * @static
             * @param {logic.v1.IPlayerInfo} message PlayerInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PlayerInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PlayerInfo message from the specified reader or buffer.
             * @function decode
             * @memberof logic.v1.PlayerInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {logic.v1.PlayerInfo} PlayerInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PlayerInfo.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.logic.v1.PlayerInfo();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.string();
                            break;
                        }
                    case 2: {
                            message.name = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a PlayerInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof logic.v1.PlayerInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {logic.v1.PlayerInfo} PlayerInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PlayerInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Gets the default type url for PlayerInfo
             * @function getTypeUrl
             * @memberof logic.v1.PlayerInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PlayerInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/logic.v1.PlayerInfo";
            };

            return PlayerInfo;
        })();

        v1.LoginRequest = (function() {

            /**
             * Properties of a LoginRequest.
             * @memberof logic.v1
             * @interface ILoginRequest
             * @property {string|null} [userId] LoginRequest userId
             */

            /**
             * Constructs a new LoginRequest.
             * @memberof logic.v1
             * @classdesc Represents a LoginRequest.
             * @implements ILoginRequest
             * @constructor
             * @param {logic.v1.ILoginRequest=} [properties] Properties to set
             */
            function LoginRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LoginRequest userId.
             * @member {string} userId
             * @memberof logic.v1.LoginRequest
             * @instance
             */
            LoginRequest.prototype.userId = "";

            /**
             * Encodes the specified LoginRequest message. Does not implicitly {@link logic.v1.LoginRequest.verify|verify} messages.
             * @function encode
             * @memberof logic.v1.LoginRequest
             * @static
             * @param {logic.v1.ILoginRequest} message LoginRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoginRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.userId);
                return writer;
            };

            /**
             * Encodes the specified LoginRequest message, length delimited. Does not implicitly {@link logic.v1.LoginRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof logic.v1.LoginRequest
             * @static
             * @param {logic.v1.ILoginRequest} message LoginRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoginRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LoginRequest message from the specified reader or buffer.
             * @function decode
             * @memberof logic.v1.LoginRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {logic.v1.LoginRequest} LoginRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoginRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.logic.v1.LoginRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.userId = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a LoginRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof logic.v1.LoginRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {logic.v1.LoginRequest} LoginRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoginRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Gets the default type url for LoginRequest
             * @function getTypeUrl
             * @memberof logic.v1.LoginRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            LoginRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/logic.v1.LoginRequest";
            };

            return LoginRequest;
        })();

        v1.LoginResponse = (function() {

            /**
             * Properties of a LoginResponse.
             * @memberof logic.v1
             * @interface ILoginResponse
             * @property {boolean|null} [success] LoginResponse success
             * @property {logic.v1.IPlayerInfo|null} [player] LoginResponse player
             * @property {string|null} [message] LoginResponse message
             */

            /**
             * Constructs a new LoginResponse.
             * @memberof logic.v1
             * @classdesc Represents a LoginResponse.
             * @implements ILoginResponse
             * @constructor
             * @param {logic.v1.ILoginResponse=} [properties] Properties to set
             */
            function LoginResponse(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LoginResponse success.
             * @member {boolean} success
             * @memberof logic.v1.LoginResponse
             * @instance
             */
            LoginResponse.prototype.success = false;

            /**
             * LoginResponse player.
             * @member {logic.v1.IPlayerInfo|null|undefined} player
             * @memberof logic.v1.LoginResponse
             * @instance
             */
            LoginResponse.prototype.player = null;

            /**
             * LoginResponse message.
             * @member {string} message
             * @memberof logic.v1.LoginResponse
             * @instance
             */
            LoginResponse.prototype.message = "";

            /**
             * Encodes the specified LoginResponse message. Does not implicitly {@link logic.v1.LoginResponse.verify|verify} messages.
             * @function encode
             * @memberof logic.v1.LoginResponse
             * @static
             * @param {logic.v1.ILoginResponse} message LoginResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoginResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
                if (message.player != null && Object.hasOwnProperty.call(message, "player"))
                    $root.logic.v1.PlayerInfo.encode(message.player, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.message);
                return writer;
            };

            /**
             * Encodes the specified LoginResponse message, length delimited. Does not implicitly {@link logic.v1.LoginResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof logic.v1.LoginResponse
             * @static
             * @param {logic.v1.ILoginResponse} message LoginResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoginResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LoginResponse message from the specified reader or buffer.
             * @function decode
             * @memberof logic.v1.LoginResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {logic.v1.LoginResponse} LoginResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoginResponse.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.logic.v1.LoginResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.success = reader.bool();
                            break;
                        }
                    case 2: {
                            message.player = $root.logic.v1.PlayerInfo.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.message = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a LoginResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof logic.v1.LoginResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {logic.v1.LoginResponse} LoginResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoginResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Gets the default type url for LoginResponse
             * @function getTypeUrl
             * @memberof logic.v1.LoginResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            LoginResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/logic.v1.LoginResponse";
            };

            return LoginResponse;
        })();

        v1.GetBagsRequest = (function() {

            /**
             * Properties of a GetBagsRequest.
             * @memberof logic.v1
             * @interface IGetBagsRequest
             * @property {string|null} [userId] GetBagsRequest userId
             */

            /**
             * Constructs a new GetBagsRequest.
             * @memberof logic.v1
             * @classdesc Represents a GetBagsRequest.
             * @implements IGetBagsRequest
             * @constructor
             * @param {logic.v1.IGetBagsRequest=} [properties] Properties to set
             */
            function GetBagsRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetBagsRequest userId.
             * @member {string} userId
             * @memberof logic.v1.GetBagsRequest
             * @instance
             */
            GetBagsRequest.prototype.userId = "";

            /**
             * Encodes the specified GetBagsRequest message. Does not implicitly {@link logic.v1.GetBagsRequest.verify|verify} messages.
             * @function encode
             * @memberof logic.v1.GetBagsRequest
             * @static
             * @param {logic.v1.IGetBagsRequest} message GetBagsRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBagsRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.userId);
                return writer;
            };

            /**
             * Encodes the specified GetBagsRequest message, length delimited. Does not implicitly {@link logic.v1.GetBagsRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof logic.v1.GetBagsRequest
             * @static
             * @param {logic.v1.IGetBagsRequest} message GetBagsRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBagsRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetBagsRequest message from the specified reader or buffer.
             * @function decode
             * @memberof logic.v1.GetBagsRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {logic.v1.GetBagsRequest} GetBagsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBagsRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.logic.v1.GetBagsRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.userId = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a GetBagsRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof logic.v1.GetBagsRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {logic.v1.GetBagsRequest} GetBagsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBagsRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Gets the default type url for GetBagsRequest
             * @function getTypeUrl
             * @memberof logic.v1.GetBagsRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetBagsRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/logic.v1.GetBagsRequest";
            };

            return GetBagsRequest;
        })();

        v1.BagItem = (function() {

            /**
             * Properties of a BagItem.
             * @memberof logic.v1
             * @interface IBagItem
             * @property {number|Long|null} [itemId] BagItem itemId
             * @property {number|Long|null} [count] BagItem count
             */

            /**
             * Constructs a new BagItem.
             * @memberof logic.v1
             * @classdesc Represents a BagItem.
             * @implements IBagItem
             * @constructor
             * @param {logic.v1.IBagItem=} [properties] Properties to set
             */
            function BagItem(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BagItem itemId.
             * @member {number|Long} itemId
             * @memberof logic.v1.BagItem
             * @instance
             */
            BagItem.prototype.itemId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * BagItem count.
             * @member {number|Long} count
             * @memberof logic.v1.BagItem
             * @instance
             */
            BagItem.prototype.count = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Encodes the specified BagItem message. Does not implicitly {@link logic.v1.BagItem.verify|verify} messages.
             * @function encode
             * @memberof logic.v1.BagItem
             * @static
             * @param {logic.v1.IBagItem} message BagItem message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BagItem.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.itemId);
                if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int64(message.count);
                return writer;
            };

            /**
             * Encodes the specified BagItem message, length delimited. Does not implicitly {@link logic.v1.BagItem.verify|verify} messages.
             * @function encodeDelimited
             * @memberof logic.v1.BagItem
             * @static
             * @param {logic.v1.IBagItem} message BagItem message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BagItem.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BagItem message from the specified reader or buffer.
             * @function decode
             * @memberof logic.v1.BagItem
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {logic.v1.BagItem} BagItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BagItem.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.logic.v1.BagItem();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.itemId = reader.int64();
                            break;
                        }
                    case 2: {
                            message.count = reader.int64();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a BagItem message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof logic.v1.BagItem
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {logic.v1.BagItem} BagItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BagItem.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Gets the default type url for BagItem
             * @function getTypeUrl
             * @memberof logic.v1.BagItem
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            BagItem.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/logic.v1.BagItem";
            };

            return BagItem;
        })();

        v1.GetBagsResponse = (function() {

            /**
             * Properties of a GetBagsResponse.
             * @memberof logic.v1
             * @interface IGetBagsResponse
             * @property {Array.<logic.v1.IBagItem>|null} [items] GetBagsResponse items
             */

            /**
             * Constructs a new GetBagsResponse.
             * @memberof logic.v1
             * @classdesc Represents a GetBagsResponse.
             * @implements IGetBagsResponse
             * @constructor
             * @param {logic.v1.IGetBagsResponse=} [properties] Properties to set
             */
            function GetBagsResponse(properties) {
                this.items = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetBagsResponse items.
             * @member {Array.<logic.v1.IBagItem>} items
             * @memberof logic.v1.GetBagsResponse
             * @instance
             */
            GetBagsResponse.prototype.items = $util.emptyArray;

            /**
             * Encodes the specified GetBagsResponse message. Does not implicitly {@link logic.v1.GetBagsResponse.verify|verify} messages.
             * @function encode
             * @memberof logic.v1.GetBagsResponse
             * @static
             * @param {logic.v1.IGetBagsResponse} message GetBagsResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBagsResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.items != null && message.items.length)
                    for (let i = 0; i < message.items.length; ++i)
                        $root.logic.v1.BagItem.encode(message.items[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetBagsResponse message, length delimited. Does not implicitly {@link logic.v1.GetBagsResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof logic.v1.GetBagsResponse
             * @static
             * @param {logic.v1.IGetBagsResponse} message GetBagsResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBagsResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetBagsResponse message from the specified reader or buffer.
             * @function decode
             * @memberof logic.v1.GetBagsResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {logic.v1.GetBagsResponse} GetBagsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBagsResponse.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.logic.v1.GetBagsResponse();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.items && message.items.length))
                                message.items = [];
                            message.items.push($root.logic.v1.BagItem.decode(reader, reader.uint32()));
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a GetBagsResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof logic.v1.GetBagsResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {logic.v1.GetBagsResponse} GetBagsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBagsResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Gets the default type url for GetBagsResponse
             * @function getTypeUrl
             * @memberof logic.v1.GetBagsResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetBagsResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/logic.v1.GetBagsResponse";
            };

            return GetBagsResponse;
        })();

        return v1;
    })();

    return logic;
})();

export const room = $root.room = (() => {

    /**
     * Namespace room.
     * @exports room
     * @namespace
     */
    const room = {};

    room.v1 = (function() {

        /**
         * Namespace v1.
         * @memberof room
         * @namespace
         */
        const v1 = {};

        v1.Member = (function() {

            /**
             * Properties of a Member.
             * @memberof room.v1
             * @interface IMember
             * @property {string|null} [userId] Member userId
             * @property {string|null} [name] Member name
             * @property {number|null} [stone] Member stone
             * @property {boolean|null} [ready] Member ready
             */

            /**
             * Constructs a new Member.
             * @memberof room.v1
             * @classdesc Represents a Member.
             * @implements IMember
             * @constructor
             * @param {room.v1.IMember=} [properties] Properties to set
             */
            function Member(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Member userId.
             * @member {string} userId
             * @memberof room.v1.Member
             * @instance
             */
            Member.prototype.userId = "";

            /**
             * Member name.
             * @member {string} name
             * @memberof room.v1.Member
             * @instance
             */
            Member.prototype.name = "";

            /**
             * Member stone.
             * @member {number} stone
             * @memberof room.v1.Member
             * @instance
             */
            Member.prototype.stone = 0;

            /**
             * Member ready.
             * @member {boolean} ready
             * @memberof room.v1.Member
             * @instance
             */
            Member.prototype.ready = false;

            /**
             * Encodes the specified Member message. Does not implicitly {@link room.v1.Member.verify|verify} messages.
             * @function encode
             * @memberof room.v1.Member
             * @static
             * @param {room.v1.IMember} message Member message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Member.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.userId);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.stone != null && Object.hasOwnProperty.call(message, "stone"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.stone);
                if (message.ready != null && Object.hasOwnProperty.call(message, "ready"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.ready);
                return writer;
            };

            /**
             * Encodes the specified Member message, length delimited. Does not implicitly {@link room.v1.Member.verify|verify} messages.
             * @function encodeDelimited
             * @memberof room.v1.Member
             * @static
             * @param {room.v1.IMember} message Member message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Member.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Member message from the specified reader or buffer.
             * @function decode
             * @memberof room.v1.Member
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {room.v1.Member} Member
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Member.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.room.v1.Member();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.userId = reader.string();
                            break;
                        }
                    case 2: {
                            message.name = reader.string();
                            break;
                        }
                    case 3: {
                            message.stone = reader.uint32();
                            break;
                        }
                    case 4: {
                            message.ready = reader.bool();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Member message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof room.v1.Member
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {room.v1.Member} Member
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Member.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Gets the default type url for Member
             * @function getTypeUrl
             * @memberof room.v1.Member
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Member.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/room.v1.Member";
            };

            return Member;
        })();

        v1.RoomSnapshot = (function() {

            /**
             * Properties of a RoomSnapshot.
             * @memberof room.v1
             * @interface IRoomSnapshot
             * @property {string|null} [roomId] RoomSnapshot roomId
             * @property {Array.<room.v1.IMember>|null} [members] RoomSnapshot members
             * @property {Array.<number>|null} [board] RoomSnapshot board
             * @property {string|null} [phase] RoomSnapshot phase
             * @property {number|null} [turn] RoomSnapshot turn
             * @property {string|null} [winnerId] RoomSnapshot winnerId
             * @property {string|null} [result] RoomSnapshot result
             * @property {number|Long|null} [version] RoomSnapshot version
             */

            /**
             * Constructs a new RoomSnapshot.
             * @memberof room.v1
             * @classdesc Represents a RoomSnapshot.
             * @implements IRoomSnapshot
             * @constructor
             * @param {room.v1.IRoomSnapshot=} [properties] Properties to set
             */
            function RoomSnapshot(properties) {
                this.members = [];
                this.board = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RoomSnapshot roomId.
             * @member {string} roomId
             * @memberof room.v1.RoomSnapshot
             * @instance
             */
            RoomSnapshot.prototype.roomId = "";

            /**
             * RoomSnapshot members.
             * @member {Array.<room.v1.IMember>} members
             * @memberof room.v1.RoomSnapshot
             * @instance
             */
            RoomSnapshot.prototype.members = $util.emptyArray;

            /**
             * RoomSnapshot board.
             * @member {Array.<number>} board
             * @memberof room.v1.RoomSnapshot
             * @instance
             */
            RoomSnapshot.prototype.board = $util.emptyArray;

            /**
             * RoomSnapshot phase.
             * @member {string} phase
             * @memberof room.v1.RoomSnapshot
             * @instance
             */
            RoomSnapshot.prototype.phase = "";

            /**
             * RoomSnapshot turn.
             * @member {number} turn
             * @memberof room.v1.RoomSnapshot
             * @instance
             */
            RoomSnapshot.prototype.turn = 0;

            /**
             * RoomSnapshot winnerId.
             * @member {string} winnerId
             * @memberof room.v1.RoomSnapshot
             * @instance
             */
            RoomSnapshot.prototype.winnerId = "";

            /**
             * RoomSnapshot result.
             * @member {string} result
             * @memberof room.v1.RoomSnapshot
             * @instance
             */
            RoomSnapshot.prototype.result = "";

            /**
             * RoomSnapshot version.
             * @member {number|Long} version
             * @memberof room.v1.RoomSnapshot
             * @instance
             */
            RoomSnapshot.prototype.version = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Encodes the specified RoomSnapshot message. Does not implicitly {@link room.v1.RoomSnapshot.verify|verify} messages.
             * @function encode
             * @memberof room.v1.RoomSnapshot
             * @static
             * @param {room.v1.IRoomSnapshot} message RoomSnapshot message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RoomSnapshot.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
                if (message.members != null && message.members.length)
                    for (let i = 0; i < message.members.length; ++i)
                        $root.room.v1.Member.encode(message.members[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.board != null && message.board.length) {
                    writer.uint32(/* id 3, wireType 2 =*/26).fork();
                    for (let i = 0; i < message.board.length; ++i)
                        writer.uint32(message.board[i]);
                    writer.ldelim();
                }
                if (message.phase != null && Object.hasOwnProperty.call(message, "phase"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.phase);
                if (message.turn != null && Object.hasOwnProperty.call(message, "turn"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.turn);
                if (message.winnerId != null && Object.hasOwnProperty.call(message, "winnerId"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.winnerId);
                if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.result);
                if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.version);
                return writer;
            };

            /**
             * Encodes the specified RoomSnapshot message, length delimited. Does not implicitly {@link room.v1.RoomSnapshot.verify|verify} messages.
             * @function encodeDelimited
             * @memberof room.v1.RoomSnapshot
             * @static
             * @param {room.v1.IRoomSnapshot} message RoomSnapshot message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RoomSnapshot.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RoomSnapshot message from the specified reader or buffer.
             * @function decode
             * @memberof room.v1.RoomSnapshot
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {room.v1.RoomSnapshot} RoomSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RoomSnapshot.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.room.v1.RoomSnapshot();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.roomId = reader.string();
                            break;
                        }
                    case 2: {
                            if (!(message.members && message.members.length))
                                message.members = [];
                            message.members.push($root.room.v1.Member.decode(reader, reader.uint32()));
                            break;
                        }
                    case 3: {
                            if (!(message.board && message.board.length))
                                message.board = [];
                            if ((tag & 7) === 2) {
                                let end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.board.push(reader.uint32());
                            } else
                                message.board.push(reader.uint32());
                            break;
                        }
                    case 4: {
                            message.phase = reader.string();
                            break;
                        }
                    case 5: {
                            message.turn = reader.uint32();
                            break;
                        }
                    case 6: {
                            message.winnerId = reader.string();
                            break;
                        }
                    case 7: {
                            message.result = reader.string();
                            break;
                        }
                    case 8: {
                            message.version = reader.uint64();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a RoomSnapshot message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof room.v1.RoomSnapshot
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {room.v1.RoomSnapshot} RoomSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RoomSnapshot.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Gets the default type url for RoomSnapshot
             * @function getTypeUrl
             * @memberof room.v1.RoomSnapshot
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RoomSnapshot.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/room.v1.RoomSnapshot";
            };

            return RoomSnapshot;
        })();

        v1.RoomRequest = (function() {

            /**
             * Properties of a RoomRequest.
             * @memberof room.v1
             * @interface IRoomRequest
             * @property {string|null} [roomId] RoomRequest roomId
             */

            /**
             * Constructs a new RoomRequest.
             * @memberof room.v1
             * @classdesc Represents a RoomRequest.
             * @implements IRoomRequest
             * @constructor
             * @param {room.v1.IRoomRequest=} [properties] Properties to set
             */
            function RoomRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RoomRequest roomId.
             * @member {string} roomId
             * @memberof room.v1.RoomRequest
             * @instance
             */
            RoomRequest.prototype.roomId = "";

            /**
             * Encodes the specified RoomRequest message. Does not implicitly {@link room.v1.RoomRequest.verify|verify} messages.
             * @function encode
             * @memberof room.v1.RoomRequest
             * @static
             * @param {room.v1.IRoomRequest} message RoomRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RoomRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
                return writer;
            };

            /**
             * Encodes the specified RoomRequest message, length delimited. Does not implicitly {@link room.v1.RoomRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof room.v1.RoomRequest
             * @static
             * @param {room.v1.IRoomRequest} message RoomRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RoomRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RoomRequest message from the specified reader or buffer.
             * @function decode
             * @memberof room.v1.RoomRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {room.v1.RoomRequest} RoomRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RoomRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.room.v1.RoomRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.roomId = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a RoomRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof room.v1.RoomRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {room.v1.RoomRequest} RoomRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RoomRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Gets the default type url for RoomRequest
             * @function getTypeUrl
             * @memberof room.v1.RoomRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RoomRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/room.v1.RoomRequest";
            };

            return RoomRequest;
        })();

        v1.PlaceStoneRequest = (function() {

            /**
             * Properties of a PlaceStoneRequest.
             * @memberof room.v1
             * @interface IPlaceStoneRequest
             * @property {string|null} [roomId] PlaceStoneRequest roomId
             * @property {number|null} [x] PlaceStoneRequest x
             * @property {number|null} [y] PlaceStoneRequest y
             */

            /**
             * Constructs a new PlaceStoneRequest.
             * @memberof room.v1
             * @classdesc Represents a PlaceStoneRequest.
             * @implements IPlaceStoneRequest
             * @constructor
             * @param {room.v1.IPlaceStoneRequest=} [properties] Properties to set
             */
            function PlaceStoneRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PlaceStoneRequest roomId.
             * @member {string} roomId
             * @memberof room.v1.PlaceStoneRequest
             * @instance
             */
            PlaceStoneRequest.prototype.roomId = "";

            /**
             * PlaceStoneRequest x.
             * @member {number} x
             * @memberof room.v1.PlaceStoneRequest
             * @instance
             */
            PlaceStoneRequest.prototype.x = 0;

            /**
             * PlaceStoneRequest y.
             * @member {number} y
             * @memberof room.v1.PlaceStoneRequest
             * @instance
             */
            PlaceStoneRequest.prototype.y = 0;

            /**
             * Encodes the specified PlaceStoneRequest message. Does not implicitly {@link room.v1.PlaceStoneRequest.verify|verify} messages.
             * @function encode
             * @memberof room.v1.PlaceStoneRequest
             * @static
             * @param {room.v1.IPlaceStoneRequest} message PlaceStoneRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PlaceStoneRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
                if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.x);
                if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.y);
                return writer;
            };

            /**
             * Encodes the specified PlaceStoneRequest message, length delimited. Does not implicitly {@link room.v1.PlaceStoneRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof room.v1.PlaceStoneRequest
             * @static
             * @param {room.v1.IPlaceStoneRequest} message PlaceStoneRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PlaceStoneRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PlaceStoneRequest message from the specified reader or buffer.
             * @function decode
             * @memberof room.v1.PlaceStoneRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {room.v1.PlaceStoneRequest} PlaceStoneRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PlaceStoneRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.room.v1.PlaceStoneRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.roomId = reader.string();
                            break;
                        }
                    case 2: {
                            message.x = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.y = reader.uint32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a PlaceStoneRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof room.v1.PlaceStoneRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {room.v1.PlaceStoneRequest} PlaceStoneRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PlaceStoneRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Gets the default type url for PlaceStoneRequest
             * @function getTypeUrl
             * @memberof room.v1.PlaceStoneRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PlaceStoneRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/room.v1.PlaceStoneRequest";
            };

            return PlaceStoneRequest;
        })();

        v1.MembershipRequest = (function() {

            /**
             * Properties of a MembershipRequest.
             * @memberof room.v1
             * @interface IMembershipRequest
             * @property {string|null} [roomId] MembershipRequest roomId
             * @property {string|null} [userId] MembershipRequest userId
             * @property {string|null} [name] MembershipRequest name
             * @property {atlas.gate.v1.ISessionRef|null} [session] MembershipRequest session
             */

            /**
             * Constructs a new MembershipRequest.
             * @memberof room.v1
             * @classdesc Represents a MembershipRequest.
             * @implements IMembershipRequest
             * @constructor
             * @param {room.v1.IMembershipRequest=} [properties] Properties to set
             */
            function MembershipRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MembershipRequest roomId.
             * @member {string} roomId
             * @memberof room.v1.MembershipRequest
             * @instance
             */
            MembershipRequest.prototype.roomId = "";

            /**
             * MembershipRequest userId.
             * @member {string} userId
             * @memberof room.v1.MembershipRequest
             * @instance
             */
            MembershipRequest.prototype.userId = "";

            /**
             * MembershipRequest name.
             * @member {string} name
             * @memberof room.v1.MembershipRequest
             * @instance
             */
            MembershipRequest.prototype.name = "";

            /**
             * MembershipRequest session.
             * @member {atlas.gate.v1.ISessionRef|null|undefined} session
             * @memberof room.v1.MembershipRequest
             * @instance
             */
            MembershipRequest.prototype.session = null;

            /**
             * Encodes the specified MembershipRequest message. Does not implicitly {@link room.v1.MembershipRequest.verify|verify} messages.
             * @function encode
             * @memberof room.v1.MembershipRequest
             * @static
             * @param {room.v1.IMembershipRequest} message MembershipRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MembershipRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
                if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.userId);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
                if (message.session != null && Object.hasOwnProperty.call(message, "session"))
                    $root.atlas.gate.v1.SessionRef.encode(message.session, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified MembershipRequest message, length delimited. Does not implicitly {@link room.v1.MembershipRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof room.v1.MembershipRequest
             * @static
             * @param {room.v1.IMembershipRequest} message MembershipRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MembershipRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MembershipRequest message from the specified reader or buffer.
             * @function decode
             * @memberof room.v1.MembershipRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {room.v1.MembershipRequest} MembershipRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MembershipRequest.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.room.v1.MembershipRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.roomId = reader.string();
                            break;
                        }
                    case 2: {
                            message.userId = reader.string();
                            break;
                        }
                    case 3: {
                            message.name = reader.string();
                            break;
                        }
                    case 4: {
                            message.session = $root.atlas.gate.v1.SessionRef.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a MembershipRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof room.v1.MembershipRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {room.v1.MembershipRequest} MembershipRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MembershipRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Gets the default type url for MembershipRequest
             * @function getTypeUrl
             * @memberof room.v1.MembershipRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MembershipRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/room.v1.MembershipRequest";
            };

            return MembershipRequest;
        })();

        return v1;
    })();

    return room;
})();

export const atlas = $root.atlas = (() => {

    /**
     * Namespace atlas.
     * @exports atlas
     * @namespace
     */
    const atlas = {};

    atlas.gate = (function() {

        /**
         * Namespace gate.
         * @memberof atlas
         * @namespace
         */
        const gate = {};

        gate.v1 = (function() {

            /**
             * Namespace v1.
             * @memberof atlas.gate
             * @namespace
             */
            const v1 = {};

            v1.Empty = (function() {

                /**
                 * Properties of an Empty.
                 * @memberof atlas.gate.v1
                 * @interface IEmpty
                 */

                /**
                 * Constructs a new Empty.
                 * @memberof atlas.gate.v1
                 * @classdesc Represents an Empty.
                 * @implements IEmpty
                 * @constructor
                 * @param {atlas.gate.v1.IEmpty=} [properties] Properties to set
                 */
                function Empty(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Encodes the specified Empty message. Does not implicitly {@link atlas.gate.v1.Empty.verify|verify} messages.
                 * @function encode
                 * @memberof atlas.gate.v1.Empty
                 * @static
                 * @param {atlas.gate.v1.IEmpty} message Empty message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Empty.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    return writer;
                };

                /**
                 * Encodes the specified Empty message, length delimited. Does not implicitly {@link atlas.gate.v1.Empty.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof atlas.gate.v1.Empty
                 * @static
                 * @param {atlas.gate.v1.IEmpty} message Empty message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Empty.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an Empty message from the specified reader or buffer.
                 * @function decode
                 * @memberof atlas.gate.v1.Empty
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {atlas.gate.v1.Empty} Empty
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Empty.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.atlas.gate.v1.Empty();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Empty message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof atlas.gate.v1.Empty
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {atlas.gate.v1.Empty} Empty
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Empty.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Gets the default type url for Empty
                 * @function getTypeUrl
                 * @memberof atlas.gate.v1.Empty
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Empty.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/atlas.gate.v1.Empty";
                };

                return Empty;
            })();

            v1.SessionRef = (function() {

                /**
                 * Properties of a SessionRef.
                 * @memberof atlas.gate.v1
                 * @interface ISessionRef
                 * @property {string|null} [gateId] SessionRef gateId
                 * @property {string|null} [sessionId] SessionRef sessionId
                 */

                /**
                 * Constructs a new SessionRef.
                 * @memberof atlas.gate.v1
                 * @classdesc Represents a SessionRef.
                 * @implements ISessionRef
                 * @constructor
                 * @param {atlas.gate.v1.ISessionRef=} [properties] Properties to set
                 */
                function SessionRef(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * SessionRef gateId.
                 * @member {string} gateId
                 * @memberof atlas.gate.v1.SessionRef
                 * @instance
                 */
                SessionRef.prototype.gateId = "";

                /**
                 * SessionRef sessionId.
                 * @member {string} sessionId
                 * @memberof atlas.gate.v1.SessionRef
                 * @instance
                 */
                SessionRef.prototype.sessionId = "";

                /**
                 * Encodes the specified SessionRef message. Does not implicitly {@link atlas.gate.v1.SessionRef.verify|verify} messages.
                 * @function encode
                 * @memberof atlas.gate.v1.SessionRef
                 * @static
                 * @param {atlas.gate.v1.ISessionRef} message SessionRef message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SessionRef.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.gateId != null && Object.hasOwnProperty.call(message, "gateId"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.gateId);
                    if (message.sessionId != null && Object.hasOwnProperty.call(message, "sessionId"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.sessionId);
                    return writer;
                };

                /**
                 * Encodes the specified SessionRef message, length delimited. Does not implicitly {@link atlas.gate.v1.SessionRef.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof atlas.gate.v1.SessionRef
                 * @static
                 * @param {atlas.gate.v1.ISessionRef} message SessionRef message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SessionRef.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a SessionRef message from the specified reader or buffer.
                 * @function decode
                 * @memberof atlas.gate.v1.SessionRef
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {atlas.gate.v1.SessionRef} SessionRef
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SessionRef.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.atlas.gate.v1.SessionRef();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.gateId = reader.string();
                                break;
                            }
                        case 2: {
                                message.sessionId = reader.string();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a SessionRef message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof atlas.gate.v1.SessionRef
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {atlas.gate.v1.SessionRef} SessionRef
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SessionRef.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Gets the default type url for SessionRef
                 * @function getTypeUrl
                 * @memberof atlas.gate.v1.SessionRef
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                SessionRef.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/atlas.gate.v1.SessionRef";
                };

                return SessionRef;
            })();

            v1.SetRequest = (function() {

                /**
                 * Properties of a SetRequest.
                 * @memberof atlas.gate.v1
                 * @interface ISetRequest
                 * @property {atlas.gate.v1.ISessionRef|null} [session] SetRequest session
                 * @property {string|null} [key] SetRequest key
                 * @property {string|null} [value] SetRequest value
                 * @property {boolean|null} [immutable] SetRequest immutable
                 */

                /**
                 * Constructs a new SetRequest.
                 * @memberof atlas.gate.v1
                 * @classdesc Represents a SetRequest.
                 * @implements ISetRequest
                 * @constructor
                 * @param {atlas.gate.v1.ISetRequest=} [properties] Properties to set
                 */
                function SetRequest(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * SetRequest session.
                 * @member {atlas.gate.v1.ISessionRef|null|undefined} session
                 * @memberof atlas.gate.v1.SetRequest
                 * @instance
                 */
                SetRequest.prototype.session = null;

                /**
                 * SetRequest key.
                 * @member {string} key
                 * @memberof atlas.gate.v1.SetRequest
                 * @instance
                 */
                SetRequest.prototype.key = "";

                /**
                 * SetRequest value.
                 * @member {string} value
                 * @memberof atlas.gate.v1.SetRequest
                 * @instance
                 */
                SetRequest.prototype.value = "";

                /**
                 * SetRequest immutable.
                 * @member {boolean} immutable
                 * @memberof atlas.gate.v1.SetRequest
                 * @instance
                 */
                SetRequest.prototype.immutable = false;

                /**
                 * Encodes the specified SetRequest message. Does not implicitly {@link atlas.gate.v1.SetRequest.verify|verify} messages.
                 * @function encode
                 * @memberof atlas.gate.v1.SetRequest
                 * @static
                 * @param {atlas.gate.v1.ISetRequest} message SetRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SetRequest.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.session != null && Object.hasOwnProperty.call(message, "session"))
                        $root.atlas.gate.v1.SessionRef.encode(message.session, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.key);
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.value);
                    if (message.immutable != null && Object.hasOwnProperty.call(message, "immutable"))
                        writer.uint32(/* id 4, wireType 0 =*/32).bool(message.immutable);
                    return writer;
                };

                /**
                 * Encodes the specified SetRequest message, length delimited. Does not implicitly {@link atlas.gate.v1.SetRequest.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof atlas.gate.v1.SetRequest
                 * @static
                 * @param {atlas.gate.v1.ISetRequest} message SetRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SetRequest.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a SetRequest message from the specified reader or buffer.
                 * @function decode
                 * @memberof atlas.gate.v1.SetRequest
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {atlas.gate.v1.SetRequest} SetRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SetRequest.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.atlas.gate.v1.SetRequest();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.session = $root.atlas.gate.v1.SessionRef.decode(reader, reader.uint32());
                                break;
                            }
                        case 2: {
                                message.key = reader.string();
                                break;
                            }
                        case 3: {
                                message.value = reader.string();
                                break;
                            }
                        case 4: {
                                message.immutable = reader.bool();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a SetRequest message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof atlas.gate.v1.SetRequest
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {atlas.gate.v1.SetRequest} SetRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SetRequest.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Gets the default type url for SetRequest
                 * @function getTypeUrl
                 * @memberof atlas.gate.v1.SetRequest
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                SetRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/atlas.gate.v1.SetRequest";
                };

                return SetRequest;
            })();

            v1.DeleteRequest = (function() {

                /**
                 * Properties of a DeleteRequest.
                 * @memberof atlas.gate.v1
                 * @interface IDeleteRequest
                 * @property {atlas.gate.v1.ISessionRef|null} [session] DeleteRequest session
                 * @property {string|null} [key] DeleteRequest key
                 */

                /**
                 * Constructs a new DeleteRequest.
                 * @memberof atlas.gate.v1
                 * @classdesc Represents a DeleteRequest.
                 * @implements IDeleteRequest
                 * @constructor
                 * @param {atlas.gate.v1.IDeleteRequest=} [properties] Properties to set
                 */
                function DeleteRequest(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * DeleteRequest session.
                 * @member {atlas.gate.v1.ISessionRef|null|undefined} session
                 * @memberof atlas.gate.v1.DeleteRequest
                 * @instance
                 */
                DeleteRequest.prototype.session = null;

                /**
                 * DeleteRequest key.
                 * @member {string} key
                 * @memberof atlas.gate.v1.DeleteRequest
                 * @instance
                 */
                DeleteRequest.prototype.key = "";

                /**
                 * Encodes the specified DeleteRequest message. Does not implicitly {@link atlas.gate.v1.DeleteRequest.verify|verify} messages.
                 * @function encode
                 * @memberof atlas.gate.v1.DeleteRequest
                 * @static
                 * @param {atlas.gate.v1.IDeleteRequest} message DeleteRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DeleteRequest.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.session != null && Object.hasOwnProperty.call(message, "session"))
                        $root.atlas.gate.v1.SessionRef.encode(message.session, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.key);
                    return writer;
                };

                /**
                 * Encodes the specified DeleteRequest message, length delimited. Does not implicitly {@link atlas.gate.v1.DeleteRequest.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof atlas.gate.v1.DeleteRequest
                 * @static
                 * @param {atlas.gate.v1.IDeleteRequest} message DeleteRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DeleteRequest.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a DeleteRequest message from the specified reader or buffer.
                 * @function decode
                 * @memberof atlas.gate.v1.DeleteRequest
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {atlas.gate.v1.DeleteRequest} DeleteRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DeleteRequest.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.atlas.gate.v1.DeleteRequest();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.session = $root.atlas.gate.v1.SessionRef.decode(reader, reader.uint32());
                                break;
                            }
                        case 2: {
                                message.key = reader.string();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a DeleteRequest message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof atlas.gate.v1.DeleteRequest
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {atlas.gate.v1.DeleteRequest} DeleteRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DeleteRequest.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Gets the default type url for DeleteRequest
                 * @function getTypeUrl
                 * @memberof atlas.gate.v1.DeleteRequest
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                DeleteRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/atlas.gate.v1.DeleteRequest";
                };

                return DeleteRequest;
            })();

            v1.PushRequest = (function() {

                /**
                 * Properties of a PushRequest.
                 * @memberof atlas.gate.v1
                 * @interface IPushRequest
                 * @property {atlas.gate.v1.ISessionRef|null} [session] PushRequest session
                 * @property {string|null} [method] PushRequest method
                 * @property {Uint8Array|null} [payload] PushRequest payload
                 */

                /**
                 * Constructs a new PushRequest.
                 * @memberof atlas.gate.v1
                 * @classdesc Represents a PushRequest.
                 * @implements IPushRequest
                 * @constructor
                 * @param {atlas.gate.v1.IPushRequest=} [properties] Properties to set
                 */
                function PushRequest(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * PushRequest session.
                 * @member {atlas.gate.v1.ISessionRef|null|undefined} session
                 * @memberof atlas.gate.v1.PushRequest
                 * @instance
                 */
                PushRequest.prototype.session = null;

                /**
                 * PushRequest method.
                 * @member {string} method
                 * @memberof atlas.gate.v1.PushRequest
                 * @instance
                 */
                PushRequest.prototype.method = "";

                /**
                 * PushRequest payload.
                 * @member {Uint8Array} payload
                 * @memberof atlas.gate.v1.PushRequest
                 * @instance
                 */
                PushRequest.prototype.payload = $util.newBuffer([]);

                /**
                 * Encodes the specified PushRequest message. Does not implicitly {@link atlas.gate.v1.PushRequest.verify|verify} messages.
                 * @function encode
                 * @memberof atlas.gate.v1.PushRequest
                 * @static
                 * @param {atlas.gate.v1.IPushRequest} message PushRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PushRequest.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.session != null && Object.hasOwnProperty.call(message, "session"))
                        $root.atlas.gate.v1.SessionRef.encode(message.session, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.method != null && Object.hasOwnProperty.call(message, "method"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.method);
                    if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
                        writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.payload);
                    return writer;
                };

                /**
                 * Encodes the specified PushRequest message, length delimited. Does not implicitly {@link atlas.gate.v1.PushRequest.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof atlas.gate.v1.PushRequest
                 * @static
                 * @param {atlas.gate.v1.IPushRequest} message PushRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PushRequest.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a PushRequest message from the specified reader or buffer.
                 * @function decode
                 * @memberof atlas.gate.v1.PushRequest
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {atlas.gate.v1.PushRequest} PushRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PushRequest.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.atlas.gate.v1.PushRequest();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.session = $root.atlas.gate.v1.SessionRef.decode(reader, reader.uint32());
                                break;
                            }
                        case 2: {
                                message.method = reader.string();
                                break;
                            }
                        case 3: {
                                message.payload = reader.bytes();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a PushRequest message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof atlas.gate.v1.PushRequest
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {atlas.gate.v1.PushRequest} PushRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PushRequest.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Gets the default type url for PushRequest
                 * @function getTypeUrl
                 * @memberof atlas.gate.v1.PushRequest
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                PushRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/atlas.gate.v1.PushRequest";
                };

                return PushRequest;
            })();

            /**
             * PushCode enum.
             * @name atlas.gate.v1.PushCode
             * @enum {number}
             * @property {number} PUSH_CODE_UNSPECIFIED=0 PUSH_CODE_UNSPECIFIED value
             * @property {number} PUSH_CODE_ENQUEUED=1 PUSH_CODE_ENQUEUED value
             * @property {number} PUSH_CODE_SESSION_CHANGED=2 PUSH_CODE_SESSION_CHANGED value
             */
            v1.PushCode = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "PUSH_CODE_UNSPECIFIED"] = 0;
                values[valuesById[1] = "PUSH_CODE_ENQUEUED"] = 1;
                values[valuesById[2] = "PUSH_CODE_SESSION_CHANGED"] = 2;
                return values;
            })();

            v1.PushResponse = (function() {

                /**
                 * Properties of a PushResponse.
                 * @memberof atlas.gate.v1
                 * @interface IPushResponse
                 * @property {atlas.gate.v1.PushCode|null} [code] PushResponse code
                 */

                /**
                 * Constructs a new PushResponse.
                 * @memberof atlas.gate.v1
                 * @classdesc Represents a PushResponse.
                 * @implements IPushResponse
                 * @constructor
                 * @param {atlas.gate.v1.IPushResponse=} [properties] Properties to set
                 */
                function PushResponse(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * PushResponse code.
                 * @member {atlas.gate.v1.PushCode} code
                 * @memberof atlas.gate.v1.PushResponse
                 * @instance
                 */
                PushResponse.prototype.code = 0;

                /**
                 * Encodes the specified PushResponse message. Does not implicitly {@link atlas.gate.v1.PushResponse.verify|verify} messages.
                 * @function encode
                 * @memberof atlas.gate.v1.PushResponse
                 * @static
                 * @param {atlas.gate.v1.IPushResponse} message PushResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PushResponse.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
                    return writer;
                };

                /**
                 * Encodes the specified PushResponse message, length delimited. Does not implicitly {@link atlas.gate.v1.PushResponse.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof atlas.gate.v1.PushResponse
                 * @static
                 * @param {atlas.gate.v1.IPushResponse} message PushResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PushResponse.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a PushResponse message from the specified reader or buffer.
                 * @function decode
                 * @memberof atlas.gate.v1.PushResponse
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {atlas.gate.v1.PushResponse} PushResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PushResponse.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.atlas.gate.v1.PushResponse();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.code = reader.int32();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a PushResponse message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof atlas.gate.v1.PushResponse
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {atlas.gate.v1.PushResponse} PushResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PushResponse.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Gets the default type url for PushResponse
                 * @function getTypeUrl
                 * @memberof atlas.gate.v1.PushResponse
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                PushResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/atlas.gate.v1.PushResponse";
                };

                return PushResponse;
            })();

            /**
             * DisconnectReason enum.
             * @name atlas.gate.v1.DisconnectReason
             * @enum {number}
             * @property {number} DISCONNECT_REASON_UNSPECIFIED=0 DISCONNECT_REASON_UNSPECIFIED value
             * @property {number} DISCONNECT_REASON_AUTH_FAILED=1 DISCONNECT_REASON_AUTH_FAILED value
             * @property {number} DISCONNECT_REASON_LOGGED_IN_ELSEWHERE=2 DISCONNECT_REASON_LOGGED_IN_ELSEWHERE value
             * @property {number} DISCONNECT_REASON_SERVER_REQUEST=3 DISCONNECT_REASON_SERVER_REQUEST value
             * @property {number} DISCONNECT_REASON_CLIENT_CLOSED=4 DISCONNECT_REASON_CLIENT_CLOSED value
             * @property {number} DISCONNECT_REASON_NETWORK_ERROR=5 DISCONNECT_REASON_NETWORK_ERROR value
             * @property {number} DISCONNECT_REASON_SERVER_SHUTDOWN=6 DISCONNECT_REASON_SERVER_SHUTDOWN value
             * @property {number} DISCONNECT_REASON_SLOW_CLIENT=7 DISCONNECT_REASON_SLOW_CLIENT value
             * @property {number} DISCONNECT_REASON_PROTOCOL_ERROR=8 DISCONNECT_REASON_PROTOCOL_ERROR value
             * @property {number} DISCONNECT_REASON_IDLE_TIMEOUT=9 DISCONNECT_REASON_IDLE_TIMEOUT value
             */
            v1.DisconnectReason = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "DISCONNECT_REASON_UNSPECIFIED"] = 0;
                values[valuesById[1] = "DISCONNECT_REASON_AUTH_FAILED"] = 1;
                values[valuesById[2] = "DISCONNECT_REASON_LOGGED_IN_ELSEWHERE"] = 2;
                values[valuesById[3] = "DISCONNECT_REASON_SERVER_REQUEST"] = 3;
                values[valuesById[4] = "DISCONNECT_REASON_CLIENT_CLOSED"] = 4;
                values[valuesById[5] = "DISCONNECT_REASON_NETWORK_ERROR"] = 5;
                values[valuesById[6] = "DISCONNECT_REASON_SERVER_SHUTDOWN"] = 6;
                values[valuesById[7] = "DISCONNECT_REASON_SLOW_CLIENT"] = 7;
                values[valuesById[8] = "DISCONNECT_REASON_PROTOCOL_ERROR"] = 8;
                values[valuesById[9] = "DISCONNECT_REASON_IDLE_TIMEOUT"] = 9;
                return values;
            })();

            v1.DisconnectRequest = (function() {

                /**
                 * Properties of a DisconnectRequest.
                 * @memberof atlas.gate.v1
                 * @interface IDisconnectRequest
                 * @property {atlas.gate.v1.ISessionRef|null} [session] DisconnectRequest session
                 * @property {atlas.gate.v1.DisconnectReason|null} [reason] DisconnectRequest reason
                 */

                /**
                 * Constructs a new DisconnectRequest.
                 * @memberof atlas.gate.v1
                 * @classdesc Represents a DisconnectRequest.
                 * @implements IDisconnectRequest
                 * @constructor
                 * @param {atlas.gate.v1.IDisconnectRequest=} [properties] Properties to set
                 */
                function DisconnectRequest(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * DisconnectRequest session.
                 * @member {atlas.gate.v1.ISessionRef|null|undefined} session
                 * @memberof atlas.gate.v1.DisconnectRequest
                 * @instance
                 */
                DisconnectRequest.prototype.session = null;

                /**
                 * DisconnectRequest reason.
                 * @member {atlas.gate.v1.DisconnectReason} reason
                 * @memberof atlas.gate.v1.DisconnectRequest
                 * @instance
                 */
                DisconnectRequest.prototype.reason = 0;

                /**
                 * Encodes the specified DisconnectRequest message. Does not implicitly {@link atlas.gate.v1.DisconnectRequest.verify|verify} messages.
                 * @function encode
                 * @memberof atlas.gate.v1.DisconnectRequest
                 * @static
                 * @param {atlas.gate.v1.IDisconnectRequest} message DisconnectRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DisconnectRequest.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.session != null && Object.hasOwnProperty.call(message, "session"))
                        $root.atlas.gate.v1.SessionRef.encode(message.session, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.reason != null && Object.hasOwnProperty.call(message, "reason"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.reason);
                    return writer;
                };

                /**
                 * Encodes the specified DisconnectRequest message, length delimited. Does not implicitly {@link atlas.gate.v1.DisconnectRequest.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof atlas.gate.v1.DisconnectRequest
                 * @static
                 * @param {atlas.gate.v1.IDisconnectRequest} message DisconnectRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DisconnectRequest.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a DisconnectRequest message from the specified reader or buffer.
                 * @function decode
                 * @memberof atlas.gate.v1.DisconnectRequest
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {atlas.gate.v1.DisconnectRequest} DisconnectRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DisconnectRequest.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.atlas.gate.v1.DisconnectRequest();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.session = $root.atlas.gate.v1.SessionRef.decode(reader, reader.uint32());
                                break;
                            }
                        case 2: {
                                message.reason = reader.int32();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a DisconnectRequest message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof atlas.gate.v1.DisconnectRequest
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {atlas.gate.v1.DisconnectRequest} DisconnectRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DisconnectRequest.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Gets the default type url for DisconnectRequest
                 * @function getTypeUrl
                 * @memberof atlas.gate.v1.DisconnectRequest
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                DisconnectRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/atlas.gate.v1.DisconnectRequest";
                };

                return DisconnectRequest;
            })();

            v1.OnDisconnectRequest = (function() {

                /**
                 * Properties of an OnDisconnectRequest.
                 * @memberof atlas.gate.v1
                 * @interface IOnDisconnectRequest
                 * @property {atlas.gate.v1.ISessionRef|null} [session] OnDisconnectRequest session
                 * @property {atlas.gate.v1.DisconnectReason|null} [reason] OnDisconnectRequest reason
                 */

                /**
                 * Constructs a new OnDisconnectRequest.
                 * @memberof atlas.gate.v1
                 * @classdesc Represents an OnDisconnectRequest.
                 * @implements IOnDisconnectRequest
                 * @constructor
                 * @param {atlas.gate.v1.IOnDisconnectRequest=} [properties] Properties to set
                 */
                function OnDisconnectRequest(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * OnDisconnectRequest session.
                 * @member {atlas.gate.v1.ISessionRef|null|undefined} session
                 * @memberof atlas.gate.v1.OnDisconnectRequest
                 * @instance
                 */
                OnDisconnectRequest.prototype.session = null;

                /**
                 * OnDisconnectRequest reason.
                 * @member {atlas.gate.v1.DisconnectReason} reason
                 * @memberof atlas.gate.v1.OnDisconnectRequest
                 * @instance
                 */
                OnDisconnectRequest.prototype.reason = 0;

                /**
                 * Encodes the specified OnDisconnectRequest message. Does not implicitly {@link atlas.gate.v1.OnDisconnectRequest.verify|verify} messages.
                 * @function encode
                 * @memberof atlas.gate.v1.OnDisconnectRequest
                 * @static
                 * @param {atlas.gate.v1.IOnDisconnectRequest} message OnDisconnectRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                OnDisconnectRequest.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.session != null && Object.hasOwnProperty.call(message, "session"))
                        $root.atlas.gate.v1.SessionRef.encode(message.session, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.reason != null && Object.hasOwnProperty.call(message, "reason"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.reason);
                    return writer;
                };

                /**
                 * Encodes the specified OnDisconnectRequest message, length delimited. Does not implicitly {@link atlas.gate.v1.OnDisconnectRequest.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof atlas.gate.v1.OnDisconnectRequest
                 * @static
                 * @param {atlas.gate.v1.IOnDisconnectRequest} message OnDisconnectRequest message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                OnDisconnectRequest.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an OnDisconnectRequest message from the specified reader or buffer.
                 * @function decode
                 * @memberof atlas.gate.v1.OnDisconnectRequest
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {atlas.gate.v1.OnDisconnectRequest} OnDisconnectRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                OnDisconnectRequest.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.atlas.gate.v1.OnDisconnectRequest();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.session = $root.atlas.gate.v1.SessionRef.decode(reader, reader.uint32());
                                break;
                            }
                        case 2: {
                                message.reason = reader.int32();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an OnDisconnectRequest message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof atlas.gate.v1.OnDisconnectRequest
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {atlas.gate.v1.OnDisconnectRequest} OnDisconnectRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                OnDisconnectRequest.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Gets the default type url for OnDisconnectRequest
                 * @function getTypeUrl
                 * @memberof atlas.gate.v1.OnDisconnectRequest
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                OnDisconnectRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/atlas.gate.v1.OnDisconnectRequest";
                };

                return OnDisconnectRequest;
            })();

            return v1;
        })();

        return gate;
    })();

    return atlas;
})();

export { $root as default };
