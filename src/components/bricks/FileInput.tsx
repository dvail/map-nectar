import * as React from 'react'
import uuidv4 from 'uuid/v4'
import { useState } from 'react'

export interface FileInputProps {
  onChange(e: React.ChangeEvent<HTMLInputElement>): void
  children: React.ReactNode
  className?: string
}

export default function FileInput({ onChange, className, children }: FileInputProps) {
  let [id] = useState(uuidv4())
  return (
    <div className={className}>
      <input className='hidden' id={id} type='file' onChange={onChange} />
      <label className='flex flex-row items-center cursor-pointer' htmlFor={id}>
        {children}
      </label>
    </div>
  )
}
