## So what's the deal with the obelisk?

Attendees want to access the obelisk while in the theater.
The problem is, note walls have a 1:1 relationship with a room. The obelisk note wall lives in the obelisk room, and the theater already has a note wall for speaker Q&A.

We have a separate set of endpoints just for the obelisk, as well as a custom client view component. They're basically copy-pasted versions of the normal note wall endpoints, but instead of operating on "the note wall associated with the user's current room", they're hardcoded to operate on the "obelisk" room (which means the sidebar obelisk and room obelisk will stay in sync).

One extra piece of complexity: when you are in a room, you receive pubsub updates to anything that happens to the note wall in that room while you're there. To handle that (and to avoid having to send you obelisk update data forever the entire event), when you open the sidebar obelisk, we fire off a network request (`startObservingObelisk`) that both returns you the current state of the note wall (would usually be sent in `roomData` when moving rooms) and subscribes you to a custom pubsub group (`obelisk-sidebar`) that gets updates to the obelisk. When you close the modal, the `stopObservingObelisk` endpoint removes you from the group. 

Calls to the sidebar obelisk endpoints (i.e. modifying the note wall from the sidebar view) notify both the `obelisk` group (the one associated with the `obelisk` room) and the `obelisk-sidebar` group. Calls to the normal note wall endpoints are special-cased such that, if the room is `obelisk`, they will also notify `obelisk-sidebar`. 

Computers were possibly a mistake.