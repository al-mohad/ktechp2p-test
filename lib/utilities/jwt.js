"use strict";
// import jwt from "jsonwebtoken";
// import config from "../configs/default";
Object.defineProperty(exports, "__esModule", { value: true });
// export function signJWT(object: Object,
//     keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
//     options?: jwt.SignOptions | undefined,
// ) {
//     const key = config[keyName]
//     const signingKey = Buffer.from(key, 'base64').toString("ascii")
//     return jwt.sign(object, signingKey, {
//         ...(options && options),
//         algorithm: 'RS256'
//     })
// }
// export function verifyJWT(token: string,
//     keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey',
// ) {
//     const key = config[keyName]
//     const signingKey = Buffer.from(key, 'base64').toString("ascii")
//     try {
//         const decoded = jwt.verify(token, signingKey)
//         return decoded
//     } catch (error) {
//         return null
//     }
// }
//# sourceMappingURL=jwt.js.map