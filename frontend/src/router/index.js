import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/HomeView.vue'
import Signup from '../views/SignupView.vue'
import Login from '../views/LoginView.vue'
import Profile from '../views/ProfileView.vue'
import Allposts from '../views/AllPosts.vue'
import Post from '../views/PostView.vue'
import NewPost from '../views/NewPost.vue'
import ModifyPost from '../views/ModifyPost.vue'

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
    path: '/allposts',
    name: 'Allposts',
    component: Allposts
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: Post
  },
  
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/postnew',
    name: 'NewPost',
    component: NewPost
  },
  
  {
    path: '/postmodify/:id',
    name: 'ModifyPost',
    component: ModifyPost
  }, 
  ]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router