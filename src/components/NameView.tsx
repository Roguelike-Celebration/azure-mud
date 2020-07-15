import React, { useContext } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { DispatchContext } from "../App";
import { StartWhisperAction, ShowProfileAction } from "../Actions";

export default (props: { name: string; id: string }) => {
  const dispatch = useContext(DispatchContext);

  const handleWhisper = (e, data) => {
    dispatch(StartWhisperAction(data.name));
  };

  const handleProfile = (e, data) => {
    dispatch(ShowProfileAction(data.name));
  };

  return (
    <span className="name">
      <ContextMenuTrigger id={props.id} renderTag="span">
        <strong>{props.name}</strong>
      </ContextMenuTrigger>
      <ContextMenu id={props.id}>
        <MenuItem data={{ name: props.name }} onClick={handleProfile}>
          Profile
        </MenuItem>
        <MenuItem data={{ name: props.name }} onClick={handleWhisper}>
          Whisper
        </MenuItem>
      </ContextMenu>
    </span>
  );
};
