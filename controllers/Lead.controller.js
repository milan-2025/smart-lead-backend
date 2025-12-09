const axios = require("axios");

const API_BASE_URL = "https://api.nationalize.io";
const leadController = {
  getDataFromNormalizeApi: async (name) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data for ${name}:`, error.message);
      return { name, error: error.message };
    }
  },
};
