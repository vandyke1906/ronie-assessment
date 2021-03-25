<template>
<div class="row justify-content-center">
        <h3 class="text-center">Search Contact</h3>
            <form @submit.prevent="searchUser">
                <div class="form-group">
                    <label>Search</label>
                    <input type="text" class="form-control" placeholder="Email Address" v-model="state.searchString" required>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary btn-block">Search</button>
                </div>
            </form>
            
            <div class="posts-wrapper">
                <contact-detail v-for="user in state.users" :key="user.key" :userId="0" :contact="user" :mode="'search'" @add-contact="addContact" />  <!--  @toggle-favorite="toggleFavorite"/> -->
            </div>

            <!-- <div class="row">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in state.users" :key="user.key">
                                <td>{{ user.fullName }}</td>
                                <td>{{ user.email }}</td>
                                <td>
                                    <button @click.prevent="addContact(user)" class="btn btn-danger">Add</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
            </div> -->

    </div>
</template>

<script>

import firebase from "firebase";
import { useRouter } from "vue-router";
import { reactive } from "vue";
import _ from "lodash";

import ContactDetail from '@/components/ContactDetail'


export default {
    components: {
      ContactDetail
    },
  setup(){
    
    const router = useRouter();
    const state = reactive({
        contact: {
            name: "",
            email: "",
            phone: "",
        },
        userId: "",
        users: [],
        searchString: ""
    });

    const database = firebase.database();

    function searchUser(){
        let queryText = state.searchString;
        const  itemsRef = database.ref("users").orderByChild("email").startAt(queryText).endAt(queryText+"\uf8ff")

          itemsRef.on('value', (snapshot) => {

            let _users = [];
            snapshot.forEach(function(obj) {
                 const _user = { 
                    key: obj.key, 
                    username: obj.val().username, 
                    fullName: obj.val().fullName, 
                    email: obj.val().email, 
                }
                _users.push(_user);
            });
            state.users = _users;

            _.filter(snapshot.val(), function(obj) {
                return obj.email != firebase.auth.email ; 
            }); 

            console.log(state.users);

          });
    }


    function addContact(user) {
        const _user = {
            email: user.email,
            fullName: user.fullName,
            username: user.username
        };
        //   console.log(firebase.auth().currentUser.uid);
        // console.log('key', userKey);
      database.ref(`contacts/${firebase.auth().currentUser.uid}/${user.key}`).set(_user);

        alert('Successfully added contact');
        router.push({ name: "Contacts" });
    }

    return{
      state,
      addContact,
      searchUser,
    }
  }
}
</script>

<style lang="scss" scoped>

</style>