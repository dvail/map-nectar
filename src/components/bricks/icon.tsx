import React from 'react'

interface IconProps {
  type: string,
  className?: string,
  title?: string,
  onClick?(event: React.MouseEvent): void
}

export default function Icon({ className = '', type, title, onClick }: IconProps) {
  return (
    <span className={`${className}`} onClick={onClick} title={title}>
      <i className={`fas ${type}`} />
    </span>
  )
}
