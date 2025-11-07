import { useSwipeable } from 'react-swipeable'
import { useState } from 'react'
import './SwipeableItem.css'

export function SwipeableItem({ children, onDelete, onSwipeLeft, onSwipeRight }) {
  const [swiped, setSwiped] = useState(false)

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setSwiped(true)
      if (onSwipeLeft) onSwipeLeft()
    },
    onSwipedRight: () => {
      setSwiped(false)
      if (onSwipeRight) onSwipeRight()
    },
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
    delta: 50
  })

  return (
    <div {...handlers} className={`swipeable-item ${swiped ? 'swiped' : ''}`}>
      <div className="swipeable-content">
        {children}
      </div>
      {swiped && onDelete && (
        <div className="swipeable-actions">
          <button 
            className="swipe-delete-btn"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
              setSwiped(false)
            }}
          >
            🗑️ Excluir
          </button>
        </div>
      )}
    </div>
  )
}

