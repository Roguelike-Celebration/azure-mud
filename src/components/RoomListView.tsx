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

  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
  return (
    <li>
      <span onClick={onClick} role="link">
        <strong>{room.name}</strong> {room.users ? `(${room.users.length})` : ""}    
      </span>
    </li>
  );
};
