import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const getIssues = () => {
  // CORRECTED: Added '/issues' to the URL
  return axios.get(`${API_URL}/issues`); 
};

export const getIssueById = (id) => {
  // CORRECTED: Added '/issues/' to the URL
  return axios.get(`${API_URL}/issues/${id}`); 
};

export const createIssue = (issueData) => {
  return axios.post(`${API_URL}/issues`, issueData);
};

export const updateIssueStatus = (id, status) => {
  return axios.patch(`${API_URL}/issues/${id}`, { status });
};

// This function is correct as is
export const getUsers = () => {
  return axios.get(`${API_URL}/users`);
};
// ... keep all your existing functions ...

// This function converts a street address into coordinates using Nominatim API
export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    if (response.data && response.data.length > 0) {
      // Return the coordinates of the first result
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon),
      };
    }
    return null; // No result found
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
};
// ... keep all your existing functions ...

// This function converts coordinates into a street address
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    if (response.data && response.data.display_name) {
      return response.data.display_name; // The full, formatted address
    }
    return "Address not found.";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Could not fetch address.";
  }
};