import {create} from 'zustand';

export const useVaccinationStore = create((set) => ({
    vaccinations: [],
    setVaccinations: (data) => set(() => ({vaccinations: data})),
}));
