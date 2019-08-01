import Vue from 'vue'
import Router from 'vue-router'
import Overview from './views/Overview.vue'
import Auth from './views/Auth.vue'
import App from './views/App.vue'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import List from './components/App/List'
import Detail from './components/App/Detail'
import Dashboard from './components/App/Dashboard'
import File from './components/App/Sections/File/File'
import Create from './components/App/Create'
import FileCreate from './components/App/Sections/File/Create'
import PortfolioCreate from './components/App/Sections/Portfolio/Create'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'overview',
      component: Overview,
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
      children: [
        {
          path: 'login',
          component: Login
        },
        {
          path: 'register',
          component: Register
        }
      ]
    },
    {
      path: '/dashboard',
      name: 'app',
      component: App,
      children: [
        {
          path: '',
          component: Dashboard
        },
        {
          path: 'files',
          component: File,
        },
        {
          path: ':collection',
          component: List,
          props: route => ({
            collection: route.params.collection
          })
        },
        {
          path: 'files/create',
          component: FileCreate,
          props: route => ({
            collection: 'Files'
          })
        },
        {
          path: 'assets/create',
          component: FileCreate,
          props: route => ({
            collection: 'Assets'
          })
        },
        {
          path: 'portfolios/create',
          component: PortfolioCreate,
          props: route => ({
            collection: 'Portfolios'
          })
        },
        {
          path: ':collection/create',
          component: Create,
          props: route => ({
            collection: route.params.collection
          })
        },
        {
          path: ':collection/:id',
          component: Detail,
          props: route => ({
            collection: route.params.collection,
            id: route.params.id
          })
        }
      ]
    }
  ]
})
