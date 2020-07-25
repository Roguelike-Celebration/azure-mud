import React, { useContext } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { DispatchContext, UserMapContext } from "../App";
import { StartWhisperAction, ShowProfileAction } from "../Actions";

export default (props: { userId: string; id?: string }) => {
  const dispatch = useContext(DispatchContext);
  const userMap = useContext(UserMapContext);

  const handleWhisper = (e, data) => {
    dispatch(StartWhisperAction(data.name));
  };

  const handleProfile = (e, data) => {
    dispatch(ShowProfileAction(data.name));
  };

  const user = userMap[props.userId];
  const username = user && user.username;
  const isMod = user && user.isMod;

  return (
    <span className="name">
      <ContextMenuTrigger id={props.id} renderTag="span">
        <strong>
          {username ? username : "unknown"}
          {isMod ? "👑" : ""}
        </strong>
      </ContextMenuTrigger>
      <ContextMenu id={props.id}>
        <MenuItem data={{ name: props.userId }} onClick={handleProfile}>
          Profile
        </MenuItem>
        <MenuItem data={{ name: props.userId }} onClick={handleWhisper}>
          Whisper
        </MenuItem>
      </ContextMenu>
    </span>
  );
};
