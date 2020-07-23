import * as React from "react";
import { Room } from "../Room";
import { moveToRoom } from "../networking";
import NameView from "./NameView";

export default (props: { room?: Room }) => {
  const { room } = props;

  // This is very silly.
  // Since we're manually setting raw HTML, we can't get refs to add proper click handlers
  // Instead, we just hijack ALL clicks in the description, and check if they're for a link
  const descriptionClick = (e) => {
    const roomId =
      e.target && e.target.getAttribute && e.target.getAttribute("data-room");
    if (roomId) {
      moveToRoom(roomId);
    }
  };

  return (
    <div id="room">
      <h1 id="room-name">{room ? room.name : "Loading..."}</h1>
      <div
        id="static-room-description"
        onClick={descriptionClick}
        dangerouslySetInnerHTML={{
          __html: room ? room.description : "Loading current room...",
        }}
      />
      {room ? <PresenceView users={room.users} /> : ""}
    </div>
  );
};

const PresenceView = (props: { users?: string[] }) => {
  const { users } = props;
  if (users) {
    // TODO: This should happen in the reducer
    let names;

    if (users.length === 0) {
      return <div id="dynamic-room-description">You are all alone here.</div>;
    }

    const userViews = users.map((u, idx) => {
      const id = `presence-${idx}`;
      return <NameView userId={u} id={id} key={id} />;
    });

    if (users.length === 1) {
      names = userViews[0];
    } else if (users.length === 2) {
      names = (
        <span>
          {userViews[0]} and {userViews[1]}
        </span>
      );
    } else {
      names = (
        <span>
          {intersperse(userViews.slice(0, users.length - 1), ", ")}, and{" "}
          {userViews[userViews.length - 1]}
        </span>
      );
    }

    // TODO: Bold these
    return (
      <div id="dynamic-room-description">
        Also here {users.length === 1 ? "is" : "are"} {names}.
      </div>
    );
  } else {
    return <div id="dynamic-room-description" />;
  }
};

// https://stackoverflow.com/questions/23618744/rendering-comma-separated-list-of-links
/* intersperse: Return an array with the separator interspersed between
 * each element of the input array.
 *
 * > _([1,2,3]).intersperse(0)
 * [1,0,2,0,3]
 */
function intersperse(arr, sep) {
  if (arr.length === 0) {
    return [];
  }

  return arr.slice(1).reduce(
    function (xs, x, i) {
      return xs.concat([sep, x]);
    },
    [arr[0]]
  );
}
