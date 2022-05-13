<template>
    <div>
        <HeaderProfile/>
            <section >
                <article class="header">
                    <!-- Affichage d'un post --> 
                    <div class = "card info blockRespo" >
                        <nav class = "blockRespoText">
                            <input class="inputTitle" type="text" v-model="post.title" required aria-label="Titre" disabled size="50" > 
                            <textarea type="text" v-model="post.content" required aria-label="Message" disabled ></textarea>
                            <p>Posté par <b>{{ post.user.nom }}</b> <b>{{ post.user.prenom }} </b>     
                                le <b>{{ dateFormat(post.createdAt) }}</b>
                                à <b>{{ hourFormat(post.createdAt) }}</b><br>
                            </p>
                            <p v-if="post.createdAt != post.updatedAt">
                                Modifié 
                                le <b>{{ dateFormat(post.updatedAt) }}</b>
                                à <b>{{ hourFormat(post.updatedAt) }}</b>
                            </p>

                            <!-- Modification & suppression d'un post -->  
                            <div class="content modif">
                                <button @click="modifyPost()" class="btnSave" aria-label="Modifier ce post"><i class="fas fa-edit"></i> Modifier la publication</button>
                                <button @click="deletePost()" class="btnDelete" aria-label="Supprimer ce post"><i class="far fa-trash-alt"></i> Supprimer la publication</button>
                            </div> 
                        </nav>
                        <img class="imgPost" v-if="post.image" :src="post.image" alt="Image du post">
                    </div>
                </article>

                <!-- Création d'un commentaire -->
                <button v-if="displayCreateComment === false" v-on:click="show2" class="btnSave" aria-label="Ecrire un commentaire"><i class="far fa-edit"></i>Commenter</button>
                <article v-if="displayCreateComment" class="createcomment">
                    <textarea v-model="content" placeholder="Ecrire ton commentaire..." cols="60" rows="5" aria-label="Message du commentaire"></textarea>
                    <div class=btnComment>
                        <button @click="createComment()" class="btnSave" aria-label="Envoyer le commentaire">Envoyer</button>
                        <button v-on:click="hide2" class="btnDelete" aria-label="Annuler le commentaire">Annuler</button>
                    </div>
                </article>

                <!-- Affichage d'un commentaire -->
                <button  v-on:click="show" @click="getOneComment()" class="btnSave" aria-label="Voir les commentaires">Afficher: {{ comments.length }} commentaires </button>
                    <table class="header " v-if="displaycomments" >
                        <h2>Les commentaires</h2>
                        <tr class="card displayComment" v-bind:key="index" v-for="(comment, index) in comments" >
                            <td>Commenté par:<p class="userComment">{{comment.user.nom}}</p></td>
                            <td>
                                le <b>{{ dateFormat(comment.createdAt) }}</b>
                                à <b>{{ hourFormat(comment.createdAt) }}</b>
                            </td>
                            <td>
                                <textarea type="text" v-model="comment.content" required aria-label="Commentaire" disabled></textarea>
                            </td>

                            <!-- <input class="inputTitle" type="text" v-model="post.title" required aria-label="Titre" disabled size="50" > 
                            <textarea type="text" v-model="post.content" required aria-label="Message" disabled ></textarea>
                            <p>Posté par <b>{{ post.user.nom }}</b> <b>{{ post.user.prenom }} </b>     
                                le <b>{{ dateFormat(post.createdAt) }}</b>
                                à <b>{{ hourFormat(post.createdAt) }}</b><br>
                            </p>
                            <p v-if="post.createdAt != post.updatedAt">
                                Modifié 
                                le <b>{{ dateFormat(post.updatedAt) }}</b>
                                à <b>{{ hourFormat(post.updatedAt) }}</b>
                            </p> -->


                            <!-- Suppression d'un commentaire -->  
                            <div class="content displayComment">
                                <div class="modif">                                                                   
                                    <button @click="deleteComment(index)"  class="btnDelete" aria-label="Supprimer ce commentaire"><i class="far fa-trash-alt"></i> Supprimer commentaire</button>
                                    <button v-on:click="hide" class="btnDelete" aria-label="Masquer les commentaires">Masquer</button>
                                </div>
                            </div>  
                        </tr>    
                    </table>
            </section>
        <router-link to="/allposts" aria-label="Retour vers Le fil d'actu de Groupomania"><i class="fas fa-home home"></i></router-link>
        <Footer/>
    </div>
</template>

<script>
import axios from 'axios';
import HeaderProfile from "../components/HeaderProfile";
import Footer from "../components/FooterCompo";
export default {
    name: 'PostView',
    components: {
        HeaderProfile,
        Footer
    },
    data () {
        return {
            id_param: this.$route.params.id,
            postId: this.$route.params.id,
            users: [],
            props: ['post'],
            posts: [],
            preview: null,
            post: {
                title:'',
                content:'',
                createdAt:'',
                updatedAt:'',
                id:'',
                image:'',
                user: { },
                userId:'',
                
            },
            user : {
                nom: '',
            },
            userId:'',
            comments: [],
            id:'',
            content: '',
            role: '',
            displaycomments: false,
            displayCreateComment: false,
            modifyComment: false,
        }
    },
    methods : {
        show: function () {
            return this.displaycomments = true;
        },
        hide: function () {
            return this.displaycomments = false;
        },
        show2: function () {
            return this.displayCreateComment = true;
        },
        hide2: function () {
            return this.displayCreateComment = false;
        },
        show3: function () {
            return this.modifyComment = true;
        },
        hide3: function () {
            return this.modifyComment = false;
        },
        User() {
            this.id = localStorage.getItem("userId")
            this.role = localStorage.getItem("role")
        },

        // Affichage d'un post
        getOnePost() {
            const token = localStorage.getItem("token")
            axios.get(`http://localhost:3000/api/posts/${this.postId}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
                .then((res) => {
                this.posts = res.data;
                this.users = res.data;
                this.post.title = res.data.title;
                this.post.content = res.data.content;
                this.post.image = res.data.image;
                this.post.createdAt = res.data.createdAt;
                this.post.updatedAt = res.data.updatedAt;
                this.user.nom = res.data.nom ;
                this.user.prenom = res.data.prenom 
            })
            .catch(() => console.log('Impossible de récupérer le post!'))
        },

        // Date 
        dateFormat (createdDate) {
            const date = new Date(createdDate)
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'};
            return date.toLocaleDateString('fr-FR', options);
        },
        hourFormat (createdHour) {
            const hour = new Date(createdHour)
            const options = { hour: 'numeric', minute:'numeric', second:'numeric'};
            return hour.toLocaleTimeString('fr-FR', options);
        },

        // Suppression d'un post
        deletePost () {
            const token = localStorage.getItem("token")
            if (confirm("Voulez-vous vraiment supprimer le post") === true) {
                axios.delete(`http://localhost:3000/api/posts/${this.id_param}`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                })
                .then((res) => {
                alert ("Publication supprimée")
                console.log(res.data);
            })
            .catch(() =>{ 
                alert("Non autorisé à supprimer ce post!!")
                console.log('Non autorisé à supprimer ce post!!')
            })
        }
        },

        // Modification d'un post
        modifyPost () {
            this.$router.push(`/postmodify/${this.id_param}`)
        },
        
        // Affichage d'un commentaire
        getOneComment() {
            const token = localStorage.getItem("token")              
            axios.get(`http://localhost:3000/api/comments/${this.postId}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            .then((res) => {
                this.posts = res.data;
                this.users = res.data;
                this.comments = res.data;
                this.user.nom = res.data.nom;
                this.comments.content = res.data.content;
                this.comments.createdAt = res.data.createdAt;
                this.comments.updatedAt = res.data.updatedAt;
            })
            .catch(() => console.log('Impossible de récupérer le commentaire!'))
        },

        // Création d'un commentaire
        createComment () {
            const token = localStorage.getItem("token")
            const userId = localStorage.getItem("userId")
            const postId = this.$route.params.id;
            console.log(postId)
            if( this.commentaire === ""){
                alert('Saisissez votre commentaire')
            } else {
                let data = {
                    content: this.content,
                    postId: postId,
                    userId: userId,
                }
                console.log(data)                                     
                axios.post("http://localhost:3000/api/comments/" ,data, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: data
                })
                .then(() => {
                    alert("Commentaire publié")
                    console.log("Commentaire publié")
                    this.$router.push("/allposts");
                })
                .catch(() => console.log(' err comments'))
            }
        },
        
        // Suppression d'un commentaire
        deleteComment () {
            const token = localStorage.getItem("token")
            if (confirm("Voulez-vous vraiment supprimer le commentaire") === true) {
                axios.delete(`http://localhost:3000/api/comments/${this.comments.id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    alert("Commentaire supprimé")
                    console.log(res.data);
                })
                .catch(() => {
                    alert("Non autorisé à supprimer ce commentaire!!")
                    console.log('Non autorisé à supprimer ce commentaire!!')})
            }
        },
    },
    mounted(){
        this.User()
        this.getOnePost ()
    }
}
</script>

<style scoped>
section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto 0 auto;
}
.card {
    width: 95%;
    display: flex;
    flex-direction: column;
    margin-top: 15px;
}
h2{
    margin-top: 15px;
}
.cardComment {
    display: flex;
    flex-direction: row;
    margin-top: 15px;
}
table{
    margin-top: 15px; 
}
input{
    width: 60%;
    height: 30px;
    margin-top: 10px;
    color: #000000;
    text-align: center ;
    font-size: 20px;
    font-weight: bolder;
    border-radius: 20px;
}
.inputTitle{
    margin: 10px auto 10px auto ;
    width: 70%;
    font-size: 15px;
    text-align: center;
}
h1 {
    font-size: 15px;
    margin: 30px 0 10px 0;
}
textarea {
    width: 90%;
    height: 150px;
    font-size: 15px;
    margin: 10px auto 10px auto;
}
.userComment{
    font-size: 20px;
    font-weight: bolder;
}
.header,
.content {
    width: 95%;
    background:grey;
    border-radius: 20px ;
}
.header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 20px;
}
.content {
    border-radius: 0 0 20px 20px;
}
.info {
    font-size: 13px;
}
.commentaire {
    font-size: 20px;
    margin-right: 10px;
}
p {
    padding-left: 0.5em;
}
.Icon:hover {
    cursor: pointer;
}
.modif {
    margin: 0;
}
.btnDelete{
    margin-bottom: 10px;
}
.btn{
    text-align: center;
    width: 30%;
}
.content {
    margin: auto;
}
.createcomment {
    display: flex;
    flex-direction: column;
}
.displayComment{
    border-radius: 20px;
    margin: 10px auto 10px auto ;
    background: rgba(207, 203, 203, 0.877);
}
.btnComment{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    
}
.button-comment {
    margin: 10px 0 0 0;
    padding: 5px 5px ;
    border: 2px solid #fd2d01;
    border-radius: 10px;
    background: #ffd7d7;
    font-size: 1rem;
    cursor: pointer;
}
.link {
    text-decoration: none;
    color: #000000;
}
.comment-button {
    margin: 10px 0 30px 0;
    padding: 5px 30px ;
    border: 2px solid #fd2d01;
    border-radius: 10px;
    background: #ffd7d7;
    font-size: 1rem;
    cursor: pointer;
}
.comment {
    border: 2px solid #000000;
    border-radius: 20px;
    margin-bottom: 20px;
}
.comment-info,
.comment-content {
    padding: 0 30px 0 30px;
}
.imgPost {
    width: 70%;
    margin: auto;
    border-radius: 30px;
}
.content .imgPost {
    margin-top: 10px;
}
.photo-profil {
    width: 50px;
    height: 50px;
    border: 2px solid #fd2d01;
    border-radius: 30px;
}
/*--------------------*/
@media screen and (min-width:768px) {
    .blockRespo{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .blockRespoText{
        display: flex;
        flex-direction: column;
        margin: 20px;
    }
    .header,
    .content {
        width: 98%;
    }
    section{
        width: 95%;
    }
    .modif{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .button {
        width: 50%;
    }
    .imgPost {
        width: 20%;
        height: 30%;
        margin: 20px;
        border-radius: 30px;
    }
    .createcomment {
        width: 100%;
    }
}
</style>