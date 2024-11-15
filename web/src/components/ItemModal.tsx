import React from'react';
import { InventoryItem } from '../util/types';

interface ItemModalProps {
    item: InventoryItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, isOpen, onClose }) => {
    if (!isOpen || !item) return null;

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
    );
};