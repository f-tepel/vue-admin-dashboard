<template>
    <v-app id="inspire">
        <v-content class="page">
            <v-container>
                <header class="text-xs-right">
                    <a class="mx-3 white--text link" href="/auth/login">LOGIN</a>
                    <a class="mx-3 white--text link" href="/auth/register">REGISTER</a>
                </header>
                <div class="display-3 text-xs-center heading white--text">
                    FTI - ALGORITHMS
                </div>
                <br/>
                <v-card class="mb-2" v-for="asset in assets" :key="asset._id">
                    <v-container class="d-flex">
                        <strong class="info-item">{{asset.name}}</strong>
                        <strong class="info-item">{{asset.date}}</strong>
                        <strong class="info-item">{{asset.price}}</strong>
                        <strong class="info-item">{{asset.action}}</strong>
                    </v-container>
                </v-card>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
  export default {
    data: () => {
        return {
            assets: null
        }
    },
    methods: {
        getData: function() {
            fetch('/api/assets/data')
            .then(res => res.json())
            .then((res) => {
                console.log(JSON.stringify(res))
                this.assets = res.data
            })
        }
    },
    mounted: function() {
        this.getData()
    }
  }
</script>

<style>
.page {
    background: #102027;
}
.info-item {
    width: 25%;
    text-align: center;
}
.heading {
    font-weight: 100;
}
.link {
    text-decoration: none;
    letter-spacing: 0.1em;
}

.link:hover {
    text-decoration: underline;
}
</style>
