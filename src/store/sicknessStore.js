import {create} from 'zustand';

export const useSicknessStore = create((set) => ({
    sicknesses: [],
    setSicknesses: (data) => set(() => ({sicknesses: data})),
}));
