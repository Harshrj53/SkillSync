const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
}

const Spinner = ({ size = 'md', className = '' }) => {
  return (
    <div
      className={`inline-block rounded-full border-slate-200 border-t-primary-600 animate-spin ${sizeMap[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

export default Spinner
