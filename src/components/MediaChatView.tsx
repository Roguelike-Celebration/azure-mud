import React, { useEffect, VideoHTMLAttributes, useRef, useState } from "react";
import NameView from "./NameView";
import {
  localMediaStream,
  otherMediaStreams,
  toggleAudio,
  toggleVideo,
} from "../webRTC";
import LocalMediaView from "./LocalMediaView";

// TODO: We should allow you to not send media but still consume it
interface MediaProps {
  peerIds?: string[];
}

export default function (props: MediaProps) {
  let playerVideo, otherVideos;

  playerVideo = <LocalMediaView />;

  // We don't actually use `peerIds` other than as a way to force the component to update.
  // That might change?
  otherVideos = Object.entries(otherMediaStreams()).map(([peerId, stream]) => {
    return (
      <div>
        <NameView userId={peerId} id={`stream-nameview-${peerId}`} />:
        <Video srcObject={stream} id={`stream-${peerId}`} />
      </div>
    );
  });

  return (
    <div>
      {playerVideo} {otherVideos}
    </div>
  );
}

// via https://github.com/facebook/react/issues/11163
type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream;
};

export function Video({ srcObject, ...props }: PropsType) {
  const refVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!refVideo.current) return;
    console.log(srcObject);
    refVideo.current.srcObject = srcObject;
  }, [srcObject]);

  return <video ref={refVideo} {...props} autoPlay />;
}
