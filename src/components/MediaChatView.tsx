import React, {
  useEffect,
  useContext,
  useState,
  VideoHTMLAttributes,
  useRef,
} from "react";
import NameView from "./NameView";

// TODO: We should allow you to not send media but still consume it
interface MediaProps {
  playerStream: MediaStream;
  otherStreams?: { [peerId: string]: MediaStream };
}

export default function (props: MediaProps) {
  const { playerStream, otherStreams } = props;
  let playerVideo, otherVideos;
  playerVideo = (
    <div id="my-video">
      You:
      <Video srcObject={playerStream} />
    </div>
  );

  if (otherStreams) {
    otherVideos = Object.entries(otherStreams).map(([peerId, stream]) => {
      return (
        <div>
          <NameView userId={peerId} id={`stream-${peerId}`} />:
          <Video srcObject={stream} />
        </div>
      );
    });
  }

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
    refVideo.current.srcObject = srcObject;
  }, [srcObject]);

  return <video ref={refVideo} {...props} />;
}
