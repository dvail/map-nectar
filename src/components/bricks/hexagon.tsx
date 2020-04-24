import * as React from 'react'
import noop from 'lodash/fp/noop'

let outerCss = (size: number, cssColor: string): React.CSSProperties => ({
  position: 'relative',
  width: `${size}px`,
  height: `${size / Math.sqrt(3)}px`,
  backgroundColor: cssColor,
  margin: `${(size / Math.sqrt(3)) / 2}px 0`,
})

let pseduoCssCommon = (size: number): React.CSSProperties => ({
  content: "",
  position: 'absolute',
  width: 0,
  borderLeft: `${size / 2}px solid transparent`,
  borderRight: `${size / 2}px solid transparent`,
})

let pseduoCssBefore = (size: number, cssColor: string): React.CSSProperties => ({
  bottom: '100%',
  borderBottom: `${(size / Math.sqrt(3)) / 2}px solid ${cssColor}`,
})

let pseduoCssAfter = (size: number, cssColor: string): React.CSSProperties => ({
  top: '100%',
  width: 0,
  borderTop: `${(size / Math.sqrt(3)) / 2}px solid ${cssColor}`,
})

interface HexagonProps {
  cssColor: string
  size: number
  className?: string
  title?: string
  onClick?(e: React.MouseEvent): void
}

export default function HexagonElement({ cssColor, size, className = '', title = '', onClick = noop }: HexagonProps) {
  return (
    <div style={outerCss(size, cssColor)} className={className} title={title} onClick={onClick}>
      <div style={({ ...pseduoCssCommon(size), ...pseduoCssBefore(size, cssColor) })} />
      <div style={({ ...pseduoCssCommon(size), ...pseduoCssAfter(size, cssColor) })} />
    </div>
  )
}
