import { create } from 'zustand';

interface dirStore {
  direction: string;
  setDirection: (newDir: string) => void;
}

const useDirStore = create<dirStore>((set) => ({
  direction: '',
  setDirection: (newDir) => set({ direction: newDir }),
}));

export default useDirStore;
