<template>
  <v-container fluid>
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :page="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar dark color="blue darken-3" class="mb-1">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="fa-search"
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              prepend-inner-icon="fa-search"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn large depressed color="blue" :value="false">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn large depressed color="blue" :value="true">
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col v-for="item in props.items" :key="item.nickname" cols="12" sm="6" md="4" lg="3">
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                <v-avatar>
                  <img :src="item.image" :alt="item.nickname" />
                </v-avatar>
                {{ item.nickname }}
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item>
                  <v-list-item-content>Id:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.id }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>Email:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.email }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="{ 'blue--text': sortBy === 'Epicname' }">Epicname:</v-list-item-content>
                  <v-list-item-content
                    class="align-end"
                    :class="{ 'blue--text': sortBy === 'Epicname' }"
                  >{{ item.epicname }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="{ 'blue--text': sortBy === 'Role' }">Role:</v-list-item-content>
                  <v-list-item-content
                    class="align-end"
                    :class="{ 'blue--text': sortBy === 'Role' }"
                  >
                    <v-chip
                      :color="item.role === 'admin' ? 'red' : item.role === 'user' ? 'green' : 'orange'"
                    >{{ item['role'] }}</v-chip>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-card-actions>
                <v-btn
                  text
                  color="deep-purple accent-4"
                  :disabled="item.role === 'admin'"
                  @click="makeAdmin(item.id)"
                >Make admin</v-btn>
                <v-btn text color="red" @click="deleteUser(item.id)">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn dark text color="primary" class="ml-2" v-on="on">
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-4 grey--text">Page {{ page }} of {{ numberOfPages }}</span>
          <v-btn fab dark color="blue darken-3" class="mr-1" @click="formerPage">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab dark color="blue darken-3" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import axios from "../../config/axios";
import roles from "../../enums/roles";
export default {
  data() {
    return {
      itemsPerPageArray: [4, 8, 12],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: "epicname",
      keys: ["Epicname", "Role"],
      items: []
    };
  },
  created() {
    this.getUsers();
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter(key => key !== `Name`);
    }
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    getUsers() {
      this.loading = true;
      axios
        .get("/users")
        .then(res => {
          this.loading = false;
          this.items = this.transformData(res.data);
        })
        .catch(error => {
          this.loading = false;
          this.$notify({
            group: "foo",
            type: "error",
            title: "GET error",
            text: `Could not get the data! ${error.message}.`
          });
        });
    },
    transformData(data) {
      let list = [];
      data.forEach(element => {
        list.push({
          id: element._id,
          nickname: element.nickname,
          epicname: element.epicname,
          email: element.email,
          image: element.image,
          role: roles[element.role]
        });
      });
      return list;
    },
    makeAdmin(id) {
      this.loading = true;
      axios
        .put(`/admin/user/${id}`)
        .then(() => {
          this.loading = false;
          this.$notify({
            group: "foo",
            type: "success",
            title: "Update success",
            text: "User updated successfully!"
          });
          this.getUsers();
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    deleteUser(id) {
      this.loading = true;
      axios
        .delete(`/admin/user/${id}`)
        .then(() => {
          this.loading = false;
          this.$notify({
            group: "foo",
            type: "success",
            title: "Delete success",
            text: "User deleted successfully!"
          });
          this.getUsers();
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
.v-chip {
  max-width: 65%;
  justify-content: center;
  transition: ease all 0.5s;
}
</style>