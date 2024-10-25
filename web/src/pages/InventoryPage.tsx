import React from 'react';
import { Header } from '../components/Header';
import { InventoryTableHeader } from '../components/InventoryTableHeader';
import { InventoryTableRow } from '../components/InventoryTableRow';
import { InventoryItem } from '../util/types';

const inventoryData: InventoryItem[] = Array(10).fill({
  productName: '10" Stainless Steel Fry Pan',
  imageUrl: 'https://example.com/pan-image.jpg',
  sku: '56002',
  totalInventory: 111,
  committed: 8,
  available: 103,
});

export const InventoryPage: React.FC = () => {
  return (
    <div className="min-vh-100 bg-white">
      <Header logoUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/b6715c39bd9a8756258d5ef40fce925081f072fe4db40e56a069bb5a65b1174b?placeholderIfAbsent=true&apiKey=c71af66328b44f89bad6bec599ea2336" />
      
      <main className="container-fluid px-4">
        <h1 className="fs-2 fw-semibold my-4">
          Inventory: All Locations
        </h1>

        <div className="table-responsive">
          <InventoryTableHeader />
          {inventoryData.map((item, index) => (
            <InventoryTableRow key={index} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
};