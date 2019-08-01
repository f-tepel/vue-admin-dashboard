<template>
  <div>
    <v-card>
			<v-card-title primary-title>
				<div>
					<div class="headline text-left text-uppercase">{{collection}}</div>
					<div class="grey--text text-uppercase text-left">{{id}}</div>
					<div class="grey--text text-uppercase text-left">{{this.formatDate(item.created)}}</div>
				</div>
			</v-card-title>
			<div v-for="(value, key) in item" :key="key">
				<v-card-text v-if="(!(key == '_id' || key == 'created')) && isString(key)">
					<v-text-field
						:label="key"
						:value="value"
						type="string"
						v-model="item[key]"
					></v-text-field>
				</v-card-text>
				<v-card-text v-if="(!(key == '_id' || key == 'created')) && isNumber(key)">
					<v-text-field
						:label="key"
						:value="value"
						v-model.number="item[key]"
					></v-text-field>
				</v-card-text>
				<v-card-text v-if="(!(key == '_id' || key == 'created')) && isBoolean(key)">
					<v-checkbox
						v-model="item[key]"
						:label="key"
					></v-checkbox>
				</v-card-text>
				<v-card-text v-if="(!(key == '_id' || key == 'created')) && isArray(key)">
					<v-text-field
						:label="key"
						:value="value"
						type="string"
						v-model="item[key]"
					></v-text-field>
				</v-card-text>
			</div>
	    <v-card-actions>
        <v-btn flat :to="'/dashboard/' + collection">Back</v-btn>
				<v-btn flat @click="updateOne()">Update</v-btn>
        <v-btn flat color="red" @click="deleteOne()">Delete</v-btn>
	    </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
	data: function() {
		return {
			item: {},
			_id: '',
			created: '',
		}
	},
	props: ['collection', 'id'],
	methods: {
		getData: function () {
			const self = this
			fetch('/api/' + self.collection + '/' + self.id)
			.then(res => res.json())
			.then((res) => {
				  if (res.code === 401) {
            location.href = '/auth/login'
          } else if (res.code >= 400) {
            alert(res.message)
          } else {
						this.item = res.data
          }
			})
			.catch((err) => {
				console.log(err)
			})
		},
		deleteOne: function() {
			const self = this
			if(confirm('Do you really want to delete this document?')) {
				fetch('/api/' + self.collection + '/' + self.id, {
					method: 'DELETE'
				})
				.then(res => res.json())
				.then((res) => {
					if (res.code === 401) {
            location.href = '/auth/login'
          } else if (res.code >= 400) {
            alert(res.message)
          } else {
						window.location.href = '/dashboard/' + self.collection
          }
				})
				.catch((err) => {
					alert('Error deleting document: ' + err)
				})
			}
		},
		updateOne: function() {
			const self = this
			fetch('/api/' + self.collection + '/' + self.id, {
				method: 'PUT',
				headers: {
            "Content-Type": "application/json",
        },
				body: JSON.stringify(self.item)
			})
			.then(res => res.json())
			.then((res) => {
				if (res.code === 401) {
					location.href = '/auth/login'
				} else if (res.code >= 400) {
					alert(res.message)
				} else {
					window.location.reload()
				}
			})
			.catch((err) => {
				alert('Error updating document: ' + err)
			})
		},
		createDoucment: function() {
			
		},
		formatDate: function(date) {
      let d = new Date(date)
      let mm = d.getMonth() + 1
      let dd = d.getDate()
      return [(dd>9 ? '' : '0') + dd, (mm>9 ? '' : '0') + mm, d.getFullYear()].join('.')
		},
		isString: function(key) {
			return (typeof this.item[key] === 'string') ? true : false
		},
		isNumber: function(key) {
			return (typeof this.item[key] === 'number') ? true : false
		},
		isBoolean: function(key) {
			return (typeof this.item[key] === 'boolean') ? true : false
		},
		isArray: function(key) {
			return (typeof this.item[key] === 'object') ? true : false
		}
	},
	mounted: function() {
		this.getData();
	},
	watch: {
    collection: function(val, oldVal) {
      this.getData()
		},
		id: function(val, oldVal) {
		   this.getData()
    }
  }
}
</script>

