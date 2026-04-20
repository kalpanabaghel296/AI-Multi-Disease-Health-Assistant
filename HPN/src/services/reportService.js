import api from './api';

export const reportService = {

  uploadReport: async (file) => {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.fileName || "report.jpg",
      type: file.type || "image/jpeg",
    });

    const res = await api.post("/report/upload-report", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: [(data) => data], // ✅ prevents Axios from JSON-serializing FormData
    });

    return res.data;
  },

  extractReport: async (file) => {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      type: file.type || "image/jpeg",
      name: file.fileName || "report.jpg",
    });

    const res = await api.post("/report/extract", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: [(data) => data], // ✅
    });

    return res.data;
  },

  analyzeReport: async (file) => {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      type: file.type || "image/jpeg",
      name: file.fileName || "report.jpg",
    });

    const res = await api.post("/report/analyze", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: [(data) => data], // ✅
    });

    return res.data;
  },

};