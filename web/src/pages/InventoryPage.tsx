import React, { useContext } from 'react'
import { Header } from '../components/Header'
import { useLoad } from '../util/load'
import { InventoryItem } from '../util/types'
import { ItemModal } from '../components/ItemModal'
import { Table } from '../components/Table'
import { ClientContext } from '../context/client-context'
import { getProducts } from '../client/get-products'

export const InventoryPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const client = useContext(ClientContext)

  const handleRowClick = (item: InventoryItem): void => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = (): void => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }
  const productLoad = useLoad(async (abort) => {
    if (client == null) {
      return
    }
    // This page size is kind of silly now since we're just doing fake client-side pagination, ultimately we should be
    // doing server-side pagination instead where we fetch each page from the server
    // but I don't really want to do the work to refactor the frontend to do that so it's fine
    const response = await getProducts(client, { pageSize: 200 })
    return (response?.result ?? []).map((product) => ({
      productName: product.title,
      imageUrl: product.images?.nodes?.[0]?.url,
      sku: product?.id?.split('/')?.pop() ?? '',
      totalInventory: product.totalInventory,
      committed: product.totalInventory,
      available: product.totalInventory
    }))
  }, [])

  if (productLoad.pending) {
    return <div>Loading...</div>
  }

  return (
    <div className='inventoryPage'>
      <Header logoUrl='https://cdn.builder.io/api/v1/image/assets/TEMP/b6715c39bd9a8756258d5ef40fce925081f072fe4db40e56a069bb5a65b1174b?placeholderIfAbsent=true&apiKey=c71af66328b44f89bad6bec599ea2336' />

      <main>
        <h1 style={{ paddingTop: '50px', paddingBottom: '20px', textAlign: 'center' }}>
          Inventory: All Locations
        </h1>

        {/* Pass in items to table as array here */}
        <Table items={productLoad?.value ?? []} onRowClick={handleRowClick} />
        <ItemModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </main>
    </div>
  )
}
