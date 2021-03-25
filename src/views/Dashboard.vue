<template>
    <div class="user-profile">
        <div class="user-panel">
            <h1> {{ state.user.fullName }}</h1>
            <p>(@{{ state.user.username }}) </p>
            <div class="badge" v-if="state.user.isAdmin">Admin</div>
            <div class="follower-count">
                <strong>Contacts: </strong> {{ state.contactsCount }}
            </div>

            <create-post-panel @add-post="addNewPost"/>
        </div>
        
    <div class="posts-wrapper">
            <post-item v-for="post in state.posts" :key="post.key" :post="post" @delete-post="deletePost" /> <!-- @toggle-favorite="toggleFavorite"-->
    </div>


    </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
// import { useRoute } from 'vue-router';
import firebase from "firebase";
import _ from "lodash";


import PostItem from '@/components/PostItem';
import CreatePostPanel from '@/components/CreatePostPanel.vue';


export default {
    name: "UserProfile",
    components: {
        PostItem,
        CreatePostPanel,
    }, 
    setup(){
      const database = firebase.database();

        const state = reactive({
            contactsCount: 0,
            user: [],
            posts: [],
        });

        function loadUserDetails(){
            firebase.auth().onAuthStateChanged( (user) => {
                if (user) {
                    
                    selectUser(user.uid);
                    loadPosts(user.uid);
                    // loadPosts(user.uid);
                        
                    // var itemRef = database.ref('users/'+user.uid);
                    // itemRef.on('value', (snapshot) => {
                    //     const data = snapshot.val();
                    //     state.user = data;
                    //     state.user['uid'] = user.uid;

                    //     // console.log(state.user);
                    // });
                } else {
                console.log("No User!");
                }
            });
        }

        function selectUser(key){
            var itemRef = database.ref(`users/${key}`);
            itemRef.on('value', (snapshot) => {
                const data = snapshot.val();
                state.user = data;
                state.user['uid'] = key;
            });
        }

        function loadPosts(userId){
            
            // _selectDoc("posts", userId);
            // console.log(_.toUpper(userId));
            database.ref(`posts/${userId}`).orderByChild("timestamp").on('value', (snapshot) => {
                let sObj = [];
                snapshot.forEach(function(ss) {
                    sObj.push({
                        key : ss.key,
                        username: ss.val().username,
                        timestamp : ss.val().timestamp,//(new Date(ss.val().timestamp)).toLocaleString("en-US"),
                        content : ss.val().content,
                        isUpdated: ss.val().isUpdated,
                    });
                });

                state.posts = _.orderBy(sObj, "timestamp", "desc");
            });
        }

        //events passed on component
        //###
        function toggleFavorite(id){ 
            console.log("Toggle with id " + id);
        }

        function addNewPost(content){
            const _post = {
                username: state.user.username,
                content: content,
                timestamp: Date.now(),
                isUpdated: false,
            };
            database.ref(`posts/${state.user.uid}`).push(_post);

            // _insertDocCollection("posts", state.user.uid, _post);
        }

        // function editPost(key){
        //     database.ref(`posts/${state.user.uid}/${key}`).on('value', (snapshot) => {
        //         console.log(snapshot.val().content);

        //     });
        //     // const _post = {
        //     //     username: state.user.username,
        //     //     content: content,
        //     //     timestamp: Date.now(),
        //     // };
        //     // database.ref(`post/${state.user.uid}/${key}`).set(contact);

        //     // alert('Successfully updated contact');
        // }

         function deletePost(key){
            if (window.confirm("Do you really want to delete post?")) {
                const itemsRef = database.ref(`posts/${state.user.uid}`);
                itemsRef.child(key).remove().then(() => {  
                    alert("Post deleted!");
                })
                .catch((error) => {
                    alert(error);
                    console.error(error);
                })
            }
        }

        

        //###
        //events passed on component

        onMounted(() => {
          loadUserDetails();

        })

        return {
            state,
            toggleFavorite,
            addNewPost,
            deletePost,
        };
    }
}
</script>

<style lang="scss" scoped>
    
    .user-profile{
        display: grid;
        text-align: start;
        grid-template-columns: 1fr 3fr;
        grid-gap: 50px;
        padding: 50px 5%;


    .user-panel{
        display: flex;
        flex-direction: column;
        margin-right: 50px;
        padding: 20px;
        background: #ffffff;
        border-radius: 5px;
        border: 1px solid #cccccc;
    }

    h1{
        margin: 0;
    }

    .posts-wrapper{
        display: grid;
        grid-gap: 10px;
        padding:10px;
    }

    .badge{
        padding: 5px;
        background-color: darkorange;
    }


    }

</style>
