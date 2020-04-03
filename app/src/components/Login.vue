<template>
  <div class="login-container">
    <div style="z-index: 2;">
      <img src="../assets/logo.png" height="100px" />
    </div>
    <v-form ref="form" v-model="valid" class="login-form">
      <v-text-field solo v-model="email" :rules="emailRules" label="Email" required></v-text-field>
      <v-text-field
        solo
        v-model="password"
        :rules="passwordRules"
        label="Password"
        type="password"
        required
      ></v-text-field>
      <v-btn block :disabled="!valid" color="#40356F" class="mr-4" @click="submit">Login</v-btn>
      <div style="margin-top: 10px;">
        Don't you have an account?
        <router-link to="/register">Sign up</router-link>
        <span>&nbsp;now.</span>
      </div>
    </v-form>
    <vue-particles color="#40356F" class="particles" :clickEffect="false" :hoverEffect="false"></vue-particles>
  </div>
</template>

<style>
.particles {
  position: absolute;
  width: 90%;
  height: 85%;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 85vh;
}
.login-form {
  width: 50%;
  padding: 50px;
  z-index: 2;
  transition: ease all 0.5s;
}

@media only screen and (max-width: 600px) {
  .login-form {
    width: 90%;
    padding: 20px;
  }
  .particles {
    width: 80%;
  }
}
</style>

<script>
export default {
  name: "Login",
  data() {
    return {
      valid: false,
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
      if (this.email != "" && this.password != "") {
        const values = { email: this.email, password: this.password };
        this.$store.dispatch("auth/login", values).then(res => {
          if (res.error) {
            this.$notify({
              group: "foo",
              type: "error",
              title: "Login error",
              text: res.error
            });
          } else {
            this.$router.push("/");
          }
        });
      }
    }
  }
};
</script>
