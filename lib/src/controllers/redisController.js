"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisController = void 0;
const redis_1 = require("redis");
class RedisController {
    // readonly uri = "rediss://red-cile2515rnuvtgrtm5qg:UNuSR5JFLRCVKSVbHIZHJN4EsiRReVOo@frankfurt-redis.render.com:6379"
    uri = process.env.REDIS_CLIENT_URL;
    clientOptions = {
        host: 'rediss://red-cile2515rnuvtgrtm5qg:UNuSR5JFLRCVKSVbHIZHJN4EsiRReVOo@frankfurt-redis.render.com:6379',
        port: 6379,
    };
    client = (0, redis_1.createClient)({ url: this.uri });
    constructor() {
        this.client.connect();
        this.client.on('connect', () => {
            console.log('Client Connecting to Redis ...');
        })
            .on('ready', async () => {
            console.log('Client Connected to Redis!');
        })
            .on('reconnecting', () => {
            console.log('Client Reconnected to Redis!');
        })
            .on('end', () => {
            console.log('Client disonnected from Redis!');
        })
            .on('error', err => {
            console.log('Client Redis error ... >> ', err);
        });
    }
    async read(key) {
        try {
            let data = await this.client.get(key);
            return data;
        }
        catch (e) {
            console.log(e);
        }
    }
    async write(key, value) {
        try {
            await this.client.set(key, value);
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.redisController = new RedisController();
//# sourceMappingURL=redisController.js.map