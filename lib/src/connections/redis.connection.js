"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriber = exports.publisher = exports.client = void 0;
const redis = __importStar(require("redis"));
// const { host, password, port } = require('../config').redis;
const uri = "rediss://red-cile2515rnuvtgrtm5qg:UNuSR5JFLRCVKSVbHIZHJN4EsiRReVOo@frankfurt-redis.render.com:6379";
// Create a Redis subscriber client
const subscriber = redis.createClient({
    url: uri
});
exports.subscriber = subscriber;
// Create a Redis publisher client
const publisher = redis.createClient({
    url: uri
});
exports.publisher = publisher;
const client = redis.createClient({
    url: uri
});
exports.client = client;
publisher.on('connect', () => {
    console.log('publisher Connecting to Redis ...');
})
    .on('ready', async () => {
    console.log('publisher Connected to Redis!');
})
    .on('reconnecting', () => {
    console.log('publisher Reconnected to Redis!');
})
    .on('end', () => {
    console.log('publisher disonnected from Redis!');
})
    .on('error', err => {
    console.log('publisher Redis error ... >> ', err);
});
client.on('connect', () => {
    console.log('client Connecting to Redis ...');
})
    .on('ready', async () => {
    console.log('client Connected to Redis!');
})
    .on('reconnecting', () => {
    console.log('client Reconnected to Redis!');
})
    .on('end', () => {
    console.log('client disonnected from Redis!');
})
    .on('error', err => {
    console.log('client Redis error ... >> ', err);
});
subscriber.on('connect', () => {
    console.log('subscriber Connecting to Redis ...');
})
    .on('ready', async () => {
    console.log('subscriber Connected to Redis!');
})
    .on('reconnecting', () => {
    console.log('subscriber Reconnected to Redis!');
})
    .on('end', () => {
    console.log('subscriber disonnected from Redis!');
})
    .on('error', err => {
    console.log('subscriber Redis error ... >> ', err);
});
//# sourceMappingURL=redis.connection.js.map