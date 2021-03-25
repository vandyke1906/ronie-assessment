<template>
  <div>
    <form @submit.prevent="register">
      <h2>Register</h2>
      <input
        name="fullName"
        type="text"
        placeholder="Full Name..."
        v-model="state.fullName"
      />
      <input
        name="username"
        type="text"
        placeholder="Username..."
        v-model="state.username"
      />
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
      <button type="submit">Register</button>
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
      username: "",
      fullName: "",
      email: "",
      password: ""
    });

    function register() {
      firebase
      .auth()
      .createUserWithEmailAndPassword(state.email, state.password)
      .then(() => {

        var _uid = firebase.auth().currentUser.uid;
        const _user = {
          username: state.username,
          fullName: state.fullName,
          email: state.email,
        };

        firebase.database().ref(`users/${_uid}`).set(_user);
        alert('Successfully registered! Please login.');


        router.push({ name: "Dashboard" });
      })
      .catch(error => {
        alert(error.message);
      });
    }

    return{
      state,
      register,
    };

  }
}
</script>

<style lang="scss" scoped>

</style>