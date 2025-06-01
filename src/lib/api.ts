const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
    // 用户API
    users: {
        create: async (userData: { username: string; email: string; password: string }) => {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            return response.json();
        },
        
        get: async (userId: number) => {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`);
            return response.json();
        },
    },

    // 图片API
    images: {
        upload: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_BASE_URL}/images`, {
                method: 'POST',
                body: formData,
            });
            return response.json();
        },

        get: async (imageId: number) => {
            const response = await fetch(`${API_BASE_URL}/images/${imageId}`);
            return response.json();
        },
    },
}; 