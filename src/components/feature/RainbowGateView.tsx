import React from 'react'

export default function RainbowGateView () {
  const visits = parseInt(localStorage.getItem('FeatureRainbowGateVisited'))
  if (!visits) {
    return (
      <div>
        <h1>You experience something truly wonderful.</h1>
        <p>You leap through the gate, and immediately your senses are overwhelmed with the colors and, uh. The, uh, colors of 
          the...unimaginable! It is a truly mindbending experience. You can feel indigo and smell purple, which, okay, yes, I've 
          heard of synesthesia before, yes, no, no, I'm aware.</p>
        <p>Look, Jessie, I told you, I'm a doctor, not a writer.</p>
        <p>Okay there's a reason why I put that sign up, I we'll just have to deal with these fine folk coming through here until 
          the portal repair guy comes Monday and then -
        </p>
        <p>Yes, yes, okay, look, thanks for visiting, sorry we're a little bit busy, would you mind just closing the window and 
          being on your way? Yes, thank you. We appreciate it.</p>
      </div>
    ) 
  } else if (visits == 1) {
    return (
      <div>
        <h1>Oh it's you again.</h1>
        <p>Oh, hey, not to be, uh, not to be touchy or anything but we'd appreciate it if you stopped portaling through our 
          living room. You might not notice but uh, you're kind of leaving an ectoplasmic wake as you pass through which is 
          going to be really annoying to clean up, so...we would really appreciate if you stopped.
        </p>
      </div>
    ) 
  } else if (visits == 2) {
    return (
      <div>
        <h1>Please stop it.</h1>
        <p>No, seriously. I've asked you politely and Jessie is getting very cross. If you come back through there will be Consequences.</p>
      </div>
    )
  } else {
    return (
      <div>
        <h1>Okay, that's enough.</h1>
        <p>You won't listen. You've been asked repeatedly not to, and you won't listen. I'm breaking out the curses now and 
          you've nobody to blame but yourself.</p>
      </div>
    )
  }
}
