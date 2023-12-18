import {create} from 'zustand';

export const useChartStore = create((set) => ({
    charts: [],
    setCharts: (data) => set(() => ({charts: data})),
    addChart: (newChart) =>
        set((state) => ({charts: [...state.charts, newChart]})),
    removeChart: (id) =>
        set((state) => {
            const _charts = state.charts.filter((c) => c.id !== id);
            return {charts: _charts};
        }),
    editChart: (id, data) =>
        set((state) => {
            const index = state.charts.findIndex(c => c.id === id);
            const _charts = state.charts;
            _charts[index] = {...state.charts[index], ...data};
            return {charts: _charts};
        }),
}));
