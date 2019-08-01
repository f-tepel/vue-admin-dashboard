<template>
	<div>
		<v-toolbar flat class="backgroundPrimary">
			<v-toolbar-title>
				{{collection}}
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn fab dark color="primary" :to="'/dashboard/' + collection">
				<v-icon>keyboard_backspace</v-icon>
			</v-btn>
		</v-toolbar>
		<br/>
		<v-card>
			<v-container>
				<form id="createForm" name="createForm">
					<v-text-field type="text" placeholder="Name" name="Name" id="Name" v-model="name"></v-text-field>
					<v-select
							v-model="selectedStrategyList"
							:items="strategyList"
							:menu-props="{ maxHeight: '400' }"
							label="Strategy"
							multiple
							hint="Pick the strategies you want to invest"
							persistent-hint
					></v-select>
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
export default {
  data: function() {
    return {
			name: '',
      selectedStrategyList: [],
      strategyList: [],
    }
  },
  props: ['collection'],
  methods: {
    getStrategies: function() {
			fetch('/api/strategies')
			.then(res => res.json())
			.then((res) => {
				if (res.code === 401) {
          location.href = '/auth/login'
        } else if (res.code >= 400) {
          alert(res.message)
        } else {
          res.data.forEach((strategy) => {
						this.strategyList.push(strategy.name)
					});
        }
			})
		},
    formatDate: function(date) {
      let d = new Date(date)
      let mm = d.getMonth() + 1
      let dd = d.getDate()
      return [(dd>9 ? '' : '0') + dd, (mm>9 ? '' : '0') + mm, d.getFullYear()].join('.')
    },
    saveOne: function() {
      const obj = {
				name: this.name,
				strategies: this.selectedStrategyList,
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
          location.href = '/Portfolios'
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
    this.getStrategies()
  },
  watch: {
    collection: function(val, oldVal) {
      this.getStrategies()
    }
  }
}
</script>
