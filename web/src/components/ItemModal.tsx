import React, { useEffect, useState } from 'react'
import { InventoryItem } from '../util/types'
import { FaPencilAlt } from 'react-icons/fa'

interface ItemModalProps {
  item: InventoryItem | null
  isOpen: boolean
  onClose: () => void
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, isOpen, onClose }) => {
  const interval: number = 10 // Edit this to change the interval of increment and decrement for the inventory and buttons that display it.
  const [isEditing, setIsEditing] = useState(false)
  const [inventory, setInventory] = useState<number>(item?.totalInventory ?? 0)
  useEffect(() => {
    console.log(item)
    if ((item != null) && typeof item.totalInventory === 'number') {
      setInventory(item.totalInventory) // Update inventory when item changes
    }
  }, [item])
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

  const handleEditClick = (): void => {
    setIsEditing(true)
  }

  const handleIncrement = (): void => {
    setInventory(prev => prev + interval)
  }

  const handleDecrement = (): void => {
    setInventory(prev => (prev - interval >= 0 ? prev - interval : 0)) // Ensure inventory doesn't go below 0
  }

  const handleSave = (): void => {
    setIsEditing(false)
    alert(`Save complete. New inventory: ${inventory}`)
    // You can add your API call here later
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2>{item.productName}</h2>
        <img src={item.imageUrl} alt={item.productName} />
        <p>SKU: {item.sku}</p>
        <div className='inventory-edit-section'>
          <label>Total Inventory:</label>
          {isEditing
            ? (
              <div className='edit-inventory-container' style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={handleDecrement}>-{interval}</button>
                <input
                  type='number'
                  value={inventory}
                  onChange={(e) => setInventory(Number(e.target.value))}
                  style={{ textAlign: 'center', width: '100px' }}
                />
                <button onClick={handleIncrement}>+{interval}</button>
                <button onClick={handleSave}>Save</button>
              </div>
              )
            : (
              <span>
                {inventory} <FaPencilAlt className='edit-icon' onClick={handleEditClick} />
              </span>
              )}
        </div>
        <br />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
