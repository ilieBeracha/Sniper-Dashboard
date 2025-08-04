import axios from "axios";
const BASE_URL = import.meta.env.VITE_GROUPING_DETECTOR_SERVER_URL;

export const detectGrouping = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${BASE_URL}/upload/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
