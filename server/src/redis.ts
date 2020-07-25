import redis = require("redis");
import { promisify } from "util";
import { User, isMod, MinimalUser } from "./user";

import Database from "./database";

const cache = redis.createClient(
  parseInt(process.env.RedisPort),
  process.env.RedisHostname,
  {
    auth_pass: process.env.RedisKey,
    tls: { servername: process.env.RedisHostname },
  }
);

const getCache = promisify(cache.get).bind(cache);
const setCache = promisify(cache.set).bind(cache);

const Redis: Database = {
  async getActiveUsers() {
    return JSON.parse(await getCache(activeUsersKey)) || [];
  },
  async setActiveUsers(users: string[]) {
    return await setCache(activeUsersKey, JSON.stringify(users));
  },

  async getUserHeartbeat(userId: string): Promise<number> {
    return await getCache(heartbeatKeyForUser(userId));
  },

  async setUserHeartbeat(userId: string) {
    await setCache(heartbeatKeyForUser(userId), new Date().valueOf());
  },

  // TODO: This could theoretically use Redis lists
  async setUserAsActive(userId: string) {
    const activeUsers = await Redis.getActiveUsers();
    if (!activeUsers.includes(userId)) {
      activeUsers.push(userId);
      await Redis.setActiveUsers(activeUsers);
    }
  },

  // Room presence

  async roomOccupants(roomId: string) {
    const presenceKey = roomPresenceKey(roomId);
    return JSON.parse(await getCache(presenceKey)) || [];
  },

  async setRoomOccupants(roomId: string, occupants: string[]) {
    const presenceKey = roomPresenceKey(roomId);
    await setCache(presenceKey, JSON.stringify(occupants));
  },

  async setCurrentRoomForUser(userId: string, roomId: string) {
    await setCache(roomKeyForUser(userId), roomId);
  },

  async currentRoomForUser(userId: string) {
    return await getCache(roomKeyForUser(userId));
  },

  // User
  async getPublicUser(userId: string) {
    const user: User = JSON.parse(await getCache(profileKeyForUser(userId)));

    if (isMod(user.id)) {
      user.isMod = true;
    }

    return user;
  },

  async setUserProfile(userId: string, data: User) {
    delete data.isMod;
    return await setCache(profileKeyForUser(userId), JSON.stringify(data));
  },

  async getMinimalProfileForUser(userId: string) {
    const user = JSON.parse(await getCache(usernameKeyForUser(userId)));

    if (isMod(userId)) {
      user.isMod = true;
    }
    return user;
  },

  async setMinimalProfileForUser(userId: string, data: MinimalUser) {
    delete data.isMod;
    return await setCache(usernameKeyForUser(userId), JSON.stringify(data));
  },

  async lastShoutedForUser(userId: string) {
    const date = await getCache(shoutKeyForUser(userId));
    if (date) {
      return new Date(JSON.parse(date));
    }
  },

  async userJustShouted(userId: string) {
    await setCache(shoutKeyForUser(userId), JSON.stringify(new Date()));
  },
};

const activeUsersKey = "activeUsersList";

function shoutKeyForUser(user: string): string {
  return `${user}Shout`;
}

function usernameKeyForUser(userId: string): string {
  return `${userId}Handle`;
}

function profileKeyForUser(userId: string): string {
  return `${userId}Profile`;
}

function heartbeatKeyForUser(user: string): string {
  return `${user}Heartbeat`;
}

export function roomPresenceKey(roomName: string): string {
  return `${roomName}Presence`;
}

export function roomKeyForUser(user: string): string {
  return `${user}Room`;
}

export function roomKey(name: string) {
  return `${name}RoomData`;
}

export default Redis;
