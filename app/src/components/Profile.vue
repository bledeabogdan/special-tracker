<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 order-md1 order-sm1 align-center justify-center></v-flex>
      <v-flex xs12 sm6 md6 order-md3 order-sm3 align-center justify-center>
        <v-card class="card flex-middle">
          <h2 class="card-title">Edit profile details</h2>
          <v-form ref="form" v-model="valid" class="form">
            <div class="card flex-middle image">
              <input type="file" style="display: none" ref="fileinput" @change="beforeUpload" />
              <img :src="profile.image" class="avatar" @click="upload" />
            </div>
            <v-text-field v-model="profile.email" label="Email" disabled></v-text-field>
            <v-text-field v-model="profile.epicname" :rules="epicnameRules" label="Epicname"></v-text-field>
            <v-text-field v-model="profile.nickname" :rules="nicknameRules" label="Nickname"></v-text-field>
            <v-btn
              :disabled="!valid"
              color="#40356F"
              class="mr-4"
              @click="handleSubmit"
            >Update profile</v-btn>
            <v-btn class="mr-4" @click="resetProfileForm">Reset</v-btn>
          </v-form>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md6 order-md4 order-sm4 align-center justify-center>
        <v-card class="card flex-middle" style="flex-direction: column">
          <h2 class="card-title">Update profile password</h2>
          <v-form ref="passwordForm" class="form" v-model="passwordValid">
            <v-text-field
              v-model="password.new"
              :rules="passwordRules"
              label="New password"
              type="password"
            ></v-text-field>
            <v-text-field
              v-model="password.confirmed"
              :rules="confirmedPasswordRules"
              label="Confirm password"
              type="password"
            ></v-text-field>
            <v-btn
              color="#40356F"
              :disabled="!passwordValid"
              class="mr-4"
              @click="handleSubmitPassword"
            >Update password</v-btn>
            <v-btn class="mr-4" @click="resetPasswordForm">Reset</v-btn>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "../config/axios";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default {
  name: "Profile",
  data() {
    return {
      profile: {},
      password: {
        new: "",
        confirmed: ""
      },
      valid: false,
      passwordValid: false,
      nicknameRules: [v => !!v || "Nickname is required!"],
      epicnameRules: [v => !!v || "Epicname is required!"],
      passwordRules: [v => !!v || "Password is required!"],
      confirmedPasswordRules: [
        v => !!v || "Confirm the password!",
        v => v === this.password.new || "Passwords not equal!"
      ]
    };
  },
  created() {
    this.getUserDetail();
  },
  methods: {
    getUserDetail() {
      axios.get(`/user/profile/${this.$route.params.id}`).then(res => {
        this.profile = res.data;
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      axios
        .post(`/user/profile/${this.$route.params.id}`, this.profile)
        .then(() => {
          this.$notify({
            group: "foo",
            type: "success",
            title: "Update feedback",
            text: "Profile updated successfully!"
          });
          this.changed = false;
          this.$store.dispatch("auth/profile", this.profile);
        })
        .catch(err => {
          this.$notify({
            group: "foo",
            type: "error",
            title: "Update error",
            text: `Something went wrong! ${err.message}`
          });
        });
    },
    handleSubmitPassword(e) {
      e.preventDefault();
      axios
        .post(`/user/password/${this.$route.params.id}`, {
          password: this.password.confirmed
        })
        .then(() => {
          this.$notify({
            group: "foo",
            type: "success",
            title: "Update feedback",
            text: "Password updated successfully!"
          });
        })
        .catch(err => {
          this.$notify({
            group: "foo",
            type: "error",
            title: "Update error",
            text: `Something went wrong! ${err.message}`
          });
        });
    },
    handleChange(file) {
      getBase64(file, imageUrl => {
        this.profile.image = imageUrl;
      });
    },
    beforeUpload(e) {
      const file = e.target.files[0];
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$notify({
          group: "foo",
          type: "error",
          title: "Upload error",
          text: "You can only upload JPG or PNG file!"
        });
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$notify({
          group: "foo",
          type: "error",
          title: "Upload error",
          text: "File size must be smaller than 2MB!"
        });
      }
      if (isJpgOrPng && isLt2M) {
        this.handleChange(file);
      }
    },
    upload() {
      this.$refs.fileinput.click();
    },
    resetProfileForm() {
      this.getUserDetail();
    },
    resetPasswordForm() {
      this.$refs.passwordForm.reset();
    }
  }
};
</script>

<style scoped>
.form {
  width: 80%;
}
.avatar {
  height: 100px;
  width: 100px;
  border-radius: 50%;
}
.avatar:hover {
  opacity: 0.5;
  content: "pic";
}
.card {
  padding: 20px;
  margin-top: 10px;
  height: 100%;
}
.card-title {
  position: absolute;
  top: 0;
  padding-left: 10px;
  padding-top: 10px;
}
.flex-middle {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media only screen and (min-width: 600px) {
  .card {
    margin: 10px;
  }
}
</style>
