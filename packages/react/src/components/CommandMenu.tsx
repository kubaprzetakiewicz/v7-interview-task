import { useProjectContext } from '@/contexts/Project/useProjectContext'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useCommandTriggerEvent } from '../hooks/useCommandTriggerEvent'

export type Command = {
  id: string
  name: string
  action: () => void
}

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentCommandIdx, setCurrentCommandIdx] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const { commands } = useProjectContext()

  useCommandTriggerEvent(() => {
    setIsOpen((prev) => !prev)
  })

  useEffect(() => {
    if (isOpen && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal()
    } else if (!isOpen && dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close()
    }
  }, [isOpen])

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setCurrentCommandIdx((prev) => (prev < commands.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setCurrentCommandIdx((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
        e.preventDefault()
        if (commands[currentCommandIdx]) {
          handleCommandAction(commands[currentCommandIdx])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  const handleCommandAction = (command: Command) => {
    command.action()
    setIsOpen(false)
  }

  const handleDialogClose = () => {
    setIsOpen(false)
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] bg-gray-900/95 text-white rounded-xl shadow-2xl overflow-hidden p-0 backdrop:bg-black/40 border border-gray-700"
      onClose={handleDialogClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      style={{
        maxWidth: '90vw',
        height: 'auto',
      }}
    >
      <div className="px-4 py-3">
        <div className="max-h-[60vh] overflow-y-auto">
          <ul>
            {commands.map((command, index) => (
              <li
                key={command.id}
                className={`px-3 py-4 flex items-center justify-between cursor-pointer rounded-lg transition-colors ${
                  index === currentCommandIdx ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                }`}
                onClick={() => handleCommandAction(command)}
                onMouseEnter={() => setCurrentCommandIdx(index)}
              >
                <div className="text-base font-normal">{command.name}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </dialog>
  )
}


