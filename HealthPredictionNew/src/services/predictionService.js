import api from './api';

export const predictionService = {
  // ── Diabetes ──────────────────────────────────────────────────────────────
  diabetes: async (data) => {
    const res = await api.post('/predict/diabetes', data);
    return res.data; // { prediction: 0|1, result: "Diabetic"|"Non-Diabetic" }
  },

  // ── Heart ─────────────────────────────────────────────────────────────────
  heart: async (data) => {
    const res = await api.post('/predict/heart', data);
    return res.data; // { prediction: 0|1, result: "Normal"|"Heart Disease" }
  },

  // ── Lung ──────────────────────────────────────────────────────────────────
  lung: async (data) => {
    const res = await api.post('/predict/lung', data);
    return res.data; // { risk_percentage: 63.42, risk_level: "Low"|"Medium"|"High" }
  },

  // ── Dermatosis (image upload) ─────────────────────────────────────────────
  predictDermatosis: async (imageAsset) => {
    const formData = new FormData();
    formData.append('file', {
      uri: imageAsset.uri,
      type: imageAsset.type || 'image/jpeg',
      name: imageAsset.fileName || 'skin_image.jpg',
    });
    const res = await api.post('/predict/dermatosis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
    // {
    //   prediction: 0-6,
    //   result: "Melanoma" etc,
    //   confidence: 87.5,
    //   all_probabilities: { "Melanoma": 87.5, ... }
    // }
  },

  // ── Pneumonia (image upload) ──────────────────────────────────────────────
  predictPneumonia: async (imageAsset) => {
    const formData = new FormData();
    formData.append('file', {
      uri: imageAsset.uri,
      type: imageAsset.type || 'image/jpeg',
      name: imageAsset.fileName || 'xray_image.jpg',
    });
    const res = await api.post('/predict/pneumonia', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
    // {
    //   prediction: 0|1,
    //   result: "Normal"|"Pneumonia Detected",
    //   confidence: 92.3,
    //   normal_probability: 7.7,
    //   pneumonia_probability: 92.3
    // }
  },
};