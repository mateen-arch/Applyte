export const createAuthSlice = (set) => ({
    user: undefined,
    setUser: (user) => set({user}),
    // Helper function to check if user has premium subscription
    isPremium: () => {
        const state = set.getState();
        const user = state.user;
        if (!user || !user.subscription) return false;
        return user.subscription.plan !== "free" && user.subscription.status === "active";
    }
})