// Declare side-effect-only asset types as empty modules, to avoid getting "Can't find
// module or type declarations for X.css" complaints for e.g. `import '../../style/room.css'`.
declare module '*.css' {}
// confetti-js doesn't publish TypeScript types. Declaring it here lets all its exports become 'any'
// while suppressing typecheck/lint complaints.
declare module 'confetti-js'
