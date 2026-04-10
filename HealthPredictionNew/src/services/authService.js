import api from './api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;                     // { access_token, token_type }
  },
  register: async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    return res.data;                     // { message: "User registered successfully" }
  },
};