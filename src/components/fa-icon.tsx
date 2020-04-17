import React from 'react'

interface FaIconProps {
  type: string,
  className?: string,
  title?: string,
  onClick?(event: React.MouseEvent): void
}

export default function FaIcon({ className = '', type, title, onClick }: FaIconProps) {
  return (
    <span className={`${className}`} onClick={onClick} title={title}>
      <i className={`fas ${type}`} />
    </span>
  )
}
