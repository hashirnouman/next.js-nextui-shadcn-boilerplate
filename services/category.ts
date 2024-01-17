import { API_CONFIG } from '@/constants/api-config';

// all user
export const getCategories = async (page: number, rowsPerPage: number, nameSearch : string, descriptionSearch:string) => {
    console.log('api called');
    const response = await fetch(`${API_CONFIG.BASE_URL}api/Category?page=${page}&pageSize=${rowsPerPage}&nameSearch=${nameSearch}&descriptionSearch=${descriptionSearch}`);
    const json = await response.json();

    return json;
};

// single user
export const getCategory = async (id: string) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}api/Category/GetById?id=${id}`);
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

    const response = await fetch(`${API_CONFIG.BASE_URL}api/Category?id=${id}`, Options);
    const json = await response.json();
    return json;
}
