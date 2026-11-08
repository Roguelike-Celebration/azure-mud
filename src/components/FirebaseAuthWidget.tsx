/* React component wrapper for the FirebaseUI sign-in widget.
 *
 * This is our custom replacement for react-firebaseui's similar widget.
 * react-firebaseui is unmaintained and doesn't support React 18+, and the
 * newer FirebaseUI's own React component package requires React 19 and Firebase
 * 11/12, which we're not on yet. So we just use a custom replacement. Once we're
 * on FirebaseUI v7, this could be replaced with the widget from firebaseui.
 */

import firebase from 'firebase/app'
// Namespace import, because firebaseui's ESM build only has a named 'auth'
// export, no default, and its d.ts setup means a default import breaks at build time.
import * as firebaseui from 'firebaseui'
import React, { useEffect, useRef } from 'react'

import 'firebase/auth'
import 'firebaseui/dist/firebaseui.css'

export default function FirebaseAuthWidget (props: { uiConfig: firebaseui.auth.Config }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    // Only one AuthUI can exist per Auth instance, so reuse it across mounts, like the
    // firebaseui README recommends.
    const ui = firebaseui.auth.AuthUI.getInstance() ?? new firebaseui.auth.AuthUI(firebase.auth())
    ui.start(container, props.uiConfig)
    return () => ui.reset()
  }, [props.uiConfig])

  return <div ref={containerRef} />
}
