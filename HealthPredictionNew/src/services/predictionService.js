import api from './api';

export const predictionService = {
  diabetes: async (data) => {
    const res = await api.post('/predict/diabetes', data);
    return res.data;   // { prediction: 0|1, result: "Diabetic"|"Non-Diabetic" }
  },
  heart: async (data) => {
    const res = await api.post('/predict/heart', data);
    return res.data;   // { prediction: 0|1, result: "Normal"|"Heart Disease" }
  },
  lung: async (data) => {
    const res = await api.post('/predict/lung', data);
    return res.data;   // { risk_percentage: 63.42, risk_level: "Low"|"Medium"|"High" }
  },
};