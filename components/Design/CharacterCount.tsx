import React from 'react'

interface CharacterCountProps {
  current: number
  max: number
}

export function CharacterCount({ current, max }: CharacterCountProps) {
  return (
    <div className="text-sm text-muted-foreground text-right">
      {current} / {max} characters
    </div>
  )
}

