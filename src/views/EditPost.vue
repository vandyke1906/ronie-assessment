<template>
    <form class="edit-post-form" @submit.prevent="updatePost">
        <label for="edit-post">
            <strong>Update Post</strong> ({{newPostCharCount}})
        </label>
        <textarea id="edit-post"  rows="5" v-model="state.postContent"></textarea>
        <button>Save</button>
    </form>
</template>


<script>
import { reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import firebase from "firebase";

export default {
    name: "CreatePostPanel",
    setup(){

        const route = useRoute();
        const router = useRouter();
        const database = firebase.database();
        const state = reactive({
            postContent: "",
            user: null,
        });

        onMounted(()=>{
            firebase.auth().onAuthStateChanged( (user) => {
                if (user) {
                    loadPost(user.uid);

                    //load user
                    var itemRef = database.ref('users/'+user.uid);
                    itemRef.on('value', (snapshot) => {
                        const data = snapshot.val();
                        state.user = data;
                        state.user['uid'] = user.uid;

                        // console.log(state.user);
                    });

                } else {
                console.log("No User!");
                }
            });
        })

        function loadPost(uid){
            database.ref(`posts/${uid}/${route.params.key}`).on('value', (snapshot) => {
                // console.log(snapshot.val().content);
                state.postContent = snapshot.val().content;
            });
        }

        function updatePost(){
            const key = route.params.key;
            const _post = {
                username: state.user.username,
                content: state.postContent,
                timestamp: Date.now(),
                isUpdated: true,
            };

            database.ref(`posts/${state.user.uid}/${key}`).set(_post);
            
            alert('Successfully updated post!');
            router.push({ name: "Dashboard" });
        }

        const newPostCharCount = computed( () => state.postContent.length )

        return {
            state,
            newPostCharCount,
            updatePost,
        }
    },
}
</script>

<style lang="scss" scoped>

.edit-post-form{
    margin-top:10px;
    display: flex;
    flex-direction: column;
}

button{
    padding: 5px;
    margin-top: 10px;
}

</style>