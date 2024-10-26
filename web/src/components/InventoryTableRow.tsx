import React from 'react'
import { InventoryItem } from '../util/types'

interface Props {
  item: InventoryItem
}

export const InventoryTableRow: React.FC<Props> = ({ item }) => {
  return (
    <div className='row py-3 border-bottom align-items-center'>
      <div className='col-4'>
        <div className='d-flex align-items-center'>
          <img
            src={item.imageUrl}
            alt={item.productName}
            className='me-3'
            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
          />
          <span>{item.productName}</span>
        </div>
      </div>
      <div className='col'>{item.sku}</div>
      <div className='col'>{item.totalInventory}</div>
      <div className='col'>{item.committed}</div>
      <div className='col'>{item.available}</div>
    </div>
  )
}
