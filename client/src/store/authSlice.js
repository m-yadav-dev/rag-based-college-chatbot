export const createAuthSlice = (set) => ({
    user: null,
    token: null,
    role: null,
    isAuthenticated: false,

    setCredentials: (user, token) => set({
        user,
        token,
        role: user.role,
        isAuthenticated: true
    }),

    logout: () => set({
        user: null,
        token: null,
        role: null,
        isAuthenticated: false
    })
});
