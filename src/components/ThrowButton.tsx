interface ThrowButtonProps {
  onThrow: () => void
}

export const ThrowButton = ({ onThrow }: ThrowButtonProps) => {
  const handleClick = () => {
    onThrow()
  }

  return (
    <button
      className="throw-button"
      onClick={handleClick}
      onTouchStart={(e) => {
        e.preventDefault()
        onThrow()
      }}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 100, 100, 0.8)',
        border: '2px solid rgba(255, 255, 255, 0.8)',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'manipulation',
        zIndex: 1000,
        transition: 'all 0.1s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.95)'
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      🍎
    </button>
  )
}