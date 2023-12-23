import {create} from 'zustand';

export const useAppointmentStore = create((set) => ({
    appointments: [],
    setAppointments: (data) => set(() => ({appointments: data})),
    addAppointment: (newAppointment) => set((state) => ({appointments: [...state.appointments, newAppointment]})),
    editAppointment: (id, data) => set((state) => {
        const index = state.appointments.findIndex(a => a.id === id);
        const _appointments = state.appointments;
        _appointments[index] = {...state.appointments[index], ...data};
        return {appointments: _appointments};
    }),
}));
