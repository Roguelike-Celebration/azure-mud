import React, { useContext } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { DispatchContext, UserMapContext } from "../App";
import {
  StartWhisperAction,
  ShowProfileAction,
  BanToggleAction,
} from "../Actions";

export default (props: { userId: string; id?: string }) => {
  const dispatch = useContext(DispatchContext);
  const userMap = useContext(UserMapContext);

  const user = userMap[props.userId];
  const username = user && user.username;
  const isMod = user && user.isMod;
  const isBanned = user && user.isBanned;

  const handleWhisper = (e, data) => {
    dispatch(StartWhisperAction(data.id));
  };

  const handleProfile = (e, data) => {
    dispatch(ShowProfileAction(data.id));
  };

  const handleBan = (e, data) => {
    const doBan = confirm(
      `Are you sure you would like to ${isBanned ? "unban" : "ban"} the user '${
        data.username
      }'?`
    );
    if (doBan) {
      dispatch(BanToggleAction(data.id));
    }
  };

  // TODO: need to know if the current user is a mod
  const banButton = (
    <MenuItem
      data={{ id: props.userId, username: username }}
      onClick={handleBan}
    >
      {isBanned ? "Unban" : "Ban"}
    </MenuItem>
  );

  return (
    <span className="name">
      <ContextMenuTrigger id={props.id} renderTag="span">
        <strong>
          {username ? username : "unknown"}
          {isMod ? "👑" : ""}
        </strong>
      </ContextMenuTrigger>
      <ContextMenu id={props.id}>
        <MenuItem data={{ id: props.userId }} onClick={handleProfile}>
          Profile
        </MenuItem>
        <MenuItem data={{ id: props.userId }} onClick={handleWhisper}>
          Whisper
        </MenuItem>
        {banButton}
      </ContextMenu>
    </span>
  );
};
