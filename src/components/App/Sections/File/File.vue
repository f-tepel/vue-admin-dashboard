<template>
<div>
  <v-toolbar flat class="backgroundPrimary">
    <v-toolbar-title>
      Files
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn fab dark color="primary" :to="'/dashboard/files/create'">
      <v-icon>add</v-icon>
    </v-btn>
  </v-toolbar>
  <br/>
  <v-card>
    <template v-for="item in itemList">
      <v-card-title :key="item">
          <div class="text-left">
              {{ item }}
          </div>
        <v-spacer/>
        <v-btn color="info" @click="downloadCSV(item)">Donwload</v-btn>
        <v-btn color="error" @click="remove(item)">Delete</v-btn>
      	<a href="" :id="item" class="hidden"></a>
      </v-card-title>
      <v-divider :key="item + '-divider'"/>
    </template>
  </v-card>
</div>
</template>

<script>

export default {
  data: function() {
    return {
      itemList: [],
      listConfig: [],
    }
  },
  methods: {
    getData: function() {
      const self = this
      fetch('/api/files')
      .then(res => res.json())
      .then((res) => {
        if (res.code === 401) {
          location.href = '/auth/login'
        } else if (res.code >= 400) {
          alert(res.message)
        } else {
          res.data.forEach(el => {
            this.itemList.push(el)
          })
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
    downloadCSV: (item) => {
      fetch('/api/files/' + item, {
        headers: {
          credentials: 'same-origin',
        }
      })
      .then(res => {
        return res.blob();
      })
      .then(blob => {
          const href = window.URL.createObjectURL(blob);
          const a = document.getElementById(item)
          a.download = item;
          a.href = href;
          a.click();
      })
      .catch((err) => {
        location.href = '/auth/login'
      });
    },
		remove: (indice) => {
			if (confirm('Do you really want to delete the csv file?')) {
        fetch('/api/files/' + indice,{
          method: 'DELETE'
        })
        .then(res => res.json())
        .then((res) => {
          if (res.code === 401) {
            location.href = '/auth/login'
          } else if (res.code >= 400) {
            alert(res.message)
          } else {
            alert(res.message)
            location.reload()
          }
        })
        .catch(() => {
          location.href = '/auth/login'
        })
			} else {
				return null
			}
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
.file-select {
  width: 100%;
}
</style>