<template>
  <div class="login-container">
    <div style="z-index: 2;">
      <img src="../assets/logo.png" height="100px" />
    </div>
    <v-form ref="form" v-model="valid" class="login-form">
      <v-text-field solo v-model="email" :rules="emailRules" label="Email" required></v-text-field>
      <v-text-field solo v-model="nickname" :rules="nicknameRules" label="Nickname" required></v-text-field>
      <v-text-field solo v-model="epicname" :rules="epicnameRules" label="Epic name" required></v-text-field>
      <v-text-field
        solo
        v-model="password"
        :rules="passwordRules"
        label="Password"
        type="password"
        required
      ></v-text-field>
      <v-btn block :disabled="!valid" color="#40356F" class="mr-4" @click="submit">Register</v-btn>
      <div style="margin-top: 10px;">
        Already have an account?
        <router-link to="/login">Login</router-link>
        <span>&nbsp;instead.</span>
      </div>
    </v-form>
    <vue-particles color="#40356F" class="particles" :clickEffect="false" :hoverEffect="false"></vue-particles>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>

<script>
export default {
  name: "Login",
  data() {
    return {
      valid: false,
      nickname: "",
      nicknameRules: [v => !!v || "Nickname is required"],
      epicname: "",
      epicnameRules: [v => !!v || "Epic name is required"],
      password: "",
      passwordRules: [v => !!v || "Password is required"],
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/");
    }
  },
  methods: {
    submit(e) {
      e.preventDefault();
      if (
        this.email != "" &&
        this.nickname != "" &&
        this.epicname != "" &&
        this.password != ""
      ) {
        const values = {
          email: this.email,
          nickname: this.nickname,
          epicname: this.epicname,
          password: this.password
        };
        this.$store.dispatch("auth/register", values).then(() => {
          this.$notify({
            group: "foo",
            type: "success",
            title: "Register feedback",
            text: "Account successfully created!"
          });
          this.$router.push("/login");
        });
      }
    }
  }
};
</script>
