<template>
<div class="row justify-content-center">
        <div class="col-md-5">
            <h3 class="text-center">Edit Contact</h3>
            <form @submit.prevent="editContact">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" class="form-control" v-model="state.contact.name" required>
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-control" v-model="state.contact.email" required>
                </div>

                <div class="form-group">
                    <label>Phone</label>
                    <input type="text" class="form-control" v-model="state.contact.phone" required>
                </div>

                <div class="form-group">
                    <button class="btn btn-primary btn-block">Update Contact</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>

import firebase from "firebase";
import { useRouter, useRoute } from "vue-router";
import { reactive, onMounted } from "vue";

export default {
  setup(){
    
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
        contact: {
            name: "",
            email: "",
            phone: "",
        }
    });

    const database = firebase.database();

    function editContact() {
      const contact = {
            name: state.contact.name,
            email: state.contact.email,
            phone: state.contact.phone,
      };
    //   firebase
    //     .database()
    //     .ref("contacts")
    //     .set(contact);  

        let id = route.params.id;
        database.ref('contacts/'+id).set(contact);

        alert('Successfully updated contact');
        router.push({ name: "Contacts" });
    }

    function loadContact(){
        let id = route.params.id;
        var itemRef = database.ref('contacts/'+id);
        itemRef.on('value', (snapshot) => {
            const data = snapshot.val();
            state.contact = data;
        });
    }

    onMounted(() => {
        loadContact();
    })

    return{
      state,
      editContact,
    }
  }
}
</script>

<style lang="scss" scoped>

</style>