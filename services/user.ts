import { API_CONFIG } from '@/constants/api-config';
import { parseCookies } from 'nookies';
import Jwt from 'jsonwebtoken';



// all users
export const getUsers = async (page: number, rowsPerPage: number, nameSearch: string) => {
    const cookies = parseCookies();
    const token = cookies.token;
    const jsonToken = Jwt.decode(token) as { [key: string]: string };
    const tenantId = jsonToken['tenantId'];
    
    const url = `${API_CONFIG.BASE_URL}api/User`; // Corrected endpoint
    const data = {
        tenant: tenantId,
        page: page,
        pageSize: rowsPerPage,
        search: nameSearch,
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


// single user
export const getUser = async (id: string) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}api/Restaurant/GetById?id=${id}`);
    const json = await response.json();

    if (json) return json;
    return {};
};

// posting a user
export async function addUser(data: any) {
    try {
        const url = `${API_CONFIG.BASE_URL}api/Auth/Register`;
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
    } catch (error) {
        return error;
    }
}


// Delete a user
export async function deleteUser(id: string) {
    const Options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}api/Restaurant?id=${id}`, Options);
    const json = await response.json();
    return json;
}
