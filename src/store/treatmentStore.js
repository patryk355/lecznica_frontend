import {create} from 'zustand';

export const useTreatmentStore = create((set) => ({
    treatments: [],
    setTreatments: (data) => set(() => ({treatments: data})),
}));
