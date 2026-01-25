import { useEffect, useMemo, useRef, useState } from 'react'

const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Buscar...',
  disabled = false,
  error = false,
  emptyLabel = 'Sin resultados',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef(null)

  const selectedOption = useMemo(
    () => options.find((option) => String(option.value) === String(value)),
    [options, value]
  )

  useEffect(() => {
    if (selectedOption) {
      setQuery(selectedOption.label)
    }
  }, [selectedOption])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        if (selectedOption) {
          setQuery(selectedOption.label)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selectedOption])

  const filteredOptions = useMemo(() => {
    if (!query) return options
    const term = query.toLowerCase()
    return options.filter((option) => option.label.toLowerCase().includes(term))
  }, [options, query])

  const handleSelect = (option) => {
    onChange(option.value)
    setQuery(option.label)
    setIsOpen(false)
  }

  const handleInputChange = (event) => {
    setQuery(event.target.value)
    setIsOpen(true)
    if (!event.target.value) {
      onChange('')
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
      />
      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">{emptyLabel}</div>
          ) : (
            filteredOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => handleSelect(option)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default SearchableSelect
