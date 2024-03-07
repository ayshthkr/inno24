// src/utils/geocode.js
import axios from 'axios';

const getGeocode = async (place) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: place,
        format: 'json',
      },
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error fetching geocode:', error);
    throw error;
  }
};

export default getGeocode;
