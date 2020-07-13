import { getCache, setCache } from "./redis";

/** All of these store heartbeats as Unix timestamps as numbers.
 * When I stored either a timestamp number or a ISO8601 string,
 * constructing a new Date() object was returning an invalid object.
 *
 * Since I'm just compring Unix timestamps anyway, this is a lazy solution.
 */
const activeUsersKey = "activeUsersList";
export async function getHeartbeatData(): Promise<{
  [userId: string]: number;
}> {
  const activeUsers: string[] =
    JSON.parse(await getCache(activeUsersKey)) || [];

  let data: { [userId: string]: number } = {};

  let dates = await Promise.all(
    activeUsers.map(async (u) => await getUserHeartbeat(u))
  );

  for (let i = 0; i < activeUsers.length; i++) {
    const user = activeUsers[i];
    const date = dates[i];
    data[user] = date;
  }

  return data;
}

export async function setActiveUsers(users: string[]) {
  return await setCache(activeUsersKey, JSON.stringify(users));
}

export async function getActiveUsers(): Promise<string[]> {
  return JSON.parse(await getCache(activeUsersKey)) || [];
}

async function getUserHeartbeat(userId: string): Promise<number> {
  return await getCache(heartbeatKeyForUser(userId));
}

export async function setUserHeartbeat(userId: string) {
  await setCache(heartbeatKeyForUser(userId), new Date().valueOf());

  const activeUsers = await getActiveUsers();
  if (!activeUsers.includes(userId)) {
    activeUsers.push(userId);
    await setActiveUsers(activeUsers);
  }
}

export function heartbeatKeyForUser(user: string): string {
  return `${user}Heartbeat`;
}
