<template>
  <div>
    <notifications position="top left" group="foo" />

    <v-app>
      <div id="custom-button">
        <v-btn class="mx-2" fab dark small color="#40356F" @click="toggleDrawer">
          <v-icon dark>mdi-menu</v-icon>
        </v-btn>
      </div>

      <Drawer />

      <v-content>
        <v-container fluid class="content">
          <div class="view-content">
            <router-view></router-view>
          </div>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Drawer from "./components/Drawer";
export default {
  name: "App",
  data() {
    return {
      toggle: true
    };
  },
  components: {
    Drawer
  },
  methods: {
    toggleDrawer() {
      this.$store.dispatch("drawer/toggle").then(() => {
        console.log("toggled");
      });
    }
  }
};
</script>
<style>
#custom-button {
  z-index: 2;
  top: 8px;
  display: block;
  position: fixed;
}

#custom-button:hover {
  cursor: pointer;
}

.content {
  min-height: 100vh;
  padding: 30px;
  background: #f0f2f5;
  transition: ease all 0.5s;
}

.view-content {
  padding: 20px;
  border-radius: 5px;
  background: #fff;
  transition: ease all 0.5s;
}

@media only screen and (max-width: 600px) {
  .content {
    padding: 20px;
  }
  .view-content {
    margin-top: 20px;
    padding: 10px;
  }
}
</style>
