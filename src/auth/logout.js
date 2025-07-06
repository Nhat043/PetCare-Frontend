/**
 * Logout utility function
 * Clears all user data and redirects to home page
 */
export const logout = (navigate) => {
    // Clear session storage
    sessionStorage.clear();

    // Clear local storage
    localStorage.clear();

    // Clear all cookies
    document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Dispatch custom event to notify auth change
    window.dispatchEvent(new Event('user-auth-changed'));

    // Redirect to home page if navigate function is provided
    if (navigate) {
        navigate('/');
    }

    // Reload the page to ensure clean state
    window.location.reload();
};

/**
 * Check if user is logged in
 * @returns {boolean} true if user is logged in, false otherwise
 */
export const isLoggedIn = () => {
    const userData = sessionStorage.getItem('userData');
    return userData !== null;
};

/**
 * Get current user data from session
 * @returns {Object|null} user data object or null if not logged in
 */
export const getCurrentUser = () => {
    const userData = sessionStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}; 