/* eslint-disable react/no-unescaped-entities */
import React, { useState, useContext } from 'react'
import { updateProfile } from '../networking'
import { PublicUser } from '../../server/src/user'

import '../../style/profileEditView.css'
import { DispatchContext } from '../App'
import { HideModalAction } from '../Actions'
import config from '../config'

interface Props {
  isFTUE: boolean;
  defaultHandle?: string;
  prepopulateTwitterWithDefaultHandle?: boolean
  user?: PublicUser;
}

// shep: issue #45. Turns ' ' into '-'
function crushSpaces (s: string) : string {
  if (s.includes(' ')) {
    console.log('spaces detected ' + s)
    while (s.includes(' ')) {
      s = s.replace(' ', '-')
    }
    console.log('spaces crushed: ' + s)
  }
  return s
}

export default function ProfileEditView (props: Props) {
  const dispatch = useContext(DispatchContext)

  const { defaultHandle, user, prepopulateTwitterWithDefaultHandle } = props

  const [handle, setHandle] = useState(
    (user && user.username) || defaultHandle || ''
  )
  const [realName, setRealName] = useState((user && user.realName) || '')
  const [pronouns, setPronouns] = useState((user && user.pronouns) || '')
  const [description, setDescription] = useState(
    (user && user.description) || ''
  )
  const [askMeAbout, setAskMeAbout] = useState((user && user.askMeAbout) || '')
  const [url, setUrl] = useState((user && user.url) || '')
  const [twitter, setTwitter] = useState(
    (user && user.twitterHandle) ||
    (prepopulateTwitterWithDefaultHandle && defaultHandle) ||
    '')

  const close = () => {
    dispatch(HideModalAction())
  }

  const submit = () => {
    updateProfile({
      username: handle,
      realName,
      pronouns,
      description,
      askMeAbout,
      twitterHandle: twitter,
      url,
      hostname: config.SERVER_HOSTNAME
    },
    props.isFTUE)
  }
  return (
    <div id='profile-edit' className={`container ${props.isFTUE ? 'ftue' : ''}`}>
      <div className="form">
        <h1>{`${props.isFTUE ? 'Create' : 'Edit'} Name Badge`}</h1>
        <div style={{ marginTop: '2em', marginBottom: '2em' }}>
          This is your virtual conference badge!<br/>
        Whatever you enter will be visible to other attendees.<br/>
        You can come back and change this at any time.
        </div>
        <div className="grid">
          <div className="field">
            <label htmlFor="username">Chat Handle</label>
            <em>What shows up when you send messages</em>
            <input
              type="text"
              id="username"
              value={handle}
              onChange={(e) => {
                // shep: issue #45, prevent spaces in usernames
                const s = crushSpaces(e.currentTarget.value)
                if (s.localeCompare(e.currentTarget.value) !== 0) {
                  e.currentTarget.value = s
                }
                setHandle(e.currentTarget.value)
              }}
            />
          </div>
          <div className="field">
            <label htmlFor="realname">Name</label>
            <em>Optional: Your "IRL" name.</em>
            <input
              type="text"
              id="real-name"
              value={realName}
              onChange={(e) => setRealName(e.currentTarget.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="description">Character Description</label>
            <em>Optional: Describe your avatar!</em>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="pronouns">Pronouns</label>
            <em>e.g. "she/her" or "he/they"</em>
            <input
              type="text"
              id="pronouns"
              value={pronouns}
              onChange={(e) => setPronouns(e.currentTarget.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="website">Website</label>
            <em>Optional: Your personal site!</em>
            <input
              type="text"
              id="website"
              value={url}
              onChange={(e) => setUrl(e.currentTarget.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="twitter">Twitter Handle</label>
            <em>Optional: Don't include the @</em>
            <input
              type="text"
              id="twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.currentTarget.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="ask-me-about">Ask Me About</label>
            <em>Optional: What are you excited to talk about?</em>
            <input
              type="text"
              id="ask-me-about"
              value={askMeAbout}
              onChange={(e) => setAskMeAbout(e.currentTarget.value)}
            />
          </div>
        </div>
        <button
          // shep: issue #45, double checking that spaces didn't sneak into handle.
          onClick={(e) => {
            setHandle(crushSpaces(handle))
            submit()
          }}
          className="submit">
            Save Changes
        </button>
      </div>
    </div>
  )
}
