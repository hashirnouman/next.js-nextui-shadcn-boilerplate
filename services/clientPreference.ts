import { API_CONFIG } from '@/constants/api-config';
// udpate a clientPreference
export async function updateClientPreference(
    id: number,
    theme: string,
    language: string
  ) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}api/ClientPreference/UpdateClientPreference?id=${id}&theme=${theme}&language=${language}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const json = await response.json();
  
      return json;
    } catch (error) {
      return error;
    }
  }
  
