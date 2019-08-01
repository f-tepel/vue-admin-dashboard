<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="#102027">
                <v-toolbar-title>Register</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" name="email" label="Email" type="text" v-model="email"></v-text-field>
                  <v-text-field prepend-icon="lock" name="password" label="Password" id="password" type="password" v-model="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#102027" class="white--text" @click="register()">Register</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
	components: {
	},
	data () {
		return {
			email: '',
			password: ''
		}
	},
	methods: {
		register: function() {
      
      fetch('/api/user/register', {
        method: 'POST',
        body: JSON.stringify({
          email: this.email,
          password: this.password
        }),
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
          window.location = '/dashboard'
        }
      })
		}
	}
}
</script>
