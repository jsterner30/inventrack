import React from 'react'

export const InventoryTableHeader: React.FC = () => {
  return (
    <div className='table-responsive'>
      <div className='row fw-bold fs-5 py-3 bg-light border-bottom'>
        <div className='col-4'>Product</div>
        <div className='col'>SKU</div>
        <div className='col'>Total Inventory</div>
        <div className='col'>Committed</div>
        <div className='col'>Available To Sell</div>
      </div>
    </div>
  )
}
