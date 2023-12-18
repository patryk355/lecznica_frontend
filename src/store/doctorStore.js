import {create} from 'zustand';

export const useDoctorStore = create((set) => ({
    doctors: [], setDoctors: (data) => set(() => ({doctors: data})),
}));
