import {create} from 'zustand';

export const useVaccinationStore = create((set) => ({
    vaccinations: [],
    setVaccinations: (data) => set(() => ({vaccinations: data})),
    addVaccination: (newVaccination) => set((state) => ({vaccinations: [...state.vaccinations, newVaccination]})),
    editVaccination: (id, data) => set((state) => {
        const index = state.vaccinations.findIndex(v => v.id === id);
        const _vaccinations = state.vaccinations;
        _vaccinations[index] = {...state.vaccinations[index], ...data};
        return {vaccinations: _vaccinations};
    }),
}));
