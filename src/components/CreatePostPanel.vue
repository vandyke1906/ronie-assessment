<template>
    <form class="create-post-form" @submit.prevent="createNewPost">
        <label for="new-post">
            <strong>New Post</strong> ({{newPostCharCount}})
        </label>
        <textarea id="new-post"  rows="5" v-model="state.postContent"></textarea>
        <button>Post</button>
    </form>
</template>

<script>
import { reactive, computed } from 'vue';

export default {
    name: "CreatePostPanel",
    setup(props, ctx){
        //###
        const state = reactive({
            postContent: "",
        });

        //###
        const newPostCharCount = computed( () => state.postContent.length )

        //###
        function createNewPost(){
            ctx.emit('add-post', state.postContent);    //add-post was props in dashboard file
            state.postContent = '';
        }

        return {
            state,
            newPostCharCount,
            createNewPost,
        }
    },
}
</script>

<style lang="scss" scoped>

.create-post-form{
    margin-top:10px;
    display: flex;
    flex-direction: column;
}

button{
    padding: 5px;
    margin-top: 10px;
}

</style>