import React, { useState } from "react";
import { updateProfile } from "../networking";

interface Props {
  isFTUE: boolean;
  defaultHandle?: string;
}

export default function (props: Props) {
  const [handle, setHandle] = useState(props.defaultHandle || "");
  const [realName, setRealName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [description, setDescription] = useState("");
  const [askMeAbout, setAskMeAbout] = useState("");
  const [url, setUrl] = useState("");

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
      <label htmlFor="username">Username:</label>{" "}
      <input
        type="text"
        id="username"
        value={handle}
        onChange={(e) => setHandle(e.currentTarget.value)}
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
      <button onClick={submit}>Submit</button>
    </div>
  );
}
