import axios from 'axios';

const API_URL = 'http://localhost:5000/api/generate';

export const fetchData = async (request: {
  data: FormData;
  headers: { 'Content-Type': string };
}) => {
  try {
    const response = await axios.post(API_URL, request.data, {
      headers: request.headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};
