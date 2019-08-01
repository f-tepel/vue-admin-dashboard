<template>
	<div>
		<v-toolbar flat class="backgroundPrimary">
			<v-toolbar-title>
				{{portfolio.name}}
			</v-toolbar-title>
			<v-spacer></v-spacer>
		</v-toolbar>
		<v-layout row>
			<v-flex pa-1 xs12>
				<v-card>
					<div class="select-container">
						<v-select label="Select a asset" 
							:items="assetListChart" 
							v-model="assetForChart"
							item-text="name"
							item-value="_id"
							:change="getAsset()">
       	 				</v-select>
					</div>   
					<canvas class="chart" id="lineChart" height="400"></canvas>
					<v-container d-flex justify-space-between>
						<div dark small id="time-1" @click="timeFrameHandler('time-1', assetForChart, '1M')" class="dateBtn pa-1">1M</div>
						<div dark small id="time-2" @click="timeFrameHandler('time-2', assetForChart, '6M')" class="dateBtn pa-1">6M</div>
						<div dark small id="time-3" @click="timeFrameHandler('time-3', assetForChart, '1J')" class="dateBtn pa-1">1J</div>
						<div dark small id="time-4" @click="timeFrameHandler('time-4', assetForChart, '5J')" class="dateBtn primary white--text pa-1">5J</div>
						<div dark small id="time-5" @click="timeFrameHandler('time-5', assetForChart, 'MAX')" class="dateBtn pa-1">MAX</div>
					</v-container>
				</v-card>
			</v-flex>
		</v-layout>
		<v-layout>
			<v-flex d-flex pa-1 xs12>
				<v-card>
					<v-container>
						<div class="subheading text-left">
							Actions:
						</div>
						<v-btn @click="tradePortfolio(portfolio._id)">
							Trade portfolio
						</v-btn>
						<v-btn :to="'/dashboard/portfolios/' + portfolio._id">
							Edit portfolio
						</v-btn>
						<v-btn @click="testAuth(portfolio._id)">
							Test Authentication
						</v-btn>
						<v-btn @click="calcAssets()">
							Get All Assets
						</v-btn>
						<v-btn @click="getPerformanceReport()">
							Performance Report
						</v-btn>
					</v-container>
				</v-card>
			</v-flex>
		</v-layout>
		<v-layout v-if="infotext.length > 0">
			<v-flex pa-1 xs12>
				<v-alert
					:value="true"
					type="info"
				>
					{{infotext}}
				</v-alert>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex pa-1>
				<v-card>
					<div>
						<div class="subheading text-left pa-2">
							Invested Assets:
						</div>
						<div v-for="asset in assetList" :key="asset._id" class="ma-2">
							<v-layout align-center row>
								<div>
									{{asset.name}}
								</div>
								<v-spacer></v-spacer>
								<v-btn :to="'/dashboard/assets/' + asset._id">Details</v-btn>
								<v-btn @click="subscribe(asset._id)">Subscribe</v-btn>
							</v-layout>
							<v-divider/>
						</div>
					</div>
				</v-card>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex pa-1>
				<v-card>
					<div>
						<div class="subheading text-left pa-2">
							Recent Trades:
						</div>
						<div v-for="trade in tradeList" :key="trade._id" class="ma-2">
							<v-layout align-center row>
								<div>
									{{trade.symbol}}
								</div>
								<v-spacer/>
								<div>
									{{trade.amount}}
								</div>
								<v-spacer/>
								<div>
									{{trade.created}}
								</div>
								<v-spacer/>
								<v-btn :to="'/dashboard/trades/' + trade._id">Details</v-btn>
							</v-layout>
							<v-divider/>
						</div>
					</div>
				</v-card>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex pa-1>
				<v-card>
					<div>
						<div class="subheading text-left pa-2">
							Selected Strategies:
						</div>
						<div v-for="strategy in strategyList" :key="strategy._id" class="ma-2">
							<v-layout align-center row>
								<div>
									{{strategy.name}}
								</div>
								<v-spacer></v-spacer>
								<v-btn :to="'/dashboard/strategies/' + strategy._id">Details</v-btn>
								<v-btn @click="getAssetForStrategy(strategy._id)">Get Asset</v-btn>
							</v-layout>
							<v-divider/>
						</div>
					</div>
				</v-card>
			</v-flex>
		</v-layout>
	</div>
</template>

<script>
const Chart = require('chart.js');

export default {
	data: function() {
			return {
				portfolio: null,
				assetList: [],
				assetListChart: null,
				tradeList: [],
				strategyList: [],
				infotext: '',
				assetForChart: '',
			}
	},
	methods: {
		getPortfolio: function() {
			fetch('/api/portfolios')
			.then(res => res.json())
			.then((res) => {
				if (res.code === 401) {
					location.href = '/auth/login'
				} else if (res.code >= 400) {
					alert(res.message)
				} else {
					this.portfolio = res.data[0]
					this.getAssetList(this.portfolio._id)
					this.getTradeList(this.portfolio._id)
				}
			})	
			.catch((err) => {
				// location.href = '/auth/login'
			})
		},
		getAssetList: function(id) {
			fetch('/api/portfolios/' + id + '/assets')
			.then(res => res.json())
			.then((res) => {
				if (res.code === 401) {
					location.href = '/auth/login'
				} else if (res.code >= 400) {
					alert(res.message)
				} else {
					this.assetList = res.data
					this.assetListChart = res.data.slice()
					this.assetListChart.push({
						name: 'Portfolio',
						_id: 'portfolio',
					})
					this.getAsset('portfolio')
				}		
			})
			.catch((err) => {
				// location.href = '/auth/login'
			})
		},
		getTradeList: function(id) {
			fetch('/api/portfolios/' + id + '/trades')
			.then(res => res.json())
			.then((res) => {
				if (res.code === 401) {
					location.href = '/auth/login'
				} else if (res.code >= 400) {
					this.tradeList = []
				} else {
					this.tradeList = res.data
				}
			})
			.catch((err) => {
				// location.href = '/auth/login'
			})
		},
		getStrategyList: function() {
			fetch('/api/strategies')
			.then(res => res.json())
			.then((res) => {
				if (res.code === 401) {
					location.href = '/auth/login'
				} else if (res.code >= 400) {
					alert(res.message)
					this.strategyList = []
				} else {
					this.strategyList = res.data
				}
			})
		},
		getAssetForStrategy: (id) => {
			fetch('/api/strategies/' + id + '/calculate')
			.then(res => res.json())
			.then((res) => {
				if (res.code === 401) {
					location.href = '/auth/login'
				} else if (res.code >= 400) {
					alert(res.message)
				} else {
					alert(JSON.stringify(res.data))
				}
			})
			.catch((err) => {
				console.log(err)
			})
		},
		getAsset: function(id, timeFrame) {
			if (id === undefined) id = this.assetForChart
			if (id === '') return;

			const from = new Date()
			let until = new Date()
			
			if(timeFrame === '1M') {
				until.setMonth(from.getMonth() - 1)
			} else if(timeFrame === '6M') {
				until.setMonth(from.getMonth() - 6)
			} else if(timeFrame === '1J') {
				until.setFullYear(from.getFullYear() - 1)
			} else if(timeFrame === '5J') {
				until.setFullYear(from.getFullYear() - 5)
			} else if(timeFrame === 'MAX') {
				until.setFullYear(from.getFullYear() - 30)
			} else {
				until.setFullYear(from.getFullYear() - 5)
			}

			const query = '?from=' + from.toString() + '&to=' + until.toString()


			if (id === 'portfolio') {
				const self = this
				fetch('/api/portfolios/' + self.portfolio._id + '/values' + query)
				.then(res => res.json())
				.then((res) => {
					if (res.code === 401) {
						location.href = '/auth/login'
					} else if (res.code >= 400) {
						alert(res.message)
					} else {
						const dateList = []
						const valueList = []

						for (const portfolioValue of res.data) {
							dateList.push(this.formatDate(portfolioValue.created))
							valueList.push(portfolioValue.value)
						}

						let ctx = document.getElementById('lineChart').getContext('2d');
						let myLineChart = new Chart(ctx, {
							type: 'line',
							data: {
								labels: dateList,
								datasets: [
									{
										label: 'Portfoliovalue',
										data: valueList,
										fill: false,
										borderColor: 'rgb(66, 134, 244)'
									},
								]
							},
							options: {
								elements: {
									line: {
										tension: 0 // disables bezier curves
									},
									showLines: false,
									animation: {
										duration: 0 // general animation time
									},
									hover: {
										animationDuration: 0 // duration of animations when hovering an item
									},
									responsiveAnimationDuration: 0 // animation duration after a resize
								}
							}
						})
					}
				})
			} else {
				fetch('/api/assets/' + id + '/data' + query)
				.then(res => res.json())
				.then((res) => {
					if (res.code === 401) {
						location.href = '/auth/login'
					} else if (res.code >= 400) {
						alert(res.message)
					} else {
						const assetValueList = res.data.assetValue
						const dateList = []
						const priceList = []
						const boostPriceList = []
						const shortingPriceList = []

						for (let i = 0; i < assetValueList.length; i++) {
							const assetValue = assetValueList[i];
							priceList.push(assetValue.price)
							dateList.push(assetValue.date)
							boostPriceList.push(assetValue.boostPrice)
							shortingPriceList.push(assetValue.priceWithShorting)
						}
				
						let ctx = document.getElementById('lineChart').getContext('2d');
						let myLineChart = new Chart(ctx, {
							type: 'line',
							data: {
								labels: dateList,
								datasets: [
									{
										label: 'Marketprice',
										data: priceList,
										fill: false,
										borderColor: 'rgb(66, 134, 244)'
									},
									{
										label: 'Boostprice',
										data: boostPriceList,
										fill: false,
										borderColor: 'rgb(219, 83, 41)'
									},
									{
										label: 'Price With Shorting',
										data: shortingPriceList,
										fill: false,
										borderColor: 'rgb(216, 210, 36)'
									}
								]
							},
							options: {
								elements: {
									line: {
										tension: 0 // disables bezier curves
									},
									showLines: false,
									animation: {
										duration: 0 // general animation time
									},
									hover: {
										animationDuration: 0 // duration of animations when hovering an item
									},
									responsiveAnimationDuration: 0 // animation duration after a resize
								}
							}
						})
					}
				})
			}
		},
		tradePortfolio: (id) => {
			if(confirm('Do you really want to trade the portfolio?')) {
				fetch('/api/portfolios/' + id + '/executetrade')
				.then(res => res.json())
				.then((res) => {
					if (res.code === 401) {
						location.href = '/auth/login'
					} else if (res.code >= 400) {
						alert(res.message)
					} else {
						alert('Portfolio traded successfully')
					}
				})
				.catch((data) => {
					alert('Error:' + data)
				})
			}
		},
		testAuth: function(id) {
			fetch('/api/keys/fxcm/test')
			.then(res => res.json())
			.then((res) => {
				if (res.code === 401) {
					location.href = '/auth/login'
				} else if (res.code >= 400) {
					alert(res.message)
				} else {
					this.infotext = res.message
				}
			})
			.catch((err) => {
				console.log(3)
				alert('Error: ' + err)
			})
		},
		calcAssets: function() {
			fetch('/api/strategies/calculate')
			.then(res => res.json())
			.then((res) => {
				if (res.code === 401) {
					location.href = '/auth/login'
				} else if (res.code >= 400) {
					alert(res.message)
				} else {
					alert('Calculation successfull ' + res.message)
				}
			})
			.catch((err) => {
				alert('Error: ' + err)
			})
		},
		getPerformanceReport: function() {
			fetch('/api/assets/performance')
			.then(res => res.json())
			.then((res) => {
				if (res.code === 401) {
					location.href = '/auth/login'
				} else if (res.code >= 400) {
					alert(res.message)
				} else {
					let data = res.data
					let result = ""
					for (const key in data) {
						const normal = parseFloat(data[key].normal).toFixed(2)
						const boost = parseFloat(data[key].boost).toFixed(2)
						const shorting = parseFloat(data[key].shorting).toFixed(2)

						result += key + ": normal = " + normal + " || boost = " + boost + " || shorting = " + shorting + "\n"
					}
					this.infotext = result
				}
			})
		},
		subscribe: function(assetId) {
			fetch('/api/assets/' + assetId + '/subscribe')
			.then(res => res.json())
			.then((res) => {
				if (res.code === 401) {
					location.href = '/auth/login'
				} else if (res.code >= 400) {
					alert(res.message)
				} else {
					this.infotext = res.message
				}
			})
			.catch((err) => {
				alert(err)
			})
		},
		timeFrameHandler: function(elementId, id, timeFrame) {
			this.getAsset(id, timeFrame)
			document.getElementById(elementId).classList.add('primary', 'white--text')

			for (let i = 1; i < 6; i++) {
				const dynamicId = 'time-' + i

				if (elementId !== dynamicId) {
					document.getElementById(dynamicId).classList.remove('primary', 'white--text')
				}
			}
		},
		formatDate: function(date) {
			let d = new Date(date)
			let mm = d.getMonth() + 1
			let dd = d.getDate()
			return [(dd>9 ? '' : '0') + dd, (mm>9 ? '' : '0') + mm, d.getFullYear()].join('.')
		},
	},
	beforeMount () {
		this.getPortfolio()
		this.getStrategyList()
	},
}
</script>

<style scoped>
.chart {
	max-height: 90vh;
}
.select-container {
	padding: 1em;
}
.dateBtn {
	cursor: pointer;
}
.dateBtn:hover {
	background: lightgray;
} 
</style>
