import {create} from 'zustand';

export const usePrescriptionStore = create((set) => ({
    prescriptions: [],
    setPrescriptions: (data) => set(() => ({prescriptions: data})),
}));
