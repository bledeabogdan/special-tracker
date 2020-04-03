const initialState = { toggle: false };

export const drawer = {
    namespaced: true,
    state: initialState,
    actions: {
        toggle({ commit }) {
            commit("toggle");
            return Promise.resolve()
        }
    },
    mutations: {
        toggle(state) {
            state.toggle = !state.toggle;
        }
    }
}