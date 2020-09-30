import React from 'react'

export default function ClientDeployedModal () {
  return (
    <div id='client-deployed'>
      <h1>New Version Available!</h1>
      <p>We just updated the social space with new features and bugfixes!</p>
      <p>Please reload this page whenever is convenient so you can be running the latest code.</p>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  )
}
