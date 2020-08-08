import React from "react";
import { Room } from "../room";
import { moveToRoom } from "../networking";
import MenuButtonView from "./MenuButtonView";

import "../../style/nav.css";

interface Props {
  rooms: Room[];
  username: string;
}

export default function (props: Props) {
  return (
    <nav id="side-menu" role="navigation" aria-label="List of rooms you can navigate to">
      <MenuButtonView username={props.username} />
      <ul>
        {props.rooms.map((r) => (
          <RoomListItem room={r} key={`room-sidebar-${r.id}`} />
        ))}
      </ul>
    </nav>
  );
}

const RoomListItem = (props: { room: Room }) => {
  const { room } = props;

  const onClick = () => {
    moveToRoom(room.id);
  };

  return (
    <li>
      <button onClick={onClick}>
        <strong>{room.name}</strong> {room.users ? `(${room.users.length})` : ""}    
      </button>
    </li>
  );
};
