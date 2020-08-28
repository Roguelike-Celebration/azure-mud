import React from 'react'

interface Props {
    x: number
    y: number
    str: String
}

export default function MapPath (props: Props) {
  const { x, y, str } = props
  return <pre style={{ position: 'absolute', top: `${y * 15}px`, left: `${x * 10}px`, margin: '0', backgroundColor: 'var(--main-background)' }}>{str}</pre>
}
