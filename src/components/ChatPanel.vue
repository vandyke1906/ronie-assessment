<template>
  <div>
    <!-- Chat section -->
      <div class="card" v-if="contactKey != null">
        <div class="card-body">
          <div
            class="border pl-2 pt-1 ml-2 message-text mb-2"
            v-for="message in state.messages"
            :key="message.key"
          >
            <!-- <p>{{message}}</p> -->
            <p class="message pt-1"><span class="mg-text">{{ message.username }} <small>({{ message.time }}) </small></span>{{ message.message }}</p>
          </div>
        </div>
      </div>

      <label>New Message </label>
      <input v-model="state.newMessage" type="text" class="mt-3 mr-2 pl-2 pr-2" />
      <button class="btn btn-primary" @click="sendMessage">Send</button>
      
    </div>
</template>

<script>

import firebase from "firebase";
// import { useRoute } from "vue-router";
import { reactive, onMounted } from "vue";
import _ from "lodash";

export default {
  props: {
    contactKey: {
      required: true,
      type: String,
    },
  },
  setup(props){
    // const route = useRoute();
    // const router = useRouter();
    const state = reactive({
      // from: "-MWWyf1bW1ib3anKqywc",
      // to: "",
      currentUser: [],
      contactUser: [],
      newMessage: "",
      messages: [],
      chatKey: null,
    });

    const database = firebase.database();
    const messaging = firebase.messaging();
    
   
    // mounted
    onMounted(() => {      

      firebase.auth().onAuthStateChanged( (user) => {
        if (user) {

          //get currentUserObject
          getUserDetails(user.uid).then((snapshot) => {
              state.currentUser = snapshot.val();

              //get contactUser
              getUserDetails(props.contactKey).then((snapshot) => {
                  state.contactUser = snapshot.val(); 


            //getChatKeys
            database.ref("chats").orderByChild('members').on("child_added", (membersSnapShot) => { 
              
              const currentUserArray = [state.currentUser.username, state.contactUser.username];
              
              // console.log(membersSnapShot.val().members, currentUserArray, _.isEqual(_.orderBy(membersSnapShot.val().members), _.orderBy(currentUserArray)));
              // console.log("order", _.orderBy(currentUserArray));

              if (_.isEqual(_.orderBy(membersSnapShot.val().members), _.orderBy(currentUserArray))){
                
                state.chatKey = membersSnapShot.key;
                // console.log("inside if", membersSnapShot.key);

                //iterate messages thru given key
                firebase.database().ref(`messages/${membersSnapShot.key}`).on('value', function(snapshot) {
                  state.messages = [];
                  
                  snapshot.forEach(function(childSnapshot) {
                    var date = new Date(childSnapshot.val().time);
                    state.messages.push({ 
                      username: childSnapshot.val().username,
                      message: childSnapshot.val().message,
                      time: date.toLocaleString("en-US"),
                    });
                  });
                });
                //iterate messages thru given key

              } //end of if statement
            }); //getChatKeys


              });//get contactUser

            });//get currentUserObject
          
        } else {
          console.log("No User!");
        }
      });


      messaging.getToken();

            
    })//end onMounted


     async function getUserDetails(id){
      var itemRef = database.ref(`users/${id}`);
        return await itemRef.once("value", (snapshot) => {
          return snapshot;
        });
    }

    
    function sendMessage() {
      
      // message data
      const msgData = {
        username: state.currentUser.username,
        time: Date.now(),
        message: state.newMessage,
      };
        
      const currentUserArray = [state.currentUser.username, state.contactUser.username];
      var chatKey = (_.isEmpty(state.chatKey)) ?  database.ref('chats/').push().key : state.chatKey;
      var conversationKey = database.ref(`/messages/${chatKey}/`).push().key;
      var updates = {};
      updates[`/chats/${chatKey}/members`] = currentUserArray;
      updates[`/messages/${chatKey}/${conversationKey}`] = msgData;
      database.ref().update(updates);

      state.newMessage = "";

    }

    return{
      state,
      sendMessage,
    }
  }
}
</script>

<style lang="scss" scoped>

</style>