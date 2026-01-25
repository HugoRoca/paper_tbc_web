const Loading = ({ message = 'Cargando...', size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className={`animate-spin rounded-full ${sizes[size]} border-b-2 border-blue-600 mx-auto mb-4`}></div>
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  )
}

export default Loading
