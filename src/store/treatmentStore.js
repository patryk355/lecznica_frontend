import {create} from 'zustand';

export const useTreatmentStore = create((set) => ({
    treatments: [],
    setTreatments: (data) => set(() => ({treatments: data})),
    addTreatment: (newTreatment) => set((state) => ({treatments: [...state.treatments, newTreatment]})),
    editTreatment: (id, data) => set((state) => {
        const index = state.treatments.findIndex(t => t.id === id);
        const _treatments = state.treatments;
        _treatments[index] = {...state.treatments[index], ...data};
        return {treatments: _treatments};
    }),
}));
