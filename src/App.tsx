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
  SetUseSimpleNamesAction,
  ShowSideMenuAction,
  SpaceIsClosedAction
} from './Actions.js'
import { currentUser, onAuthenticationStateChange } from './authentication.js'
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
import { checkIsRegistered, connect } from './networking.js'
import reducer, { defaultState, RoomDataMap, State, UserMap } from './reducer.js'
import * as Storage from './storage.js'
import { ThunkDispatch, useReducerWithThunk } from './useReducerWithThunk.js'

interface UserMapContextValue {
  userMap: UserMap
  myId: string
}

interface SettingsContextValue {
  useSimpleNames: boolean
}

export const DispatchContext = createContext<ThunkDispatch<Action, State>>(null)
export const MessagesContext = createContext<State['messages']>(null)
export const UserMapContext = createContext<UserMapContextValue>(null)
export const SettingsContext = createContext<SettingsContextValue>(null)
export const IsMobileContext = createContext<boolean>(null)
export const RoomDataContext = createContext<RoomDataMap>(null)

const App = () => {
  const [state, dispatch] = useReducerWithThunk<Action, State>(
    reducer,
    defaultState
  )

  useEffect(() => {
    // TODO: This flow has a lot of confusing, potentially duplicated messages that I'm not sure are necessary
    // I (Em) started a refactor at one point, but abandoned it since it became too irrelevant from my task
    onAuthenticationStateChange(async (user) => {
      if (!user) {
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

        const { registeredUsername, spaceIsClosed, isMod, isBanned } =
          await checkIsRegistered()
        if (!registeredUsername) {
          // If email, use ID to not leak, otherwise use service's default display name (for Twitter, their handle)
          const defaultDisplayName = user.email ? userId : user.displayName
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

        const messageArchive = await Storage.getMessages()
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

  // This is kind of janky!
  if (
    currentUser() &&
    currentUser().isSignInWithEmailLink(window.location.href)
  ) {
    return <EmailVerifiedView />
  }

  if (!state.checkedAuthentication) {
    return <div />
  }

  if (state.checkedAuthentication && state.mustVerifyEmail) {
    return (
      <VerifyEmailView userEmail={currentUser().email} dispatch={dispatch} />
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
        defaultHandle={state.userMap[state.userId].username}
        user={state.profileData}
        prepopulateTwitterWithDefaultHandle={
          state.authenticationProvider === 'twitter'
        }
      />
    )
  }

  if (state.isClosed && !state.userMap[state.userId].isMod) {
    return <GoHomeView />
  } else if (state.isBanned) {
    return <YouAreBannedView />
  }

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
          defaultHandle={state.userMap[state.userId].username}
          user={state.profileData}
        />
      )
      break
    }
    case Modal.NoteWall: {
      const room = state.roomData[state.roomId]
      innerModalView = (
        <NoteWallView
          roomDisplayName={room.displayName}
          notes={room.notes}
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
          unlockedBadges={state.profileData?.unlockedBadges}
        />
      )
      break
    }
    case Modal.Badges: {
      innerModalView = (
        <BadgesModalView
          equippedBadges={state.profileData?.equippedBadges}
          unlockedBadges={state.profileData?.unlockedBadges}
          unlockableBadges={state.unlockableBadges}
        />
      )
      break
    }
    case Modal.BadgeUnlock: {
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
      innerModalView = <DisconnectModalView userId={state.userId} />
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
      const room = state.roomData[state.roomId]
      innerModalView = <RiddleModalView riddles={room.riddles} />
      break
    }
    case Modal.SpecialFeatureText: {
      const room = state.roomData[state.roomId]
      innerModalView = <SpecialTextModalView text={room.specialFeatureText} />
      break
    }
    case Modal.Obelisk: {
      innerModalView = <ObeliskView notes={state.obeliskNotes} user={state.profileData} />
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
              <SettingsContext.Provider value={{ useSimpleNames: state.useSimpleNames }}>
                <UserMapContext.Provider value={{ userMap: state.userMap, myId: state.userId }}>
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
                            username={state.userMap[state.userId].username}
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
                      {state.roomData[state.roomId] ? (
                        <RoomView
                          room={state.roomData[state.roomId]}
                          userId={state.userId}
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
                        prepopulated={state.prepopulatedInput}
                        sendMessage={(message) =>
                          dispatch(SendMessageAction(message))
                        }
                        usersInRoom={state.roomData[state.roomId]?.users}
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
