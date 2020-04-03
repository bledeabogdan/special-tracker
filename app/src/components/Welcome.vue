<template>
  <div class="welcome-container">
    <v-carousel cycle height="400" hide-delimiter-background show-arrows-on-hover>
      <v-carousel-item v-for="(slide, i) in slides" :key="i">
        <v-sheet :color="colors[i]" height="100%">
          <v-row class="fill-height" align="center" justify="center">
            <div class="display-3">{{ slide }} Slide</div>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      colors: [
        "indigo",
        "warning",
        "pink darken-2",
        "red lighten-1",
        "deep-purple accent-4"
      ],
      slides: ["First", "Second", "Third", "Fourth", "Fifth"]
    };
  }
};
</script>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.welcome-logo {
  font-size: 40px;
}

img {
  height: 100px;
}

.flex-grid {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.flex-grid-content {
  width: 230px;
}

.flex-grid-content:hover {
  border-radius: 10px;
  z-index: 9;
  box-shadow: 2px 7px 15px #888888;
}

.flex-middle {
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-subscription {
  display: flex;
}

.welcome-container > div {
  margin: 5px;
}

.welcome-subscription > div {
  margin: 5px;
}

.inline {
  display: flex;
  flex-direction: row;
}
</style>
