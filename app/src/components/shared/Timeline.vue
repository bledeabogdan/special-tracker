<template>
  <div>
    <div class="flex-middle" v-if="loading">
      <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
    </div>
    <v-timeline
      v-else-if="matches.length > 0"
      class="mt-5"
      align-top
      :dense="$vuetify.breakpoint.smAndDown"
    >
      <v-timeline-item
        v-for="(match, index) in pagination()"
        :key="index"
        :color="isWin(match) ? 'orange': 'green lighten-1'"
        :icon="isWin(match) ? 'mdi-trophy': getPlatform(match.platform)"
        fill-dot
      >
        <v-card :color="isWin(match) ? 'orange': 'green lighten-1'" dark v-if="match">
          <v-card-title class="title">
            {{match.readable_name}}
            <v-spacer></v-spacer>
            <v-chip class="ma-2" color="white" text-color="white" outlined>
              <v-icon left>mdi-clock</v-icon>
              {{date(match.date).fromNow()}}
            </v-chip>
          </v-card-title>
          <v-card-text class="white text--primary">
            <v-chip
              class="ma-2"
              color="lime darken-2"
              text-color="white"
              v-if="match.matchesplayed > 1"
            >{{match.matchesplayed}} matches played</v-chip>
            <v-chip class="ma-2" color="green" text-color="white">
              <v-icon left>mdi-crosshairs-gps</v-icon>
              {{match.kills}} kills
            </v-chip>
            <v-chip class="ma-2" color="indigo darken-3" text-color="white">
              <v-icon left>mdi-timelapse</v-icon>
              {{match.minutesplayed}} {{match.minutesplayed === 1 ? 'minute' : 'minutes'}} played
            </v-chip>
            <v-chip class="ma-2" color="teal" text-color="white">
              <v-icon left>mdi-run</v-icon>
              {{match.playersoutlived}} outlived
            </v-chip>
          </v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item icon="mdi-plus">
        <v-btn
          @click="loadMore"
          :class="reverse() ? 'ml-2 float-right' : 'mr-2'"
          outlined
          color="indigo"
          :disabled="this.end === this.matches.length -1"
        >Load more</v-btn>
        <v-btn
          @click="reset"
          :class="reverse() ? 'float-right' : ''"
          outlined
          color="orange"
          :disabled="this.end === 4"
        >Reset</v-btn>
      </v-timeline-item>
    </v-timeline>
    <div v-else>
      <v-alert type="info" class="mt-2">Could not get the timeline for matches. Try again later.</v-alert>
    </div>
  </div>
</template>

<script>
import axios from "../../config/axios";
import moment from "moment";
export default {
  props: ["epic"],
  data() {
    let data = {
      matches: [],
      start: 0,
      end: 4,
      loading: false
    };
    data.epicname = this.epic;
    return data;
  },
  created() {
    if (this.epicname) {
      this.getMatches(this.epicname);
    }
  },
  methods: {
    getMatches(value) {
      this.loading = true;
      axios
        .get(`/matches/${value}`)
        .then(res => {
          this.loading = false;
          if (res.data.length != 0) {
            this.matches = res.data;
          }
        })
        .catch(err => {
          this.$notify({
            group: "foo",
            type: "error",
            title: "GET matches error",
            text: err
          });
        });
    },
    pagination() {
      const five = [];
      for (let i = this.start; i <= this.end; i++) {
        five.push(this.matches[i]);
      }
      return five;
    },
    isWin(match) {
      return match.placetop1 === 1;
    },
    date(date) {
      return moment(date);
    },
    getPlatform(platform) {
      switch (platform) {
        case "keyboardmouse":
          return "mdi-laptop-chromebook";
        default:
          return "mdi-gamepad-variant";
      }
    },
    loadMore() {
      this.end += 4;
      if (this.end >= this.matches.length) {
        this.end = this.matches.length - 1;
      }
      this.pagination();
    },
    reset() {
      this.end = 4;
      this.pagination();
      window.scrollTo(0, 0);
    },
    reverse() {
      return window.innerWidth > 960;
    }
  }
};
</script>

<style scoped>
.flex-middle {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>