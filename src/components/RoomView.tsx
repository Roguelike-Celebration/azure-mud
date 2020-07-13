import * as React from "react";
import { Room } from "../Room";

export default (props: { room?: Room }) => {
  const { room } = props;
  return (
    <div id="room">
      <h1 id="room-name">{room ? room.name : "Loading..."}</h1>
      <div
        id="static-room-description"
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
