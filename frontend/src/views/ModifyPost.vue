<template>
    <div>
        <HeaderProfile/>
            <section>
                <h1>Modification de votre publication</h1>
                <p>Vous pouvez modifier l'image et le contenu de la publication</p>
                <form>
                    <ul>
                        <li>
                            <label for="titre" aria-label="Titre">Titre</label>
                            <input class="title" type="text" v-model="post.title" required aria-label="Titre" disabled size="50" >
                        </li>
                        <li>
                            <label for="content" aria-label="Publication">Publication</label>
                            <textarea v-model="post.content" placeholder="Vous pouvez modifier la publication..." rows="10" cols="60" required aria-label="Message du post"></textarea>
                        </li>
                        <li v-if="post.image">
                            <img :src="post.image" alt="Image du post" class="file" width="200px" height="200px">
                        </li>
                        <li> 
                            <label v-if="post.image " for="file" class="button" aria-label="Choisir une photo pour ce post">Modifier l'image</label>
                            <button v-else @click="deletefile()" class="label-file btnDelete" aria-label="Supprimer cette photo du post"> Supprimer l'image</button>    
                            <input type="file" accept=".jpeg, .jpg, .png, .webp, .gif" v-on:change="imgPost" id="file" class="input-file" aria-label="Image du post">
                        </li>
                    </ul>
                </form>
                <button @click="modifyPost()" class="btnSave" aria-label="Modifier ce post"><i class="fas fa-edit"></i> Enregistrer</button>
            </section>
            <div>
                <router-link :to="`/post/${id_param}`" class="btnDelete" aria-label="Retour au fil d'actualité"><i class="fas fa-comment-slash"></i> Annuler</router-link>
            </div>
            <div>
                <router-link to="/allposts" aria-label="Retour vers Le fil d'actu de Groupomania"><i class="fas fa-home home"></i></router-link>
            </div>
        <Footer/>
    </div>
</template>

<script>
import axios from 'axios';
import HeaderProfile from "../components/HeaderProfile";
import Footer from "../components/FooterCompo";
export default {
    name: 'ModifyPost',
    components: {
        HeaderProfile,
        Footer
    },
    data () {
        return {
            id_param: this.$route.params.id,
            post: [],
            createdAt: '',
            updatedAt:'',
            preview: null,
            button : false
        }
    },
    methods: {
        show: function () {
            return this.button = true;
        },
        User() {
            this.id = localStorage.getItem("Id")
            this.role = localStorage.getItem("role")
        },

        // Affichage d'un post
        getOnePost() {
            const token = localStorage.getItem("token")
            const fileField = document.querySelector('input[type="file"]');                                             
            axios.get(`http://localhost:3000/api/posts/${this.id_param}`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
            .then((res) => {
                console.log(res.data);
                this.posts = res.data;
                this.post.title = res.data.title;
                this.post.image = fileField.files[0];
                this.post.createdAt = res.data.createdAt;
                this.post.updatedAt = res.data.updatedAt;
            })
            .catch(() => console.log('Impossible de récupérer les posts !'))
        },

        // Modification d'un post
        modifyPost() {
            const token = localStorage.getItem("token")
            const fileField = document.querySelector('input[type="file"]');
            
            if (confirm("Voulez-vous vraiment modifier ce post?") === true);
            if (this.post.title === "")
                alert("Veuillez saisir le titre");
            if (this.post.content === "")
                alert("Veuillez saisir votre message");
            if (this.post.image === null && this.post.title != "" && this.post.content != "") {
                let data = new FormData()
                data.append('image', '')
                data.append('content', this.post.content)
                axios.put(`http://localhost:3000/api/posts/${this.id_param}`, data,  {
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: data
                })
                .then((res) => {
                    alert("Modification du post sans image réussie")
                    console.log("Modification du post sans image réussie");
                    this.posts = res.data
                    this.$router.push("/allposts");
                })
                .catch(() =>{ 
                    alert("Non autorisé à modifier ce post!!");
                    console.log('Non autorisé à modifier ce post!!')
                } )
            } else if (this.post.title != "" && this.post.content != "") {
                let data = new FormData()
                data.append('image', fileField.files[0])
                data.append('content', this.post.content)
                axios.put(`http://localhost:3000/api/posts/${this.id_param}`, data ,{
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: data
                })
                .then((res) => {
                    console.log(res.data);

                    this.posts = res.data;
                    this.post.content = res.data.content;
                    this.post.image = res.data.image;
                    this.post.createdAt = res.data.createdAt;
                    this.post.updatedAt = res.data.updatedAt;

                    alert("Modification du post avec image réussie");
                    console.log("modification ok");

                    this.posts = res.data
                    this.$router.push("/allposts");
                })
                    
                .catch(() =>{ 
                    alert("Non autorisé à modifier ce post!!");
                    console.log('Non autorisé à modifier ce post!!')
                })
            }
        },
        
        // Date 
        dateFormat (updatedDate) {
            const date = new Date(updatedDate)
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'};
            return date.toLocaleDateString('fr-FR', options);
        },
        hourFormat (updatedHour) {
            const hour = new Date(updatedHour)
            const options = { hour: 'numeric', minute:'numeric', second:'numeric'};
            return hour.toLocaleTimeString('fr-FR', options);
        },
    },
        mounted () {
            this.getOnePost()
        }
}
</script>

<style scoped>
label {
    font-size: 16px;
    color:rgb(5, 5, 100);
}
.title{
    width: 60%;
    height: 30px;
    text-align: center;
    margin: 0 auto 0 auto;
    font-size: 20px;
    font-weight: bolder;
}
form{
    width: 80% ; 
    margin: auto;
}
ul {
    
    
    list-style: none;
    padding: 0;
}
li {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-bottom: 30px;
}
.title{
    width: 60%;
    height: 30px;
    margin-top: 10px;
    color: #000000;
    text-align: center ;
    font-size: 20px;
    font-weight: bolder;
}
textarea {
    font-size: 1.2rem;
}
.input-file {
    display: none;
}
.lien {
    text-decoration: none;
    color: #000000;
}
img {
    width: 70%;
    border-radius: 30px;
    margin: auto;
}
.btnDelete{
    margin-top: 20px;
}
.btnSave{
    margin-top:0;
    margin-bottom: 10px;
}
@media screen and (min-width:768px) {
.btnDelete{
    width: 20%;
    margin: auto;
}
}
</style>