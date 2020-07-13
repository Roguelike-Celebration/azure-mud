import * as React from "react";
import { Room } from "../Room";
import { moveToRoom } from "../networking";

export default (props: { room?: Room }) => {
  const { room } = props;

  // This is very silly.
  // Since we're manually setting raw HTML, we can't get refs to add proper click handlers
  // Instead, we just hijack ALL clicks in the description, and check if they're for a link
  const descriptionClick = (e) => {
    const roomId =
      e.target && e.target.getAttribute && e.target.getAttribute("data-room");
    if (roomId) {
      moveToRoom(roomId);
    }
  };

  return (
    <div id="room">
      <h1 id="room-name">{room ? room.name : "Loading..."}</h1>
      <div
        id="static-room-description"
        onClick={descriptionClick}
        dangerouslySetInnerHTML={{
          __html: room ? room.description : "Loading current room...",
        }}
      />

      <div id="dynamic-room-description">
        {room ? presenceString(room.users) : ""}
      </div>
    </div>
  );
};

function presenceString(users: string[]): string {
  console.log("Rendering presence", users);
  users = users.filter((u) => u !== localStorage.getItem("name"));
  let names = "";

  if (users.length === 0) {
    return "You are all alone here.";
  }

  if (users.length === 1) {
    names = users[0];
  } else if (users.length === 2) {
    names = `${users[0]} and ${users[1]}`;
  } else {
    names = `${users.slice(0, users.length - 1).join(", ")}, and ${
      users[users.length - 1]
    }`;
  }

  // TODO: Bold these
  return `Also here ${users.length === 1 ? "is" : "are"} ${names}.`;
}
