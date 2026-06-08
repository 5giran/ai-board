import { create } from 'zustand'

type UiState = {
  isCommandOpen: boolean
  setCommandOpen: (isOpen: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  isCommandOpen: false,
  setCommandOpen: (isCommandOpen) => set({ isCommandOpen }),
}))
