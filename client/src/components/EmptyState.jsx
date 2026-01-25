import { clsx } from 'clsx'

const EmptyState = ({
  icon: Icon,
  title = 'No hay datos disponibles',
  message = 'Intenta ajustar los filtros de búsqueda',
  action,
  className = '',
}) => {
  return (
    <div className={clsx('text-center py-16', className)}>
      {Icon && (
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-10 h-10 text-gray-400" />
        </div>
      )}
      <p className="text-gray-500 font-medium text-lg mb-1">{title}</p>
      {message && <p className="text-sm text-gray-400">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export default EmptyState
