<template>
  <div>
    <form @submit.prevent="login">     
      <h2>Login</h2>     
      <input       
        name="email"       
        type="email"       
        placeholder="Email address..."       
        v-model="state.email"     
      />     
      <input       
        name="password"       
        type="password"       
        placeholder="password..."       
        v-model="state.password"     
      />     
      <button type="submit">
        Login
      </button>   
    </form> 
  </div>
</template>

<script>
import firebase from "firebase";
import { reactive } from "vue";
import { useRouter } from "vue-router";

export default {
  setup(){

    const router = useRouter();
    const state = reactive({
      email: "vandyke1906@gmail.com",
      password: "123456"
    });

    function login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(state.email, state.password)
        .then(() => {
          // localStorage.setItem("key", user.uid);
          // alert('Successfully logged in');
          router.push({ name: "Dashboard" });
        })
        .catch(error => {
          alert(error.message);
        });
    }

    return {
      state,
      login,
    }
  }
}
</script>

<style lang="scss" scoped>

</style>