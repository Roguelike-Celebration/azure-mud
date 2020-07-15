import React from "react";
import { User } from "../../server/src/user";

export default (props: { user: User }) => {
  const { user } = props;

  const realName = user.realName ? (
    <div id="profile-realName">{user.realName}</div>
  ) : (
    ""
  );

  const twitterHandle = user.twitterHandle ? (
    <div id="profile-twitter">
      <strong>Twitter</strong>:{" "}
      <a href="https://twitter.com/{user.twitterHandle}">
        @{user.twitterHandle}
      </a>
    </div>
  ) : (
    ""
  );

  const url = user.url ? (
    <div id="profile-url">
      <strong>Web Site</strong>: <a href="{user.url}">{user.url}</a>
    </div>
  ) : (
    ""
  );

  const description = user.description ? (
    <div id="profile-description">{user.description}</div>
  ) : (
    ""
  );

  const askMeAbout = user.askMeAbout ? (
    <div id="profile-askme">
      <strong>Ask me about:</strong>
      {user.askMeAbout}
    </div>
  ) : (
    ""
  );

  return (
    <div>
      <h1>{user.id}</h1>
      {realName}
      <div id="profile-pronouns">{user.pronouns}</div>
      {twitterHandle}
      {url}
      {description}
      {askMeAbout}
    </div>
  );
};
