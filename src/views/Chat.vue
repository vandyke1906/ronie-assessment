<template>
    <div class="chat-profile">
        <div class="contact-panel">

            <div  v-for="contact in state.contacts" :key="contact.key" class="contact-item" @click="chatContact(contact.key)">
                <div class="contact">
                    <div class="contact-header">
                        <strong> @{{ contact.username }} </strong> ({{ contact.fullName }})
                    </div>
                </div>
            </div>

        </div>
            
        <div class="chat-panel">
              <!-- Chat section -->
                <div class="card" v-if="state.contactKey != null">
                <h5>Chat with {{ state.contactUser.fullName }}</h5>
                    <div class="card-body">
                    <div
                        class="border pl-2 pt-1 ml-2 message-text mb-2"
                        v-for="message in state.messages"
                        :key="message.key"
                    >
                        <p class="message pt-1"><span class="mg-text">{{ message.username }}: <small>({{ message.time }}) </small></span>{{ message.message }}</p>
                    </div>
                    </div>
                </div>

                <label>New Message </label>
                <input v-model="state.newMessage" type="text" class="mt-3 mr-2 pl-2 pr-2" />
                <button class="btn btn-primary" @click="sendMessage">Send</button>
              <!-- Chat section -->
        </div>
    </div>
</template>


<script>

import firebase from "firebase";
import { reactive, onMounted } from "vue";
import _ from "lodash";


export default {
    components:{
    },
  setup(){
      
    const state = reactive({
        contacts: [],
        contactKey: null,
        userId: "",

        currentUser: [],
        contactUser: [],
        newMessage: "",
        messages: [],
        chatKey: null,
    });

    const database = firebase.database();


    function loadContacts(userId){
        state.contacts = [];
        const itemRef = firebase.database().ref(`contacts/${userId}`);

         itemRef.on('value', (snapshot) => {
            let _contacts = [];
            snapshot.forEach(function(obj) {
                 const _contact = { 
                    key: obj.key, 
                    username: obj.val().username, 
                    fullName: obj.val().fullName, 
                    email: obj.val().email, 
                }
                _contacts.push(_contact);
            });
            state.contacts = _contacts;

        });
    }

    function chatContact(key){
        // console.log(key);
        state.contactKey = key;
        state.messages = [];

        //get contactUser
        getUserDetails(key).then((snapshot) => {
            state.contactUser = snapshot.val(); 
            
            //getChatKeys
            database.ref("chats").orderByChild('members').on("child_added", (membersSnapShot) => { 
              
              const currentUserArray = [state.currentUser.username, state.contactUser.username];
              
            //   console.log(membersSnapShot.val().members, currentUserArray, _.isEqual(_.orderBy(membersSnapShot.val().members), _.orderBy(currentUserArray)));
              // console.log("order", _.orderBy(currentUserArray));

              if (_.isEqual(_.orderBy(membersSnapShot.val().members), _.orderBy(currentUserArray))){
                
                state.chatKey = membersSnapShot.key;
                console.log("inside if", membersSnapShot.key);

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
            
        }) //get contactUser
}

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

    onMounted(() => {   
         firebase.auth().onAuthStateChanged( (user) => {
            if (user) {
                loadContacts(user.uid);

                //get currentUserObject
                getUserDetails(user.uid).then((snapshot) => {
                state.currentUser = snapshot.val();

                })//get currentUserObject

                
            } else {
            console.log("No User!");
            }
        });
        
    })


    return{
      state,
      chatContact,
      sendMessage,
    }
  }
}
</script>



<style lang="scss" scoped>
    
.chat-profile{
        display: grid;
        text-align: start;
        grid-template-columns: 1fr 3fr;
        grid-gap: 50px;
        padding: 50px 5%;


        h1{
            margin: 0;
        }

        .contact-panel{
            display: flex;
            flex-direction: column;
            margin-right: 50px;
            padding: 20px;
            background: #ffffff;
            border-radius: 5px;
            border: 1px solid #cccccc;
            
            .contact-item{
                display: flex;
                // margin:10px;
                padding: 10px;

                // border: 1px solid #cccccc;
                border-radius: 10px;
                box-sizing: border-box;
                cursor: pointer;
                transition: all 0.25s ease;

                &:hover{
                    transform: scale(1.02, 1.02);
                    background-color: #efeded;
                }
            }
        }

        .chat-panel{
            display: grid;
            grid-gap: 10px;
            padding:10px;
            border-radius: 5px;
            border: 1px solid #cccccc;

            .message{
                // margin:10px;
                padding: 10px;
                border: 1px solid #efeded;
                border-radius: 10px;
                box-sizing: border-box;
                cursor: pointer;
                transition: all 0.25s ease;
            }
        }

    }

</style>

