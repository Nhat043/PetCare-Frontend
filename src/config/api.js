// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://mslcbzocwi.execute-api.ap-southeast-2.amazonaws.com/api';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: `${API_BASE_URL}/v1/auth`,
    LOGIN: `${API_BASE_URL}/v1/auth/login`,
    REGISTER: `${API_BASE_URL}/v1/auth`,
    AUTH_BY_ID: `${API_BASE_URL}/v1/auth/id`,

    // Posts endpoints
    POSTS: `${API_BASE_URL}/v1/posts`,
    POSTS_UPLOAD_BASE64: `${API_BASE_URL}/v1/posts/upload-base64`,

    // Products endpoints
    PRODUCTS: `${API_BASE_URL}/v1/products`,
    PRODUCTS_UPLOAD_BASE64: `${API_BASE_URL}/v1/products/upload-base64`,

    // Category and Tag endpoints
    CATEGORY: `${API_BASE_URL}/v1/category`,
    TAG: `${API_BASE_URL}/v1/tag`,

    // Comments endpoints
    COMMENTS: `${API_BASE_URL}/v1/comment`,
    COMMENTS_PRODUCT: `${API_BASE_URL}/v1/comment/product`,

    // Rating endpoints
    RATING: `${API_BASE_URL}/v1/rating`,
};

export default API_ENDPOINTS;
