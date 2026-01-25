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
        className={`input ${error ? 'border-red-300 focus:ring-red-500' : ''}`}
      />
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto scrollbar-thin">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">{emptyLabel}</div>
          ) : (
            filteredOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  String(option.value) === String(value)
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
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
