import React, { useState } from "react";
import { updateProfile } from "../networking";
import { PublicUser } from "../../server/src/user";

interface Props {
  isFTUE: boolean;
  defaultHandle?: string;
  user?: PublicUser;
}

//shep: issue #45. Turns ' ' into '-'
function crushSpaces(s: string) : string{
    if( s.includes(" ")){
        console.log("spaces detected " + s);
        while(s.includes(" ")){
            s = s.replace(" ", "-");
        }
        console.log("spaces crushed: " + s);
    }
    return s;
}

export default function (props: Props) {
  const { defaultHandle, user } = props;

  const [handle, setHandle] = useState(
    (user && user.username) || defaultHandle || ""
  );
  const [realName, setRealName] = useState((user && user.realName) || "");
  const [pronouns, setPronouns] = useState((user && user.pronouns) || "");
  const [description, setDescription] = useState(
    (user && user.description) || ""
  );
  const [askMeAbout, setAskMeAbout] = useState((user && user.askMeAbout) || "");
  const [url, setUrl] = useState((user && user.url) || "");

  const close = () => {
    window.location.reload();
  };

  const submit = () => {
    updateProfile({
      username: handle,
      realName,
      pronouns,
      description,
      askMeAbout,
      url,
    });
  };
  return (
    <div>
      {props.isFTUE ? (
        ""
      ) : (
        <button
          onClick={close}
          style={{ float: "right", cursor: "pointer" }}
        >
          x
        </button>
      )}
      <label htmlFor="username">Username:</label>{" "}
      <input
        type="text"
        id="username"
        value={handle}
        onChange={(e) => {
            //shep: issue #45, prevent spaces in usernames
            let s = crushSpaces(e.currentTarget.value);
            if( s.localeCompare(e.currentTarget.value) != 0 ) {
                e.currentTarget.value = s;
            }
            setHandle(e.currentTarget.value);
        }}
      />
      <br />
      <label htmlFor="realname">Real Name:</label>{" "}
      <input
        type="text"
        id="real-name"
        value={realName}
        onChange={(e) => setRealName(e.currentTarget.value)}
      />
      <br />
      <label htmlFor="pronouns">Pronouns:</label>{" "}
      <input
        type="text"
        id="pronouns"
        value={pronouns}
        onChange={(e) => setPronouns(e.currentTarget.value)}
      />
      <br />
      <label htmlFor="website">Website:</label>{" "}
      <input
        type="text"
        id="website"
        value={url}
        onChange={(e) => setUrl(e.currentTarget.value)}
      />
      <br />
      <label htmlFor="ask-me-about">Ask Me About:</label>{" "}
      <input
        type="text"
        id="ask-me-about"
        value={askMeAbout}
        onChange={(e) => setAskMeAbout(e.currentTarget.value)}
      />
      <br />
      <label htmlFor="description">Description:</label>{" "}
      <input
        type="text"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
      />
      <br />
      <button
          //shep: issue #45, double checking that spaces didn't sneak into handle.
          onClick={(e) => {
              setHandle(crushSpaces(handle));
              submit();
          }}
      >Submit</button>
    </div>
  );
}
