import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, type StateStorage } from 'zustand/middleware';

const stateStorage: StateStorage = {
  getItem: async (name) => AsyncStorage.getItem(name),
  setItem: async (name, value) => AsyncStorage.setItem(name, value),
  removeItem: async (name) => AsyncStorage.removeItem(name),
};

export const zustandStorage = createJSONStorage(() => stateStorage);
