import React from 'react'
import { Header } from '../components/Header'
import { InventoryItem } from '../util/types'
import { Table } from '../components/Table'

const inventoryData: InventoryItem[] = Array(10).fill({
  productName: '10" Stainless Steel Fry Pan',
  imageUrl: 'https://via.placeholder.com/300',
  sku: '56002',
  totalInventory: 111,
  committed: 8,
  available: 103
})

export const InventoryPage: React.FC = () => {
  return (
    <div className='inventoryPage'>
      <Header logoUrl='https://cdn.builder.io/api/v1/image/assets/TEMP/b6715c39bd9a8756258d5ef40fce925081f072fe4db40e56a069bb5a65b1174b?placeholderIfAbsent=true&apiKey=c71af66328b44f89bad6bec599ea2336' />

      <main>
        <h1 style={{ paddingTop: '50px', paddingBottom: '20px', textAlign: 'center' }}>
          Inventory: All Locations
        </h1>

        {/* Pass in items to table as array here */}
        <Table items={inventoryData} />
      </main>
    </div>
  )
}
