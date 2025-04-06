export function Button({ children, onClick, disabled = false, className = '', variant = 'default' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variant === 'link' ? 'text-blue-500 underline' : 'bg-orange-400 text-white rounded-xl px-4 py-2'} ${className}`}
    >
      {children}
    </button>
  );
}
