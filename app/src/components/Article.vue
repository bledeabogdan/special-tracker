<template>
  <div>
    <a-spin size="large" v-if="loading" />
    <div v-else>
      <h1>{{ this.article.title }}</h1>
      <div class="image-container">
        <img :src="this.article.image" class="image" />
      </div>
      <div class="text-container">
        {{ this.article.description }}
      </div>
      <a-divider>Comments</a-divider>
      <div>
        <a-comment v-for="comment in comments" :key="comment._id">
          <a-avatar
            :src="$store.state.auth.user.image"
            :alt="comment.author"
            slot="avatar"
          />
          <p slot="content">
            {{ comment.comment }}
          </p>
          <a-tooltip
            slot="datetime"
            :title="moment(comment.datetime).format('YYYY-MM-DD HH:mm:ss')"
          >
            <span>{{ moment(comment.datetime).fromNow() }}</span>
          </a-tooltip>
        </a-comment>
      </div>
      <a-comment>
        <a-avatar
          slot="avatar"
          :src="this.$store.state.auth.user.image"
          :alt="
            `${this.$store.state.auth.user.firstName} ${this.$store.state.auth.user.lastName}`
          "
        />
        <div slot="content">
          <a-form-item>
            <a-textarea
              :rows="4"
              @change="handleChange"
              :value="value"
            ></a-textarea>
          </a-form-item>
          <a-form-item>
            <a-button
              htmlType="submit"
              :loading="submitting"
              @click="handleSubmit"
              type="primary"
              :disabled="this.value === ''"
            >
              Add Comment
            </a-button>
          </a-form-item>
        </div>
      </a-comment>
    </div>
  </div>
</template>

<script>
import axios from "../config/axios";
import moment from "moment";
export default {
  name: "Article",
  data() {
    return {
      loading: false,
      article: {},
      comments: [],
      submitting: false,
      value: "",
      likes: 0,
      dislikes: 0,
      action: null,
      moment
    };
  },
  created() {
    this.getArticle();
    this.getComments();
  },
  methods: {
    getArticle() {
      this.loading = true;
      axios
        .get(`/article/${this.$route.params.id}`)
        .then(res => {
          this.loading = false;
          this.article = res.data.article;
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    getComments() {
      axios
        .get(`/comments/${this.$route.params.id}`)
        .then(res => {
          if (res.data.comments) {
            this.comments = res.data.comments;
          } else {
            this.comments = [];
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSubmit() {
      if (!this.value) {
        return;
      }

      this.submitting = true;

      let comment = {
        author: `${this.$store.state.auth.user.firstName} ${this.$store.state.auth.user.lastName}`,
        comment: this.value,
        datetime: moment().format()
      };

      axios
        .post(
          `/article/${this.$route.params.id}`,
          comment
        )
        .then(() => {
          this.submitting = false;
          this.value = "";
          this.getComments();
        })
        .catch(error => {
          this.submitting = false;
          console.log(error);
        });
    },
    handleChange(e) {
      this.value = e.target.value;
    },
    like() {
      this.likes = 1;
      this.dislikes = 0;
      this.action = "liked";
    },
    dislike() {
      this.likes = 0;
      this.dislikes = 1;
      this.action = "disliked";
    }
  }
};
</script>

<style scoped>
.image-container {
  height: 150px;
}
.image {
  object-fit: cover;
  width: 100%;
  height: 150px;
}
.text-container {
  margin-top: 20px;
  font-size: 20px;
  display: block;
}
</style>
