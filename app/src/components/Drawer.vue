<template>
  <v-navigation-drawer temporary v-model="$store.state.drawer.toggle" app>
    <router-link
      :to="`/profile/${this.$store.state.auth.user.id}`"
      v-if="this.$store.state.auth.user"
    >
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img :src="this.$store.state.auth.user.image"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{this.$store.state.auth.user.nickname}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </router-link>
    <router-link to="/login" v-else>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img
            src="https://pm1.narvii.com/7370/91bac9568618da1c93b2f29927d5e006c3a11ee4r1-900-900v2_hq.jpg"
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Login</v-list-item-title>
          <v-list-item-subtitle>special tracker</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </router-link>

    <v-divider></v-divider>

    <v-list nav dense>
      <!-- <router-link to="/">
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
      </router-link>-->
      <!-- <router-link to="/about">
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-details</v-icon>
          </v-list-item-icon>
          <v-list-item-title>About</v-list-item-title>
        </v-list-item>
      </router-link>-->
      <router-link to="/stats">
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-grid</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Stats</v-list-item-title>
        </v-list-item>
      </router-link>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense>
      <router-link to="/admin" v-if="this.$store.state.auth.user">
        <v-list-item link v-if="this.$store.state.auth.user.role === '1'">
          <v-list-item-icon>
            <v-icon>fa-columns</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
      </router-link>
    </v-list>

    <template v-slot:append v-if="this.$store.state.auth.user">
      <v-list nav dense>
        <v-list-item link @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Log out</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Drawer",
  props: {
    toggle: Boolean
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout").then(() => {
        this.$router.push("/");
      });
    }
  }
};
</script>
