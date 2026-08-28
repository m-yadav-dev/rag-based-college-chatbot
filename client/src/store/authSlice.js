export const createAuthSlice = (set) => {
    // Attempt to hydrate state from localStorage on load
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    return {
        user: user || null,
        token: token || null,
        role: user?.role || null,
        isAuthenticated: !!token,

        setCredentials: (user, token) => {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            set({
                user,
                token,
                role: user.role,
                isAuthenticated: true
            });
        },

        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({
                user: null,
                token: null,
                role: null,
                isAuthenticated: false
            });
        }
    };
};
