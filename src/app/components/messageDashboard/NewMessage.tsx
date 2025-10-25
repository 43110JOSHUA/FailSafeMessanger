import React from 'react'

interface NewMessageProps {
  isOpen: boolean
}

export default function NewMessage({isOpen}: NewMessageProps) {
  if (!isOpen) {
    return (<div>
      Closed
    </div>)
  }
  return (
    <div>Open</div>
  )
}
