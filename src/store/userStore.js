import {create} from 'zustand';

export const useUserStore = create((set) => ({
    user: {
        id: null,
        login: '',
        is_admin: null,
        token: ''
    },
    setUser: (data) => set(() => ({user: data})),
}));
