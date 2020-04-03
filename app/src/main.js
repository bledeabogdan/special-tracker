// vue and vue plugins
import Vue from "vue";
import VueRouter from "vue-router";
import vuetify from "./plugins/vuetify";
import particles from "vue-particles";
import Notifications from 'vue-notification'

// custom components
import App from "./App.vue";
// import Welcome from "./components/Welcome.vue";
// import About from "./components/About.vue";
import Login from "./components/Login.vue";
import Unauthorized from "./components/Unauthorized.vue";
import Register from "./components/Register.vue";
import Profile from "./components/Profile.vue";
import Stats from "./components/Stats.vue";

// admin components
import Admin from "./components/admin/Admin.vue";
import AdminUsers from "./components/admin/AdminUsers.vue";

const isAdmin = (to, from, next) => {
  const user = store.state.auth.user;
  if (user.role === "1") {
    next();
  } else {
    next("/unauthorized");
  }
};

// ant-d components
import "ant-design-vue/dist/antd.css";

// store
import store from "./store";

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(Notifications);
Vue.use(particles);

const router = new VueRouter({
  routes: [
    { path: "/", component: Stats },
    {
      path: "/admin",
      component: Admin,
      beforeEnter: (to, from, next) => isAdmin(to, from, next)
    },
    {
      path: "/admin/users",
      component: AdminUsers,
      beforeEnter: (to, from, next) => isAdmin(to, from, next)
    },

    // { path: "/about", component: About },
    { path: "/stats", component: Stats },
    { path: "/unauthorized", component: Unauthorized },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/profile/:id", component: Profile }
  ],
  mode: "history"
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register", "/", "/about", "/stats"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
