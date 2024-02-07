import { API_CONFIG } from '@/constants/api-config';


// get Floors
export const getFloors = async () => {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}api/FloorTable/GetFloors`
    );
    if(!response.ok){
        return {};
    }
    else{
        const json = await response.json();
        if (json) return json;
        return {};
    }  
  };

  // get Tables
export const getTables = async (floorId: string) => {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}api/FloorTable/GetTablesByFloorId?floorId=${floorId}`
    );
    if(!response.ok){
        return {};
    }
    else{
        const json = await response.json();
        if (json) return json;
        return {};
    }  
  };