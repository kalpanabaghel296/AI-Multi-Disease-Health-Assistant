import api from './api';

export const assistantService = {
  sendMessage: async (message) => {
    const res = await api.post('/assistant/chat', { message });
    return res.data;   // { response: "..." }
  },
};