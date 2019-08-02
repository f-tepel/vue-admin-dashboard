<template>
	<div>
		<span class="display-2">
			{{ text }}
		</span>
	</div>
</template>

<script>
const Chart = require('chart.js');

export default {
	data: function() {
		return {
			text: 'Hello World'
		}
	}
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
