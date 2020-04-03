<template>
  <div>
    <div class="flex-middle" v-if="loading">
      <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
    </div>
    <div v-else>
      <div
        class="d-flex justify-center align-center justify-md-space-between align-md-stretch flex-wrap"
      >
        <div v-if="stats">
          {{stats.name}}
          <v-chip class="ma-2" color="orange" text-color="white">
            Level {{stats.account.level}}
            <v-icon right>mdi-star</v-icon>
          </v-chip>
        </div>
        <div>
          <div style="display: flex; justify-content:center; align-items:center;">
            <v-text-field
              v-model="search"
              :rules="rules"
              :disabled="!valid"
              label="Search stats for a different player"
              style="min-width: 255px;"
            ></v-text-field>
            <v-btn icon @click="handleSearch">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <v-divider></v-divider>
      <v-tabs v-if="stats" show-arrows>
        <v-tab key="global">Global stats</v-tab>
        <v-tab>Recent matches</v-tab>
        <v-tab>Shop</v-tab>
        <v-tab-item>
          <v-layout row wrap style="padding:10px">
            <v-flex
              v-for="stat in global"
              :key="stat.name"
              xs12
              sm12
              md4
              order-md1
              order-sm1
              align-center
              justify-center
              class="mb-3"
            >
              <v-card
                class="mx-auto"
                :color="stat.name === 'Solo' ? '#26c6da' : stat.name === 'Duo' ?'#29B6F6' :'#9575CD'"
                dark
                max-width="400"
              >
                <v-card-title>
                  <img
                    src="https://image.fnbr.co/emote/5c19196b41eb8a04ae40b688/icon.png"
                    width="50"
                    height="50"
                  />
                  <span class="title">{{stat.name}}</span>
                  <v-spacer></v-spacer>
                  <v-chip class="ma-2" color="orange" label>{{stat.placetop1}} wins</v-chip>
                </v-card-title>

                <v-card-text class="headline font-weight-bold" style="text-align:center">
                  <v-chip class="ma-2" color="green" text-color="white">{{stat.kills}} kills</v-chip>
                  <v-chip class="ma-2" color="secondary" text-color="white">{{stat.kd}} K/D</v-chip>
                  <v-chip
                    class="ma-2"
                    color="teal"
                    text-color="white"
                  >{{calculateWinRate(stat.winrate)}}% win</v-chip>
                </v-card-text>
                <v-card-text
                  class="d-flex justify-center align-center flex-wrap headline font-weight-bold"
                >
                  <div v-for="number in tops" :key="number">
                    <div class="top-placement" v-if="stat[`placetop${number}`]!=0">
                      <div class="title box flex-middle">TOP {{number}}</div>
                      <div class="box flex-middle">{{stat[`placetop${number}`]}}</div>
                    </div>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-list-item class="grow">
                    <v-row align="center" justify="center">
                      <div class="mt-1">
                        <v-icon class="mr-1">mdi-flash</v-icon>
                        <span class="subheading mr-2">{{stat.playersoutlived}} outlived</span>
                      </div>
                      <div class="mt-1">
                        <v-icon class="mr-1">mdi-image-filter-tilt-shift</v-icon>
                        <span class="subheading mr-2">{{stat.matchesplayed}} matches</span>
                      </div>
                      <div class="mt-1">
                        <v-icon class="mr-1">mdi-clock</v-icon>
                        <span class="subheading">{{convertMinutes(stat.minutesplayed)}}</span>
                      </div>
                    </v-row>
                  </v-list-item>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-tab-item>
        <v-tab-item>
          <Timeline
            :epic="this.search != '' ? this.search : this.$store.state.auth.user ? this.$store.state.auth.user.epicname : ''"
          />
        </v-tab-item>
        <v-tab-item>
          <Shop />
        </v-tab-item>
      </v-tabs>
      <div v-else>
        <span>Enter an epic name and see the stats!</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../config/axios";
import Timeline from "./shared/Timeline";
import Shop from "./shared/Shop";

export default {
  components: {
    Timeline,
    Shop
  },
  data() {
    return {
      loading: false,
      stats: null,
      search: "",
      valid: true,
      rules: [v => !!v || "Enter an epic name"],
      global: null,
      tops: ["3", "5", "10", "12", "25"]
    };
  },
  created() {
    if (this.$store.state.auth.user) {
      this.getStats(this.$store.state.auth.user.epicname);
    }
  },
  methods: {
    getStats(epicname) {
      if (epicname != "") {
        this.loading = true;
        axios
          .get(`/stats/${epicname}`)
          .then(res => {
            this.loading = false;
            let global = {};
            if (res.data.global_stats.solo) {
              global.a = { name: "Solo", ...res.data.global_stats.solo };
            }
            if (res.data.global_stats.duo) {
              global.b = { name: "Duo", ...res.data.global_stats.duo };
            }
            if (res.data.global_stats.squad) {
              global.c = { name: "Squad", ...res.data.global_stats.squad };
            }
            this.stats = res.data;
            this.global = global;
          })
          .catch(err => {
            this.$notify({
              group: "foo",
              type: "error",
              title: "GET stats error",
              text: err
            });
          });
      } else {
        this.stats = null;
        this.loading = false;
      }
    },
    handleSearch() {
      this.getStats(this.search);
    },
    convertMinutes(num) {
      let d = Math.floor(num / 1440);
      let h = Math.floor((num - d * 1440) / 60);
      let m = Math.round(num % 60);

      if (d > 0) {
        return d + " days";
      } else if (h > 0) {
        return h + " hours";
      } else {
        return m + " minutes";
      }
    },
    calculateWinRate(value) {
      return (value * 100).toFixed(2);
    },
    capitalizeFirstLetter(string) {
      return `${string[0].toUpperCase()}${string.slice(1)}`;
    },
    phoneSize() {
      return window.innerWidth < 600;
    }
  }
};
</script>

<style scoped>
.top-placement {
  width: 100px;
  height: 80px;
  border-radius: 10px;
}

.flex-middle {
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  padding: 5px;
}
</style>