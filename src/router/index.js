import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard'
import ChatOld from '@/views/ChatOld'
import Chat from '@/views/Chat'
import Login from '@/views/Login'
import Settings from '@/views/Settings'
import Register from '@/views/Register'

import Contacts from '@/views/Contacts'
import SearchContacts from '@/views/SearchContacts'
import AddContact from '@/views/AddContact'
// import EditContact from '@/views/EditContact'
import EditPost from '@/views/EditPost'

import firebase from 'firebase';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {                   // route guard
      auth: true,
    },
  },
  {
    path: '/chats',
    name: 'Chats',
    component: Chat,
    meta: {                   // route guard
      auth: true,
    },
  },
  {
    path: '/chat/:key',
    name: 'Chat',
    component: ChatOld,
    meta: {                   // route guard
      auth: true,
    },
  },
  // {
  //   path: '/chat',
  //   name: 'Chat',
  //   component: Chat,
  //   meta: {                   // route guard
  //     // auth: true,
  //   },
  // },
  {
    path: '/contacts/list',
    name: 'Contacts',
    component: Contacts,
    meta: {                   // route guard
      auth: true,
    },
  },
  {
    path: '/search-contacts',
    name: 'SearchContacts',
    component: SearchContacts,
    meta: {                   // route guard
      auth: true,
    }
  },
  {
    path: '/contacts',
    name: 'AddContact',
    component: AddContact,
    meta: {                   // route guard
      auth: true,
    }
  },
  // {
  //   path: '/contacts/edit/:id',
  //   name: 'EditContact',
  //   component: EditContact
  // },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/posts/edit/:key',
    name: 'EditPost',
    component: EditPost
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// check to see if the route requires authentication 
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
      // if (firebase.auth().currentUser) {
      //     next();
      // } else {
      //     alert('You must be logged in to see this page');
      //     next({
      //         path: '/',
      //     });
      // }
      firebase.auth().onAuthStateChanged( (user) => {
        if (user) {
          next();
        } else {
          alert('You must be logged in to see this page');
          next({
              path: '/',
          });
        }
      });
  } else {
      next();
  }
});

// router.beforeEach((to, from, next) => {

//   firebase.auth().onAuthStateChanged(userAuth => {
    
//     if (userAuth) {
//       firebase.auth().currentUser.getIdTokenResult()
//       .then(function(){
//         return next({ path: '/'});
//       })
//       // .then(function ({
//       //   claims
//       // }) {

//       //   if (claims.customer) {
//       //     if (to.path !== '/customer')
//       //       return next({
//       //         path: '/customer',
//       //       })
//       //   } else if (claims.admin) {
//       //     if (to.path !== '/admin')
//       //       return next({
//       //         path: '/admin',
//       //       })
//       //   } else if (claims.driver) {
//       //     if (to.path !== '/driver')
//       //       return next({
//       //         path: '/driver',
//       //       })
//       //   }

//       // })
//     } else {
//       if (to.matched.some(record => record.meta.auth)) {
//         next({
//           path: '/login',
//           query: {
//             redirect: to.fullPath
//           }
//         })
//       } else {
//         next()
//       }
//     }
//   })

//   next()

// })



export default router
