import {create} from 'zustand';

export const usePatientStore = create((set) => ({
    patients: [],
    setPatients: (data) => set(() => ({patients: data})),
    addPatient: (newPatient) =>
        set((state) => ({patients: [...state.patients, newPatient]})),
    removePatient: (id) =>
        set((state) => {
            const _patients = state.patients.filter((p) => p.id !== id);
            return {patients: _patients};
        }),
    editPatient: (id, data) =>
        set((state) => {
            const index = state.patients.findIndex(p => p.id === id);
            const _patients = state.patients;
            _patients[index] = {...state.patients[index], ...data};
            return {patients: _patients};
        }),
}));
