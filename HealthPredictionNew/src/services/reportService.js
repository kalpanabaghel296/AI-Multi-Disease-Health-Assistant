import api from './api';

export const reportService = {
  uploadReport: async (file) => {
    const formData = new FormData();
    formData.append('file', {
      uri:  file.uri,
      type: file.type || 'image/jpeg',
      name: file.fileName || 'report.jpg',
    });
    const res = await api.post('/report/upload-report', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  extractReport: async () => {
    const res = await api.post('/report/extract');
    return res.data;   // { raw_text, structured_data }
  },
  analyzeReport: async () => {
    const res = await api.post('/report/analyze');
    return res.data;   // { extracted, prediction }
  },
};