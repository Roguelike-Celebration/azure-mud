import { InputLevel } from '@rainway/web'

export const allInput =
  InputLevel.Keyboard | InputLevel.Mouse | InputLevel.Gamepad

export const isDesktopSafari =
  /Macintosh;.*Safari/.test(navigator.userAgent) &&
  !/Chrome|Android/i.test(navigator.userAgent)
