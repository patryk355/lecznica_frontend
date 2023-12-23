import {create} from 'zustand';

export const usePrescriptionStore = create((set) => ({
    prescriptions: [],
    setPrescriptions: (data) => set(() => ({prescriptions: data})),
    addPrescription: (newPrescription) => set((state) => ({prescriptions: [...state.prescriptions, newPrescription]})),
    editPrescription: (id, data) => set((state) => {
        const index = state.prescriptions.findIndex(p => p.id === id);
        const _prescriptions = state.prescriptions;
        _prescriptions[index] = {...state.prescriptions[index], ...data};
        return {prescriptions: _prescriptions};
    }),
}));
