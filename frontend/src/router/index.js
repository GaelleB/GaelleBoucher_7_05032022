import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Signup from '../views/SignupView.vue'
import Login from '../views/LoginView.vue'
import Account from '../views/AccountView.vue'
import FilActu from '../views/FilActuView.vue'
import Post from '../views/PostView.vue'
import NewPost from '../views/NewPostView.vue'
import ModifPost from '../views/ModifPostView.vue'

//Vue.use(VueRouter)  idem ligne45 main.js
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  
  {
    path: '/filactu',
    name: 'Allposts',
    component: FilActu
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: Post
  },
  
 {
    path: '/profile',
    name: 'Profile',
    component: Account
  },
  {
    path: '/postnew',
    name: 'NewPost',
    component: NewPost
  },
  
  {
    path: '/postmodify/:id',
    name: 'ModifPost',
    component: ModifPost
  }, 
  ]

/*const router = new VueRouter({
  routes
})
*/
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router