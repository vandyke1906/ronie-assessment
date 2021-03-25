<template>
    <!-- <div class="contact-item" @click="mfavoritecontact(contact.id)"> -->
    <div class="contact-item">
        <div class="contact">
            <div class="contact-header">
                <strong> @{{ contact.username }} </strong>
            </div>
            <div class="contact-content">
                {{ contact.fullName }}
            </div>
            <div class="contact-footer">
                {{ contact.email }}
            </div>
            <button @click.prevent="addContact" class="btn btn-danger" v-if="(mode =='search')">Add to my contact</button>

            <router-link :to="{ name:'Chat', params: { key: contact.key }}" v-if="(mode !='search')">Chat </router-link> 
        </div>
    </div>
</template>

<script>
import {  } from 'vue';
export default {
    name: "contactItem",
    props: {  
        userId: { type: String, required: true },
        mode: { type: String, default: "contact" },
        contact: {type: Object, required: true,}
    },
    setup(props, ctx){

        function addContact(){
            ctx.emit('add-contact', props.contact);    //add-post was props in dashboard file
        }

        return {
            addContact,
        }
    }
}
</script>

<style lang="scss" scoped>
.contact-item{
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