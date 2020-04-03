<template>
  <div class="header-container">
    <a-menu
      theme="dark"
      v-model="current"
      class="height-100"
      mode="inline"
      :inlineCollapsed="collapsed"
      :defaultSelectedKeys="['home']"
      :defaultOpenKeys="['home']"
    >
      <a-menu-item key="home">
        <router-link to="/">
          <a-icon type="laptop" /><span>specialdoom</span>
        </router-link>
      </a-menu-item>
      <a-menu-item v-if="this.$store.state.auth.status.loggedIn" key="articles">
        <router-link to="/articles">
          <a-icon type="appstore" /><span>Articles</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="about">
        <router-link to="/about">
          <a-icon type="question" /><span>About</span>
        </router-link>
      </a-menu-item>
      <a-menu-item v-if="!this.$store.state.auth.status.loggedIn" key="login">
        <router-link to="/login">
          <a-icon type="unlock" /><span>Login</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu v-else key="hello">
        <span slot="title"
          ><a-icon type="smile" /><span
            >Hello {{ this.headerName() }}</span
          ></span
        >
        <a-menu-item key="profile"
          ><router-link :to="`/profile/${this.$store.state.auth.user.id}`">
            <a-icon type="edit" /><span>Profile</span>
          </router-link></a-menu-item
        >
        <a-menu-item key="logout"
          ><router-link to="/logout">
            <a-icon type="lock" /><span>Log out</span>
          </router-link></a-menu-item
        >
      </a-sub-menu>
      <a-divider v-if="isAdmin" />
      <a-menu-item v-if="isAdmin" key="admin">
        <router-link to="/admin">
          <a-icon type="appstore" /><span>Dashboard</span>
        </router-link>
      </a-menu-item>
    </a-menu>
    <a-button class="toggle-button" type="link" @click="toggleCollapsed"
      ><a-icon :type="collapsed ? 'right' : 'left'"
    /></a-button>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      current: ["home"],
      collapsed: true
    };
  },
  computed: {
    isAdmin() {
      if (this.$store.state.auth.user) {
        return this.$store.state.auth.user.role === "1";
      }
      return false;
    }
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    headerName() {
      let name = "";

      if (this.$store.state.auth.user) {
        let firstName = this.$store.state.auth.user.firstName;
        let lastName = this.$store.state.auth.user.lastName;
        name = firstName.charAt(0) + lastName.charAt(0);
      }

      return name;
    }
  }
};
</script>

<style>
.header-container {
  position: fixed;
  z-index: 90;
}

.height-100 {
  height: 100vh;
}

.toggle-button {
  z-index: 90;
  bottom: 40px;
  width: 100%;
}
</style>
