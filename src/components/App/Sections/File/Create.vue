<template>
<div>
  <v-toolbar flat class="backgroundPrimary">
    <v-toolbar-title>
      Files
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn fab dark color="primary" :to="'/dashboard/' + collection">
      <v-icon>keyboard_backspace</v-icon>
    </v-btn>
  </v-toolbar>
  <br/>
  <v-card>
    <v-form v-show="!uploadOn" encType="multipart/form-data" ref="uploadForm" id="uploadForm" onsubmit="return false" >
      <v-container class="form-group" v-show="fristStep">
        <input type="file" class="form-control-file file-select" name="indice" id="indice">
        <br>
        <v-text-field class="form-control" type="text" placeholder="Name" name="name" id="name"></v-text-field>
        <br>
        <v-text-field class="form-control" type="text" placeholder="Symbol" name="symbol" id="symbol"></v-text-field>
        <br>
        <v-text-field class="form-control" type="text" placeholder="Link" name="url" id="url"></v-text-field>
        <br>
        <v-select label="Select a region" name="region" id="region" :items="regionList" v-model="region">
        </v-select>
        <br>
        <v-text-field class="form-control" type="text" placeholder="Industry" name="industry" id="industry"></v-text-field>
        <br>
        <v-select label="Do you care about the number of trades?" class="custom-select" name="trades" id="trades" :items="['care', 'maximize']" v-model="trades">
        </v-select>
        <br><br>
        <v-btn v-on:click="fristStep = false" class="btn btn-primary">Next</v-btn>
      </v-container>
      <v-container class="form-group m-5" v-show="!fristStep">
        <label class="input-group-text" for="inputGroupSelect01">Split lines by</label>
        <v-select @change="showColumn = true" class="custom-select" name="line" id="line" label="Select a value" :items="linebreakers" v-model="line">
        </v-select>
        <br>
        <div v-if="showColumn" class="input-group mb-3">
          <div class="input-group-prepend">
          <label class="input-group-text" for="inputGroupSelect01">Split columns by</label>
          </div>
          <v-select @change="mapping()" class="custom-select" name="column" id="column" :items="columnbreakers" v-model="column">
          </v-select>
        </div>
        <br>
        <div v-if="showMapping">
          <p class="text-left">
          <strong>Columns in File</strong>
          </p>
          <div class="d-flex justify-content-around row">
          <div v-for="value in values" :key="value" class="m-1">
            {{ value }}
          </div>
          </div>
          <br>
          <p class="text-left">
          <strong>Type the name of the field in the input sothat they can be mapped</strong>
          </p>
          <v-text-field class="form-control" label="Date" type="text" placeholder="Enter column name" name="date" id="date"></v-text-field>
          <v-text-field class="form-control" label="Price" type="text" placeholder="Enter column name" name="price" id="price"></v-text-field>
        </div>
        <br>
        <v-btn @click="fristStep = true" class="btn btn-primary">Back</v-btn>
        <v-btn @click="upload()" class="btn btn-primary">Upload</v-btn>
      </v-container>
    </v-form>
  </v-card>
</div>
</template>

<script>

export default {
  data: function() {
    return {
			uploadOn: false,
			fristStep: true,
			regionList: [],
			showColumn: false,
			showMapping: false,
			values: [],
			linebreakers: ['\\n', ';', '|', ','],
      columnbreakers: [';', '|', ','],
      trades: null,
      region: null,
      column: null,
      line: null,
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
    mapping: function () {
			this.showMapping = true
			let file = document.getElementById('indice').files[0]
			let line = this.line
      let column = this.column

			let reader = new FileReader()

			reader.onload = (e) => {
				this.values = []

				if (line === '\\n') {
					line = e.target.result.split('\n')[0]
				} else if (line === ';') {
					line = e.target.result.split(';')[0]
				} else if (line === '|') {
					line = e.target.result.split('|')[0]
				} else if (line === ',') {
					line = e.target.result.split(',')[0]
				}

				if (column === ';') {
					column = line.split(';')
				} else if (column === ',') {
					column = line.split(',')
				} else if (column === '|') {
					column = line.split('|')
				}

				column.forEach(val => {
					if (val.length > 15) {
						this.values.push('too large')
					} else {
						this.values.push(val)
					}
				})
			}
			reader.readAsText(file)
		},
		upload: function () {
      let formData = new FormData($('#uploadForm')[0])
      formData.append('region', this.region)
      formData.append('trades', this.trades)
      formData.append('line', this.line)
      formData.append('column', this.column)

			$.ajax({
				type: 'POST',
				url: '/api/files',
				crossDomain: true,
				data: formData,
				cache: false,
				contentType: false,
				enctype: 'multipart/form-data',
				processData: false,
				headers: {
					'x-auth': this.xAuth
				},
				success: function (res) {
          location.href = '/dashboard/' + this.collection 
        },
				error: (err) => {
					window.location.href = '/auth/login'
				}
			})
			this.uploadOn = true
    },
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
            this.regionList.push(strategy.shortName)
          })
        }
      })
    },
  },
  beforeMount: function() {
    this.getStrategies()
  },
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