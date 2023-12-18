import { create } from 'zustand';

export const useClientStore = create((set) => ({
  clients: [],
  setClients: (data) => set(() => ({ clients: data })),
  addClient: (newClient) =>
    set((state) => ({ clients: [...state.clients, newClient] })),
  removeClient: (id) =>
    set((state) => {
      const _clients = state.clients.filter((c) => c.id !== id);
      return { clients: _clients };
    }),
    editClient: (id, data) =>
        set((state) => {
            const index = state.clients.findIndex(c => c.id === id);
            const _clients = state.clients;
            _clients[index] = {...state.clients[index], ...data};
            return {clients: _clients};
        }),
}));
