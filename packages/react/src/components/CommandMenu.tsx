import { useProjectContext } from '@/contexts/Project/useProjectContext'
import { KeyboardEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useCommandTriggerEvent } from '../hooks/useCommandTriggerEvent'

export type Command = {
  id: string
  name: string
  action: () => void
}

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentCommandIdx, setCurrentCommandIdx] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { commands } = useProjectContext()

  const filteredCommands = useMemo(
    () => commands.filter((command) => command.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [
      // `commands` won't change anyway, but hey, rules of hooks
      commands,
      searchQuery,
    ],
  )

  useCommandTriggerEvent(() => {
    setIsOpen((prev) => !prev)
    setSearchQuery('')
  })

  useLayoutEffect(() => {
    if (isOpen && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal()
      inputRef.current?.focus()
    } else if (!isOpen && dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close()
    }
  }, [isOpen])

  useEffect(() => {
    setCurrentCommandIdx(0)
  }, [searchQuery])

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setCurrentCommandIdx((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setCurrentCommandIdx((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredCommands[currentCommandIdx]) {
          handleCommandAction(filteredCommands[currentCommandIdx])
        }
        break
      case 'Escape':
        if (searchQuery) {
          setSearchQuery('')
        } else {
          setIsOpen(false)
        }
        break
    }
  }

  const handleCommandAction = (command: Command) => {
    command.action()
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleDialogClose = () => {
    setIsOpen(false)
    setSearchQuery('')
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
        <div className="mb-3">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commands..."
            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredCommands.length > 0 ? (
            <ul>
              {filteredCommands.map((command, index) => (
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
          ) : (
            <div className="px-3 py-4 text-gray-400 text-center">No commands found</div>
          )}
        </div>
      </div>
    </dialog>
  )
}


