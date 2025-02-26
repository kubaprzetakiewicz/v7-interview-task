import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useCommandTriggerEvent } from '../hooks/useCommandTriggerEvent'

type Command = {
  id: string
  name: string
  action: () => void
}

type Props = {
  commands: Command[]
}

export function CommandMenu({ commands }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentCommandIdx, setCurrentCommandIdx] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)

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
      className="w-full max-w-xl bg-gray-900 text-white rounded-lg shadow-2xl overflow-hidden p-0 backdrop:bg-black/50"
      onClose={handleDialogClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="max-h-[60vh] overflow-y-auto">
        <ul>
          {commands.map((command, index) => (
            <li
              key={command.id}
              className={`p-3 flex items-center justify-between cursor-pointer ${
                index === currentCommandIdx ? 'bg-blue-900' : 'hover:bg-gray-800'
              }`}
              onClick={() => handleCommandAction(command)}
              onMouseEnter={() => setCurrentCommandIdx(index)}
            >
              <div className="flex items-center">
                <div>
                  <div className="font-medium">{command.name}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  )
}
