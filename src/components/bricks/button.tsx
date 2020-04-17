import * as React from 'react'

export enum ButtonType {
  Default,
  Weak,
  Action,
}

export interface ButtonProps {
  onClick?(e: React.MouseEvent): void
  children: React.ReactNode
  type?: ButtonType
  disabled?: boolean
}

export default function Button({ type = ButtonType.Default, onClick = () => {}, disabled = false, children }: ButtonProps) {
  let colorClasses =
    type === ButtonType.Default ? 'bg-indigo-600 text-white ' :
    type === ButtonType.Weak    ? 'border-2 border-indigo-400 text-indigo-400' :
    type === ButtonType.Action  ? 'bg-pink-600 text-white' :
                                  ''

  let disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      disabled={disabled}
      className={`${colorClasses} ${disabledClasses} rounded-sm px-4 py-1`}
      type='button'
      onClick={onClick}
    >
      {children}
    </button>
  )
}
