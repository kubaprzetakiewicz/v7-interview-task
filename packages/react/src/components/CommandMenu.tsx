import { useProjectContext } from '@/contexts/Project/useProjectContext'
import { KeyboardEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useCommandTriggerEvent } from '../hooks/useCommandTriggerEvent'

type CommandUsage = {
  [commandId: string]: number
}

export type Command = {
  id: string
  name: string
  action: () => void
}

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentCommandIdx, setCurrentCommandIdx] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [commandUsage, setCommandUsage] = useState<CommandUsage>({})
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { commands } = useProjectContext()

  useEffect(() => {
    try {
      const storedUsage = localStorage.getItem('commandUsage')
      if (storedUsage) {
        setCommandUsage(JSON.parse(storedUsage))
      }
    } catch (error) {
      // it's not critical
      console.debug('Could not load command usage data', error)
    }
  }, [])

  const trackCommandUsage = (commandId: string) => {
    const newUsage = {
      ...commandUsage,
      [commandId]: (commandUsage[commandId] || 0) + 1,
    }
    setCommandUsage(newUsage)

    try {
      localStorage.setItem('commandUsage', JSON.stringify(newUsage))
    } catch (error) {
      // it's not critical
      console.debug('Failed to save command usage data:', error)
    }
  }

  const filteredCommands = useMemo(() => {
    const filtered = commands.filter((command) => command.name.toLowerCase().includes(searchQuery.toLowerCase()))
    if (searchQuery) {
      return filtered.sort((a, b) => {
        const aExact = a.name.toLowerCase() === searchQuery.toLowerCase()
        const bExact = b.name.toLowerCase() === searchQuery.toLowerCase()
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1

        return (commandUsage[b.id] || 0) - (commandUsage[a.id] || 0)
      })
    }

    return filtered.sort((a, b) => (commandUsage[b.id] || 0) - (commandUsage[a.id] || 0))
  }, [
    // `commands` won't change anyway, but hey, rules of hooks
    commands,
    searchQuery,
    commandUsage,
  ])

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
    trackCommandUsage(command.id)
    command.action()
    setIsOpen(false)
    setSearchQuery('')
    // we need this now, because the commands might be reordered due to how often they're used
    setCurrentCommandIdx(0)
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
