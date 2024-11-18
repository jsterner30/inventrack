import React, { useEffect } from 'react'
import { InventoryItem } from '../util/types'

interface ItemModalProps {
  item: InventoryItem | null
  isOpen: boolean
  onClose: () => void
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, isOpen, onClose }) => {
  useEffect(() => {
    // Function to close modal when you hit 'Esc'
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (isOpen && event.key === 'Escape') {
        onClose() // Call the onClose callback if Escape is pressed
      }
    }

    if (isOpen) { // Add event listener when the modal is open
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => { // Clean up the event listener when the modal closes or unmounts
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || (item == null)) return null

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2>{item.productName}</h2>
        <img src={item.imageUrl} alt={item.productName} />
        <p>SKU: {item.sku}</p>
        <p>Total Inventory: {item.totalInventory}</p>
        <p>Committed: {item.committed}</p>
        <p>Available: {item.available}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
