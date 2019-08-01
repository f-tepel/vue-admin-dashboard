<template>
<v-app id="inspire">
  <v-navigation-drawer
    fixed
    v-model="drawer"
    app
  >
    <v-list dense>
      <v-list-tile :to="'/dashboard'" @click="drawer = !drawer">
        <v-list-tile-content>
          <v-list-tile-title>Dashboard</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <template v-for="name in objects">
        <v-list-tile :to="'/dashboard/' + name" :key="name + '-tile'" @click="drawer = !drawer">
          <v-list-tile-content>
            <v-list-tile-title>{{ name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider :inset="true" :key="name + '-divider'"/>
      </template>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar color="#102027" dark fixed app>
    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title>FTI - Algorithms</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn flat @click="logout()">Logout</v-btn>
</v-toolbar>
  <v-content>
    <v-container fluid fill-height>
      <v-layout
        justify-center
        align-center
      >
        <v-flex text-xs-center>
          <router-view/>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
  <v-footer color="#102027" app inset>
    <span class="white--text">&copy; 2019 - FTI Algorithms</span>
  </v-footer>
</v-app>
</template>

<script>
  export default {
    name: 'App',
    components: {
    },
    data () {
      return {
        drawer: false,
        objects: ['Assets', 'Portfolios', 'Strategies', 'PortfolioValues', 'Trades', 'Keys', 'Files']
      }
    },
    methods: {
      logout: function() {
        fetch('/api/user/logout', {
          method: 'DELETE'
        })
        .then(res => res.json())
        .then((res) => {
          if (res.code === 401) {
            location.href = '/auth/login'
          } else if (res.code >= 400) {
            alert(res.message)
          } else {
            window.location = '/auth/login'
          }
        })
        .catch(() => {
          alert('Logout was not successfull!')
        })
      }
    }
  }
</script>

<style>
  body {
    background: #F5F5F6;
  }
</style>
