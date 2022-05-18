<template>
    <div class="like">
        <i class="fas fa-thumbs-up like btnSave" id="likeIcon" @click="createLike" aria-label="Bouton like">{{likes}}</i>
        <i class="fas fa-thumbs-down like btnDelete" id="likeIcon" @click="createDislike" aria-label="Bouton dislike">{{dislikes}}</i>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "LikeCompo",
    data() {
        return {
            posts: [],
            Likes:[],
            Dislikes:[],
            id_param: this.$route.params.id,
        };
    },
    computed: {
        // Calcul total des likes
        totalLike() {
        return this.likes.length
        },

        // Calcul total des dislikes
        totalDislike() {
        return this.dislikes.length
        },
    },
    
    createLike() {
        const token = localStorage.getItem("token")
        const userId = localStorage.getItem("userId")
        const postId = this.$route.params.id; 
        
        let data = {
        postId: postId,
        userId: userId,
        }
        axios.post(`http://localhost:3000/api/posts/${this.id_param}/like`,data, {
            headers: {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
                body: data 
        })             
        .then((res)=> {
            this.posts = res.data;
            this.likes = res.data;
            this.dislikes = res.data;
        })
        .catch((error) => {console.log(error) });
    },

    createDislike() {
        const token = localStorage.getItem("token")
        const userId = localStorage.getItem("userId")
        const postId = this.$route.params.id; 
        let data = {
        postId: postId,
        userId: userId
        }
        axios.post(`http://localhost:3000/api/posts/${this.id_param}/dislike`,data, {
        headers: {
            'authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
        body: data 
        })             
        .then((res)=> {
            this.posts = res.data;
            this.likes = res.data;
            this.dislikes = res.data;
        })
        .catch((error) => {console.log(error) });
    },
    mounted(){
    }
}
</script>

<style scoped>
.likeNbr{
    margin: 0;
    padding: 0;
    outline: none;
}
p {
    padding-left: 0.5em;
}
#likeIcon:hover {
    cursor: pointer;
}
.like{
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
</style>