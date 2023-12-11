import axios from "axios"
export async function API(baseUrl, method = 'get', data = {}, headers = {}) {
    try {
      const response = await axios({
        method: method.toLowerCase(), // Menyamakan dengan metode HTTP yang dibutuhkan (get, post, dll.)
        url: baseUrl,
        ...(method.toLowerCase() === 'get' ? { params: data } : { data: data }), // Menyesuaikan dengan jenis metode
        headers: headers,
      });
  
      return response.data;
    } catch (error) {
      console.error('Error calling API:', error);
      throw error;
    }
  }
  
  