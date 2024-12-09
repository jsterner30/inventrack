import React, { useEffect, useState, useContext } from 'react'
import { InventoryItem } from '../util/types'
import { FaPencilAlt } from 'react-icons/fa'
import { useTriggerLoad } from '../util/load'
import { ClientContext } from '../context/client-context'
import { updateInventory } from '../client/update-inventory'

interface ItemModalProps {
  item: InventoryItem | null
  isOpen: boolean
  onClose: () => void
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, isOpen, onClose }) => {
  const interval: number = 10 // Edit this to change the interval of increment and decrement for the inventory and buttons that display it.
  const [isEditing, setIsEditing] = useState(false)
  const [inventory, setInventory] = useState<number>(item?.totalInventory ?? 0)
  const [wasEdited, setWasEdited] = useState<boolean>(false)
  const client = useContext(ClientContext)
  const [saveInventoryState, doSaveInventory] = useTriggerLoad(async (abort) => {
    if (client == null || item == null) {
      return
    }
    const requestBody = { productId: item.sku, quantity: inventory }
    await updateInventory(client, requestBody)
    setIsEditing(false)
    setWasEdited(true)
  })
  useEffect(() => {
    if ((item != null) && typeof item.totalInventory === 'number') {
      setInventory(item.totalInventory) // Update inventory when item changes
    }
  }, [item])
  useEffect(() => {
    // Function to close modal when you hit 'Esc'
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (isOpen && event.key === 'Escape') {
        close(onClose) // Call the onClose callback if Escape is pressed
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

  const close = (onClose: () => void): void => {
    onClose()
    // Refresh the page if any data was edited
    if (wasEdited) {
      window.location.reload()
    }
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2>{item.productName}</h2>
        <div className='modal-body'>
          <img className='product-image' src={item.imageUrl} alt={item.productName} />
          <div className='product-details'>
            <p>SKU: {item.sku}</p>
            <div className='edit-inventory-container'>
              <label>Total Inventory:</label>
              {isEditing
                ? (
                  <div className='inventory-editor'>
                    <button onClick={handleDecrement}>-{interval}</button>
                    <input
                      style={{ paddingRight: '5px' }}
                      type='number'
                      value={inventory}
                      onChange={(e) => setInventory(Number(e.target.value))}
                    />
                    <button onClick={handleIncrement}>+{interval}</button>
                    {saveInventoryState.pending
                      ? (
                        <div>Saving...</div>
                        )
                      : (
                        <button onClick={() => {
                          doSaveInventory()
                        }}
                        >Save
                        </button>
                        )}
                  </div>
                  )
                : (
                  <span>
                    {inventory} <FaPencilAlt className='edit-icon' onClick={handleEditClick} />
                  </span>
                  )}
            </div>
          </div>
        </div>
        <button className='close-button' onClick={() => close(onClose)}>
          Close
        </button>
      </div>
    </div>
  )
}
