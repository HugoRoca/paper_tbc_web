const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: 'text-white',
      value: 'text-blue-900',
      border: 'border-blue-200',
      shadow: 'shadow-blue-100',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
      icon: 'text-white',
      value: 'text-green-900',
      border: 'border-green-200',
      shadow: 'shadow-green-100',
    },
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      iconBg: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      icon: 'text-white',
      value: 'text-yellow-900',
      border: 'border-yellow-200',
      shadow: 'shadow-yellow-100',
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100',
      iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
      icon: 'text-white',
      value: 'text-red-900',
      border: 'border-red-200',
      shadow: 'shadow-red-100',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      icon: 'text-white',
      value: 'text-purple-900',
      border: 'border-purple-200',
      shadow: 'shadow-purple-100',
    },
  }

  const colors = colorClasses[color] || colorClasses.blue

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border ${colors.border} p-6 group cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className={`text-3xl font-bold ${colors.value} mb-1`}>{value}</p>
          {trend && trendValue && (
            <p className="text-xs text-gray-500 mt-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
            </p>
          )}
        </div>
        <div className={`${colors.iconBg} rounded-xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {Icon && <Icon className={`w-6 h-6 ${colors.icon}`} />}
        </div>
      </div>
    </div>
  )
}

export default StatCard
