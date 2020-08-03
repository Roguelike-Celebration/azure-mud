import React from "react";
import { Room } from "../Room";
import { moveToRoom } from "../networking";

interface Props {
  rooms: Room[];
}

export default function (props: Props) {
  return (
    <nav>
      {props.rooms.map((r) => (
        <RoomListItem room={r} key={`room-sidebar-${r.id}`} />
      ))}
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
