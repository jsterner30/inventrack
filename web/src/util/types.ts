export interface InventoryItem {
    productName: string;
    imageUrl: string;
    sku: string;
    totalInventory: number;
    committed: number;
    available: number;
  }