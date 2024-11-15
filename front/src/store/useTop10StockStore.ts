// src/stores/allStockStore.ts
import { create } from 'zustand';
import { IStock } from '@features/Stock/types';

// Define the state and actions for the store
interface Top10StockStore {
  top10Stock: IStock[];
  setTop10Stock: (data: IStock[]) => void;
  updateStock: (updatedStock: IStock) => void;
}

// Create the store
const useTop10StockStore = create<Top10StockStore>((set) => ({
  top10Stock: [],
  setTop10Stock: (data: IStock[]) => set({ top10Stock: data }),
  updateStock: (updatedStock: IStock) => set((state) => ({
    top10Stock: state.top10Stock.map((stock) =>
      stock.stockCode === updatedStock.stockCode ? updatedStock : stock
    ),
  })),
}));

export default useTop10StockStore;
