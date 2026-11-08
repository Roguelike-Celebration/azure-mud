import React, { createContext, useEffect } from 'react'
import { IconContext } from 'react-icons/lib'
import { Tooltip } from 'react-tooltip'

import {
  Action,
  AuthenticateAction,
  IsRegisteredAction,
  LoadMessageArchiveAction,
  PlayerBannedAction,
  SendMessageAction,
  SetShowDebugControlsAction,
  SetUseSimpleNamesAction,
  ShowSideMenuAction,
  SpaceIsClosedAction
} from './Actions.js'
import { currentUser, getRequiredCurrentUser, onAuthenticationStateChange } from './authentication.js'
import BadgesModalView from './components/BadgesModalView.js'
import BadgeUnlockModal from './components/BadgeUnlockModal.js'
import ClientDeployedModal from './components/ClientDeployedModal.js'
import CodeOfConductView from './components/CodeOfConductView.js'
import DisconnectModalView from './components/DisconnectModalView.js'
import EmailVerifiedView from './components/EmailVerifiedView.js'
import DullDoorModalView from './components/feature/DullDoorViews.js'
import FullRoomIndexModalView from './components/feature/FullRoomIndexViews.js'
import RainbowGateModalView from './components/feature/RainbowGateViews.js'
import GoHomeView from './components/GoHomeView.js'
import HappeningNowView from './components/HappeningNowView.js'
import HelpView from './components/HelpView.js'
import InputView from './components/InputView.js'
import LoggedOutView from './components/LoggedOutView.js'
import MapModalView from './components/MapModalView.js'
import { MessageList } from './components/MessageList/index.js'
import { ModalView } from './components/ModalView.js'
import { NoteWallView } from './components/NoteWallView.js'
import { ObeliskView } from './components/ObeliskView.js'
import ProfileEditView from './components/ProfileEditView.js'
import ProfileView from './components/ProfileView.js'
import RiddleModalView from './components/RiddleModal.js'
import RoomListView from './components/RoomListView.js'
import RoomView from './components/RoomView.js'
import ScheduleView from './components/ScheduleView.js'
import ServerSettingsView from './components/ServerSettingsView.js'
import SettingsView from './components/SettingsView.js'
import SideNavView from './components/SideNavView.js'
import SpecialTextModalView from './components/SpecialTextModalView.js'
import VerifyEmailView from './components/VerifyEmailView.js'
import { VirtualizationProvider } from './components/VirtualizationProvider/index.js'
import WelcomeModalView from './components/WelcomeModalView.js'
import YouAreBannedView from './components/YouAreBannedView.js'
import { MUD_TOOLTIP_ID } from './display.js'
import { Modal } from './modals.js'
import { checkIsRegistered, connect, disconnectWebPubSub } from './networking.js'
import reducer, { defaultState, RoomDataMap, State, UserMap } from './reducer.js'
import { myUser, myUserId } from './selectors.js'
import * as Storage from './storage.js'
import { ThunkDispatch, useReducerWithThunk } from './useReducerWithThunk.js'

interface UserMapContextValue {
  userMap: UserMap
  myId: string
}

interface SettingsContextValue {
  useSimpleNames: boolean
  showDebugControls: boolean
}

/** Placeholder default for a context with no meaningful value. */
const noDefault = <T,>(): T => null as unknown as T
// These next three have no meaningful default - they're only valid inside App's providers below.
// Reading one outside them gets null despite the typing. We just hacked them to satisfy strict-null
// type checking here. Real logic fixes need to be added later.
export const DispatchContext = createContext<ThunkDispatch<Action, State>>(noDefault())
export const MessagesContext = createContext<State['messages']>(noDefault())
export const UserMapContext = createContext<UserMapContextValue>(noDefault())
export const SettingsContext = createContext<SettingsContextValue>({
  useSimpleNames: false,
  showDebugControls: false
})
export const IsMobileContext = createContext<boolean>(false)
export const RoomDataContext = createContext<RoomDataMap>({})

const App = () => {
  const [state, dispatch] = useReducerWithThunk<Action, State>(
    reducer,
    defaultState
  )

  useEffect(() => {
    // Note that auth-changed can be fired due to a logout in another tab, not just this one.
    // TODO: This flow has a lot of confusing, potentially duplicated messages that I'm not sure are necessary
    // I (Em) started a refactor at one point, but abandoned it since it became too irrelevant from my task
    // Return the unsubscribe as cleanup, so a remount doesn't leave an extra listener behind.
    return onAuthenticationStateChange(async (user) => {
      if (!user) {
        disconnectWebPubSub()
        dispatch(
          AuthenticateAction(undefined, undefined, undefined, undefined)
        )
      } else if (user.shouldVerifyEmail) {
        const userId = user.id
        const providerId = user.providerId
        dispatch(AuthenticateAction(userId, userId, providerId, true))
      } else {
        const userId = user.id
        const providerId = user.providerId

        const registrationStatus = await checkIsRegistered()
        if (!registrationStatus) {
          alert("Couldn't reach the MUD server to finish login. (Failed AzFn call.) Try reloading the page.")
          return
        }
        const { registeredUsername, spaceIsClosed, isMod, isBanned } = registrationStatus
        if (!registeredUsername) {
          // If email, use ID to not leak, otherwise use service's default display name (for Twitter, their handle)
          // (As of ~2024, we only support email, so this behavior isn't readily testable.)
          const defaultDisplayName = user.email ? userId : (user.displayName ?? userId)
          dispatch(
            AuthenticateAction(userId, defaultDisplayName, providerId, false)
          )
          return
        }

        // TODO: I thiiiink we want this to be in an 'else'
        dispatch(
          AuthenticateAction(userId, registeredUsername, providerId, false)
        )

        if (isBanned) {
          dispatch(
            PlayerBannedAction({
              id: userId,
              username: registeredUsername,
              isBanned: isBanned
            })
          )
          dispatch(IsRegisteredAction())
          return
        }

        if (spaceIsClosed) {
          dispatch(SpaceIsClosedAction())

          if (!isMod) {
            // non-mods shouldn't subscribe to SignalR if the space is closed
            dispatch(IsRegisteredAction())
            return
          }
        }

        const messageArchive = await Storage.getMessages(userId)
        // I'm styling it like a constant but it's just here; look it's late and the conf is in two days
        const MAX_MESSAGES_TO_LOAD = 400
        dispatch(
          LoadMessageArchiveAction(
            messageArchive
              ? messageArchive.messages.slice(-MAX_MESSAGES_TO_LOAD)
              : [],
            messageArchive ? messageArchive.whispers : []
          )
        )

        const useSimpleNames = await Storage.getUseSimpleNames()
        dispatch(SetUseSimpleNamesAction(useSimpleNames))
        const showDebugControls = await Storage.getShowDebugControls()
        dispatch(SetShowDebugControlsAction(showDebugControls))

        dispatch(IsRegisteredAction())
        connect(userId, dispatch)

        // WARNING: I don't know what this does.
        // When videochat existed, we had a warning that this no-op existed prior to videochat
        // So when I removed videochat, I left it here
        // (-Emilia)
        window.addEventListener('resize', () => {})
      }
    })
  }, [])

  const isMobile = window.outerWidth < 500

  const profile = state.visibleProfile ? (
    <ProfileView user={state.visibleProfile} whispers={state.whispers} />
  ) : (
    ''
  )

  if (
    currentUser()?.isSignInWithEmailLink(window.location.href)
  ) {
    return <EmailVerifiedView />
  }

  // Covers both Firebase auth check and isRegistered call.
  if (!state.checkedAuthentication) {
    return <p role="status">Logging in...</p>
  }

  if (state.checkedAuthentication && state.mustVerifyEmail) {
    return (
      <VerifyEmailView userEmail={getRequiredCurrentUser().email ?? '(no email)'} dispatch={dispatch} />
    )
  }

  if (state.checkedAuthentication && !state.authenticated) {
    return <LoggedOutView />
  }

  if (!state.hasRegistered) {
    // Fetching the handle like this is silly.
    return (
      <ProfileEditView
        isFTUE={true}
        defaultHandle={myUser(state).username}
        user={state.profileData}
        prepopulateTwitterWithDefaultHandle={
          state.authenticationProvider === 'twitter'
        }
      />
    )
  }

  const meUser = myUser(state)
  if (state.isClosed && !meUser.isMod) {
    return <GoHomeView user={meUser} email={getRequiredCurrentUser().email ?? '(no email)'} />
  } else if (state.isBanned) {
    return <YouAreBannedView user={meUser} email={getRequiredCurrentUser().email ?? '(no email)'} />
  }

  const currentRoom = state.roomId !== undefined ? state.roomData[state.roomId] : undefined

  let innerModalView: React.ReactElement | undefined
  let modalView: React.ReactElement | undefined

  // TODO: If we get more modal options than just a size boolean, make this an options object.
  let modalIsFullScreen = false
  let modalIsUnclosable = false

  switch (state.activeModal) {
    case Modal.ProfileEdit: {
      innerModalView = (
        <ProfileEditView
          isFTUE={false}
          defaultHandle={myUser(state).username}
          user={state.profileData}
        />
      )
      break
    }
    case Modal.NoteWall: {
      const room = currentRoom
      if (!room || !state.profileData) {
        // Room and/or profile data waiting on connect() completion
        break
      }
      innerModalView = (
        <NoteWallView
          roomDisplayName={room.displayName}
          notes={room.notes ?? []}
          noteWallData={room.noteWallData}
          roomData={state.roomData}
          user={state.profileData}
          serverSettings={state.serverSettings}
        />
      )
      break
    }
    case Modal.Settings: {
      innerModalView = (
        <SettingsView
          unlockedBadges={state.profileData?.unlockedBadges ?? []}
        />
      )
      break
    }
    case Modal.Badges: {
      innerModalView = (
        <BadgesModalView
          equippedBadges={state.profileData?.equippedBadges ?? []}
          unlockedBadges={state.profileData?.unlockedBadges ?? []}
          unlockableBadges={state.unlockableBadges}
        />
      )
      break
    }
    case Modal.BadgeUnlock: {
      if (!state.justUnlockedBadge) {
        break
      }
      innerModalView = <BadgeUnlockModal badge={state.justUnlockedBadge} />
      break
    }
    case Modal.CodeOfConduct: {
      innerModalView = <CodeOfConductView />
      break
    }
    case Modal.Schedule: {
      innerModalView = <ScheduleView />
      break
    }
    case Modal.Map: {
      if (state.roomId === undefined) {
        break
      }
      modalIsFullScreen = true
      innerModalView = (
        <MapModalView
          presenceData={state.presenceData}
          currentRoomId={state.roomId}
        />
      )
      break
    }
    case Modal.RoomList: {
      innerModalView = <RoomListView rooms={Object.values(state.roomData)} />
      break
    }
    case Modal.Help: {
      innerModalView = <HelpView />
      break
    }
    case Modal.Welcome: {
      innerModalView = <WelcomeModalView />
      break
    }
    case Modal.ServerSettings: {
      innerModalView = (
        <ServerSettingsView
          serverSettings={state.serverSettings}
          roomData={state.roomData}
        />
      )
      break
    }
    case Modal.ClientDeployed: {
      innerModalView = <ClientDeployedModal />
      break
    }
    case Modal.Disconnected: {
      modalIsUnclosable = true
      innerModalView = <DisconnectModalView userId={myUserId(state)} />
      break
    }
    case Modal.HappeningNow: {
      innerModalView = (
        <HappeningNowView
          roomData={state.roomData}
          entries={state.serverSettings.happeningNowEntries}
        />
      )
      break
    }
    case Modal.FeatureRainbowGate: {
      innerModalView = <RainbowGateModalView />
      break
    }
    case Modal.FeatureDullDoor: {
      innerModalView = <DullDoorModalView />
      break
    }
    case Modal.FeatureFullRoomIndex: {
      innerModalView = (
        <FullRoomIndexModalView rooms={Object.values(state.roomData)} />
      )
      break
    }
    case Modal.Riddles: {
      const room = currentRoom
      if (!room) {
        break
      }
      innerModalView = <RiddleModalView riddles={room.riddles ?? []} />
      break
    }
    case Modal.SpecialFeatureText: {
      const room = currentRoom
      if (!room || !room.specialFeatureText) {
        break
      }
      innerModalView = <SpecialTextModalView text={room.specialFeatureText} />
      break
    }
    case Modal.Obelisk: {
      if (!state.profileData) {
        break
      }
      innerModalView = <ObeliskView notes={state.obeliskNotes} user={state.profileData} />
      break
    }
  }

  if (innerModalView) {
    modalView = (
      <ModalView fullScreen={modalIsFullScreen} unclosable={modalIsUnclosable}>
        {innerModalView}
      </ModalView>
    )
  }

  const showMenu = () => {
    dispatch(ShowSideMenuAction())
  }

  const shouldShowMenu = !isMobile || state.mobileSideMenuIsVisible

  // TODO: userMapContext should actually do the thing
  return (
    <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
      <DispatchContext.Provider value={dispatch}>
        <MessagesContext.Provider value={state.messages}>
            <IsMobileContext.Provider value={isMobile}>
              <SettingsContext.Provider value={{
                useSimpleNames: state.useSimpleNames ?? false,
                showDebugControls: state.showDebugControls ?? false
              }}>
                <UserMapContext.Provider value={{ userMap: state.userMap, myId: myUserId(state) }}>
                  <RoomDataContext.Provider value={state.roomData}>
                    <div
                      id={
                        state.visibleProfile && !isMobile
                          ? 'app-profile-open'
                          : 'app'
                      }
                    >
                      <Tooltip
                        id={MUD_TOOLTIP_ID}
                        portalRoot={document.body}
                        positionStrategy="fixed"
                        float
                        /* High z-index so tooltip sits above modals */
                        style={{ zIndex: 100001 }}
                      />
                      {shouldShowMenu ? (
                        <span>
                          <SideNavView
                            presenceData={state.presenceData}
                            currentRoomId={state.roomId}
                            username={myUser(state).username}
                            spaceIsClosed={state.isClosed}
                          />
                          {/* Once we moved the sidebar to be position:fixed, we still
                      needed something to take up its space in the CSS grid.
                      This should be fixable via CSS, but sigh, it's 3 days before the event */}
                        <div id="side-nav-placeholder" />
                      </span>
                    ) : (
                      <button id="show-menu" onClick={showMenu}>
                        <span role="img" aria-label="menu">
                            🍔
                        </span>
                      </button>
                    )}
                    {modalView}
                    <div id="main" role="main">
                      {currentRoom ? (
                        <RoomView
                          room={currentRoom}
                          userId={myUserId(state)}
                          roomData={state.roomData}
                          presenceData={state.presenceData}
                          hasDismissedAModal={state.hasDismissedAModal}
                        />
                      ) : null}
                      <VirtualizationProvider>
                        <MessageList
                          autoscrollChat={state.autoscrollChat}
                          messagesLoadProgress={state.messagesLoadProgress}
                        />
                      </VirtualizationProvider>
                      <InputView
                        sendMessage={(message) =>
                          dispatch(SendMessageAction(message))
                        }
                        usersInRoom={currentRoom?.users}
                      />
                    </div>
                    {profile}
                  </div>
                </RoomDataContext.Provider>
              </UserMapContext.Provider>
            </SettingsContext.Provider>
          </IsMobileContext.Provider>
        </MessagesContext.Provider>
      </DispatchContext.Provider>
    </IconContext.Provider>
  )
}

export default App
