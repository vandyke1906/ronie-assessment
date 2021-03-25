<template>
    <!--  @click="mfavoritepost(post.id)" -->
    <div class="post-item">
        <div class="post">
            <div class="user">
                <strong> @{{ post.username }} </strong> <small>{{(post.isUpdated) ? "updated " : "posted" }} {{ timeAgo(post.timestamp) }}</small>
            </div>
            <div class="post-content">
                {{ post.content }}
            </div>

            <div class="post-footer">
                <small>
                    <router-link :to="{name: 'EditPost', params: {key: post.key}}"> Edit </router-link> 
                    |
                    <a href="#" @click="deletePost(post.key)"> Delete</a></small>
            </div>
        </div>
    </div>
</template>

<script>
import {  onMounted} from 'vue';
export default {
    name: "postItem",
    props: {
        post: {
            type: Object,
            required: true,
        }
    },
    setup(props, ctx){

        onMounted(() => {
            // console.log("props", props.post);
        })

        //events here

        // //###
        // function mfavoritepost(id){
        //     ctx.emit('toggle-favorite', id);
        // }

        // function editPost(key){
        //     ctx.emit('edit-post', key);
        // }

         function deletePost(key){
            ctx.emit('delete-post', key);
        }
        //events here

        const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];


        const getFormattedDate = (date, prefomattedDate = false, hideYear = false) => {
            const day = date.getDate();
            const month = MONTH_NAMES[date.getMonth()];
            const year = date.getFullYear();
            const hours = date.getHours();
            let minutes = date.getMinutes();

            // Adding leading zero to minutes
            if (minutes < 10) minutes = `0${ minutes }`;
            // Today at 10:20
            // Yesterday at 10:20
            if (prefomattedDate) return `${ prefomattedDate } at ${ hours }:${ minutes }`;
            // 10. January at 10:20
            if (hideYear) return `${ day }. ${ month } at ${ hours }:${ minutes }`;
            // 10. January 2017. at 10:20
            return `${ day }. ${ month } ${ year }. at ${ hours }:${ minutes }`;
        }
        
        const timeAgo = (dateParam) =>  {
            if (!dateParam) {
                return null;
            }

            const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
            const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
            const today = new Date();
            const yesterday = new Date(today - DAY_IN_MS);
            const seconds = Math.round((today - date) / 1000);
            const minutes = Math.round(seconds / 60);
            const isToday = today.toDateString() === date.toDateString();
            const isYesterday = yesterday.toDateString() === date.toDateString();
            const isThisYear = today.getFullYear() === date.getFullYear();


            if (seconds < 5) {
                return 'now';
            } else if (seconds < 60) {
                return `${ seconds } seconds ago`;
            } else if (seconds < 90) {
                return 'about a minute ago';
            } else if (minutes < 60) {
                return `${ minutes } minutes ago`;
            } else if (isToday) {
                return getFormattedDate(date, 'Today'); // Today at 10:20
            } else if (isYesterday) {
                return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
            } else if (isThisYear) {
                return getFormattedDate(date, false, true); // 10. January at 10:20
            }
            return getFormattedDate(date); // 10. January 2017. at 10:20
        }

    // methods: {
    //     mfavoritepost(id){
    //         this.$emit('toggle-favorite', id);
    //     }
    // }

        return {
            timeAgo,
            deletePost,
        }

    } //end of setup
}
</script>

<style lang="scss" scoped>
.post-item{
    display: flex;
    margin:10px;
    padding: 10px;
    border: 1px solid gray;
    border-radius: 5px;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover{
        transform: scale(1.02, 1.02);
    }
}

</style>