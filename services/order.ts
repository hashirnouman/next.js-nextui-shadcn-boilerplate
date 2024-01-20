import { API_CONFIG } from '@/constants/api-config';

// all orders
export const getOrders = async (
  page: number,
  rowsPerPage: number,
  descriptionSearch: string,
  sortBy: string,
  sortOrder: string
) => {
  console.log('api called');
  const url = `${API_CONFIG.BASE_URL}api/Order/GetOrders`;
  const data = {
    page: page,
    pageSize: rowsPerPage,
    sortBy: sortBy,
    sortOrder: sortOrder,
    descriptionSearch: descriptionSearch,
  };
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url, requestOptions);
  const json = await response.json();

  return json;
};