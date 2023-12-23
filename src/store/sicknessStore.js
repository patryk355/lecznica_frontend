import {create} from 'zustand';

export const useSicknessStore = create((set) => ({
    sicknesses: [],
    setSicknesses: (data) => set(() => ({sicknesses: data})),
    addSickness: (newSickness) => set((state) => ({sicknesses: [...state.sicknesses, newSickness]})),
    editSickness: (id, data) => set((state) => {
        const index = state.sicknesses.findIndex(s => s.id === id);
        const _sicknesses = state.sicknesses;
        _sicknesses[index] = {...state.sicknesses[index], ...data};
        return {sicknesses: _sicknesses};
    }),
}));
