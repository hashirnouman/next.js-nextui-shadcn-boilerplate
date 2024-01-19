import { API_CONFIG } from '@/constants/api-config';

// all categories
export const getCategories = async (
  page: number,
  rowsPerPage: number,
  nameSearch: string,
  descriptionSearch: string,
  sortBy: string,
  sortOrder: string
) => {
  console.log('api called');
  const url = `${API_CONFIG.BASE_URL}api/Category/GetCategories`;
  const data = {
    page: page,
    pageSize: rowsPerPage,
    sortBy: sortBy,
    sortOrder: sortOrder,
    nameSearch: nameSearch,
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

// single category
export const getCategory = async (id: string) => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}api/Category/GetById?id=${id}`
  );
  const json = await response.json();

  if (json) return json;
  return {};
};

// posting a category
export async function addCategory(formData: FormData) {
  try {
    const Options = {
      method: 'POST',
      body: formData,
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}api/Category`, Options);
    const json = await response.json();

    return json;
  } catch (error) {
    return error;
  }
}

// Delete a category
export async function deleteCategory(id: string) {
  const Options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };

  const response = await fetch(
    `${API_CONFIG.BASE_URL}api/Category?id=${id}`,
    Options
  );
  const json = await response.json();
  return json;
}
