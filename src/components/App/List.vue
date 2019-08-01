<template>
<div>
  <v-toolbar flat class="backgroundPrimary">
    <v-toolbar-title>
      {{collection}}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn fab dark color="primary" :to="collection + '/create'">
      <v-icon>add</v-icon>
    </v-btn>
  </v-toolbar>
  <br/>
  <v-card>
    <template v-for="item in itemList">
      <v-card-title :key="item.name">
        <div>
          <div class="text-left" v-for="config in listConfig" :key="config.name">
            <div v-if="config.type === 'string'">
              {{item[config.name]}}
            </div>
            <div v-if="config.type === 'date'">
              {{formatDate(item[config.name])}}
            </div>
            <div v-if="config.type === 'number'">
              {{item[config.name]}}
            </div>
          </div>
        </div>
        <v-spacer/>
        <v-btn color="info" :to="'/dashboard/' + collection + '/' + item._id">Details</v-btn>
      </v-card-title>
      <v-divider :key="item.name + '-divider'"/>
    </template>
  </v-card>
</div>
</template>

<script>
const config = require('./config.js')

export default {
  data: function() {
    return {
      itemList: [],
      listConfig: [],
    }
  },
  props: ['collection'],
  methods: {
    getData: function() {
      const self = this
      fetch('/api/' + self.collection)
      .then(res => res.json())
      .then((res) => {
        if (res.code === 401) {
          location.href = '/auth/login'
        } else if (res.code >= 400) {
          alert(res.message)
        } else {
          this.itemList = res.data
          this.listConfig = config.getListConfig(self.collection.toLowerCase())
        }
      })
      .catch((err) => {
        window.location.href = '/auth/login'
      })
    },
    formatDate: function(date) {
      let d = new Date(date)
      let mm = d.getMonth() + 1
      let dd = d.getDate()
      return [(dd>9 ? '' : '0') + dd, (mm>9 ? '' : '0') + mm, d.getFullYear()].join('.')
    },
  },
  beforeMount: function() {
    this.getData()
  },
  watch: {
    collection: function(val, oldVal) {
      this.getData()
    }
  }
}
</script>

<style>
.text-left {
  text-align: left;
}
.backgroundPrimary {
  background: #fafafa!important;
}
</style>


