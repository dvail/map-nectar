import React from 'react'

export default function FaIcon({ className = '', type, title, onClick }) {
  return (
    <span className={`${className} text-white cursor-pointer`} onClick={onClick} title={title}>
      <i className={`fas ${type}`} />
    </span>
  )
}
