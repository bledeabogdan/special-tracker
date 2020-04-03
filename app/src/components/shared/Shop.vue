<template>
  <v-container class="grey lighten-5">
    <v-row class="mb-6">
      <v-col
        v-for="item in shop.daily"
        :key="item.id"
        class="d-flex justify-center align-center justify-md-start align-md-start"
      >
        <v-card
          class="pa-2"
          tile
          outlined
          :style="`height: 200px; width: 200px; background: url(${item.full_background}); background-size: 199px 199px;`"
        ></v-card>
      </v-col>
    </v-row>
    <v-row class="mb-6">
      <v-col
        v-for="item in shop.featured"
        :key="item.id"
        class="d-flex justify-center align-center justify-md-start align-md-start"
      >
        <v-card
          class="pa-2"
          tile
          outlined
          :style="`height: 200px; width: 200px; background: url(${item.full_background}); background-size:199px 199px;`"
        ></v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "../../config/axios";
export default {
  name: "Shop",
  data() {
    return {
      shop: {
        daily: {},
        feature: {}
      }
    };
  },
  created() {
    this.getDailyShop();
  },
  methods: {
    getDailyShop() {
      axios
        .get("/daily-shop")
        .then(res => {
          this.shop.daily = res.data.daily;
          this.shop.featured = res.data.featured;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>