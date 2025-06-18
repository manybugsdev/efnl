import { useRef, useEffect, useState, useCallback } from 'react'

interface VirtualJoystickProps {
  onMove: (x: number, y: number) => void
}

export const VirtualJoystick = ({ onMove }: VirtualJoystickProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 })

  const radius = 50 // Container radius
  const knobRadius = 20 // Knob radius

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    setStartPos({ x: centerX, y: centerY })
    setCurrentPos({ x: clientX, y: clientY })
    setIsDragging(true)
  }, [])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return

    const deltaX = clientX - startPos.x
    const deltaY = clientY - startPos.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    // Limit movement to container radius
    const limitedDistance = Math.min(distance, radius - knobRadius)
    const angle = Math.atan2(deltaY, deltaX)
    
    const limitedX = Math.cos(angle) * limitedDistance
    const limitedY = Math.sin(angle) * limitedDistance
    
    setCurrentPos({
      x: startPos.x + limitedX,
      y: startPos.y + limitedY
    })

    // Normalize values to -1 to 1 range
    const normalizedX = limitedX / (radius - knobRadius)
    const normalizedY = limitedY / (radius - knobRadius)
    
    onMove(normalizedX, -normalizedY) // Invert Y for game coordinates
  }, [isDragging, startPos, onMove, radius, knobRadius])

  const handleEnd = useCallback(() => {
    setIsDragging(false)
    setCurrentPos(startPos)
    onMove(0, 0)
  }, [startPos, onMove])

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, handleMove, handleEnd])

  const knobStyle = {
    position: 'absolute' as const,
    left: isDragging ? currentPos.x - startPos.x : 0,
    top: isDragging ? currentPos.y - startPos.y : 0,
    transform: 'translate(-50%, -50%)',
    transition: isDragging ? 'none' : 'all 0.2s ease-out'
  }

  return (
    <div
      ref={containerRef}
      className="virtual-joystick"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        touchAction: 'none',
        cursor: 'pointer',
        zIndex: 1000
      }}
    >
      <div
        ref={knobRef}
        className="virtual-joystick-knob"
        style={{
          ...knobStyle,
          width: `${knobRadius * 2}px`,
          height: `${knobRadius * 2}px`,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}