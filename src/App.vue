<template>
<div id="nav">
    <router-link to="/dashboard"> Dashboard </router-link> 
    <router-link to="/chats"> Chats </router-link> 
    <router-link to="/contacts/list"> Contacts </router-link> 
    <!-- <router-link to="/chat">Chat</router-link> | -->
    <a href="#" @click="logout"> Logout </a> |


    <router-link to="/"> Login </router-link> 
    <router-link to="/register" > Register </router-link> 
</div>

  <notification-box />

  <router-view />
  
</template>

<script>
import firebase from 'firebase';
import { useRouter } from "vue-router";
import { reactive } from 'vue';
import NotificationBox from '@/components/NotificationBox.vue';

// import { insertDB } from '@/libs/';
// import _database from '@/libs/';

export default {
    components: {
        NotificationBox,
    }, 
    setup(){
      const state = reactive({
        isLoggedIn: false,
      });
      
      const router = useRouter();

      // const _user = {
      //   email: "additional@test.com",
      //   fullname: "adssad as dsad",
      //   username: "vandyke1906"
      // }
      
      // insertDB("users", _user);
    
      function logout() {
        firebase
          .auth()
          .signOut()
          .then(() => {
              // alert('Successfully logged out');
               router.push({ name: "login" });
          })
          .catch(error => {
              alert(error.message);
               router.push({ name: "login" });
          });
        }

      return {
        state,
        logout,
      }
    }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  
  & a{
    padding: 10px;
    text-decoration: none;
  }
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

input {   
  margin-right: 20px; 
}

</style>
