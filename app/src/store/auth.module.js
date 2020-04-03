import AuthService from "../services/auth.service";
import jwt from "vue-jwt-decode";

let user = localStorage.getItem("user");

const initialState = user
  ? {
    status: { loggedIn: true, isAdmin: false },
    user: jwt.decode(user)
  }
  : {
    status: { loggedIn: false, isAdmin: false },
    user: null
  };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(res => {
        if (res.token) {
          let user = jwt.decode(res.token);
          const userState = {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            epicname: user.epicname,
            image: user.image,
            role: user.role
          };
          commit("loginSuccess", userState);
          return Promise.resolve(userState);
        }

        if (res.error) {
          commit("loginFailure", res.error);
          return Promise.resolve(res);
        }
      });
    },
    logout({ commit }) {
      AuthService.logout();
      commit("logout");
    },
    profile({ commit }, newImage) {
      commit("profileUpdate", newImage);
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        response => {
          commit("registerSuccess");
          return Promise.resolve(response.data);
        },
        error => {
          commit("registerFailure");
          return Promise.reject(error);
        }
      );
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    profileUpdate(state, profile) {
      state.user.image = profile.image;
      state.user.nickname = profile.nickname;
      state.user.epicname = profile.epicname;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    }
  }
};
