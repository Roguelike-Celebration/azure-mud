import redis = require("redis");
import { promisify } from "util";

const cache = redis.createClient(
  parseInt(process.env.RedisPort),
  process.env.RedisHostname,
  {
    auth_pass: process.env.RedisKey,
    tls: { servername: process.env.RedisHostname },
  }
);

export const getCache = promisify(cache.get).bind(cache);
export const setCache = promisify(cache.set).bind(cache);

export function roomPresenceKey(roomName: string): string {
  return `${roomName}Presence`;
}
