<template>
  <div>
    <router-link to="/admin/users">
      <v-card color="#385F73" dark>
        <v-card-title class="headline">Manage users</v-card-title>

        <v-card-subtitle>Manage the existing users of the application!</v-card-subtitle>
      </v-card>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "Admin"
};
</script>

<style scoped>
.card {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: #1b445f;
  border-radius: 10px;
  margin-top: 10px;
}
</style>
