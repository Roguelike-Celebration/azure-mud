import React from "react";
import { Room } from "../Room";
import { moveToRoom } from "../networking";
import MenuButtonView from "./MenuButtonView";

import "../../style/nav.css";

interface Props {
  rooms: Room[];
  username: string;
}

export default function (props: Props) {
  return (
    <nav id="side-menu">
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
    <li onClick={onClick} role="button">
      <strong>{room.name}</strong> {room.users ? `(${room.users.length})` : ""}
    </li>
  );
};
