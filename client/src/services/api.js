import axios from 'axios';

// Create an instance of Axios with default configurations
const axiosInstance = axios.create({
  baseURL: 'https://codingwebapp-pfyd.onrender.com/api',  // Make sure this points to the correct API
  headers: {
    'Content-Type': 'application/json',
  },
});

// API call to fetch the list of code blocks
const getCodeBlocks = async () => {
  try {
    const response = await axiosInstance.get('/codeBlocks');  // Assuming the API endpoint is /codeBlocks
    return response.data;  // Return the list of code blocks
  } catch (error) {
    console.error('Error fetching code blocks:', error);
    throw error;  // Re-throw the error so the calling component can handle it
  }
};

export { getCodeBlocks };
export default axiosInstance;
