import { Room } from "./room";

export interface User {
  id: string;
  roomId: string;
  lastShouted?: Date;

  realName?: string;
  description?: string;
  pronouns: string;

  twitterHandle?: string;
  url?: string;
  askMeAbout?: string;

  // Right now, fetching a room given a roomId doesn't hit redis.
  // If that changes, we might want to make this lazy
  room: Room;
}
