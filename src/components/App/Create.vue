<template>
	<div>
		<v-toolbar flat class="backgroundPrimary">
			<v-toolbar-title>
				{{collection}}
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn fab dark color="primary" :to="collection">
				<v-icon>keyboard_backspace</v-icon>
			</v-btn>
		</v-toolbar>
		<br/>
		<v-card>
			<v-container>
				<form id="createForm" name="createForm">
					<v-text-field v-for="(value, key) in fields" :key="key" type="text" :placeholder="key" :name="key"></v-text-field>        
				</form>
			</v-container>
			<v-card-actions>
				<v-btn flat @click="saveOne()">Save</v-btn>
				<v-btn flat color="red" @click="cancel()">cancel</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
const config = require('./config.js')

export default {
  data: function() {
    return {
      fields: {},
    }
  },
  props: ['collection'],
  methods: {
    formatDate: function(date) {
      let d = new Date(date)
      let mm = d.getMonth() + 1
      let dd = d.getDate()
      return [(dd>9 ? '' : '0') + dd, (mm>9 ? '' : '0') + mm, d.getFullYear()].join('.')
    },
    getModel: function() {
      let self = this
      fetch('/api/' + self.collection + '/model')
      .then(res => res.json())
      .then((res) => {
        if (res.code === 401) {
          location.href = '/auth/login'
        } else if (res.code >= 400) {
          alert(res.message)
        } else {
          self.fields = res.data
        }
      })
    },
    saveOne: function() {
      const inputList = document.forms['createForm'].getElementsByTagName('input');
      const obj = {}
      for (let i = 0; i < inputList.length; i++) {
        const element = inputList[i];
        obj[element.name] = element.value
      }

      fetch('/api/' + this.collection, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then((res) => {
        if (res.code === 401) {
          location.href = '/auth/login'
        } else if (res.code >= 400) {
          alert(res.message)
        } else {
          location.reload()
        }
      })
      .catch((err) => {
        location.href = '/auth/login'
      })
    },
    cancel: function() {
			window.location.href = '/dashboard/' + this.collection
    }
  },
  beforeMount: function() {
    this.getModel()
  },
  watch: {
    collection: function(val, oldVal) {
      this.getModel()
    }
  }
}
</script>

<style>

</style>
