import React from 'react'

export default function FaIcon({ type, title, onClick }) {
  return (
    <span className='icon mb-2 mt-2 text-white cursor-pointer' onClick={onClick} title={title}>
      <i className={`fas fa-2x ${type}`} />
    </span>
  )
}
