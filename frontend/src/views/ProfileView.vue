<template>
    <div>
        <HeaderProfile/>
        <div>
            <h1>Mon profil</h1>
            <form>
                <ul>
                    <li>
                        <input type="text" v-model="user.nom" placeholder="Nom" size="50" required aria-label="Nom de l'utilisateur">
                    </li>
                    <li>
                        <input type="text" v-model="user.prenom" placeholder="Prenom" size="50" required aria-label="Prénom de l'utilisateur">
                    </li>
                    <li>
                        <input type="email" v-model="user.email" placeholder="Email" size="50" required aria-label="Email de l'utilisateur">
                    </li>
                </ul>
            </form>
            <div class="submit">
                <button @click="modifyUser()" class="btnSave" aria-label="Modifier le compte"><i class="fas fa-edit"></i> Enregistrer</button>
                <button @click="deleteUser()" class="espacement btnDelete" aria-label="Supprimer le compte"><i class="far fa-trash-alt"></i> Supprimer le compte</button>
            </div>
        </div>
        <router-link to="/allposts" aria-label="Retour vers Le fil d'actu de Groupomania"><i class="fas fa-home home"></i></router-link>
        <Footer/>
    </div>
</template>

<script> 
import axios from 'axios'
import HeaderProfile from "../components/HeaderProfile";
import Footer from "../components/FooterCompo";
export default {
    name: 'ProfileView',
    components: {
        HeaderProfile,
        Footer
    },
    data() {
        return {
            posts: [],
            user: {
                id: '',
                nom: '',
                prenom: '',
                email: ''
            },
            preview: null,
            button : false
        }
    },
    mounted () {
        this.getOneUser();
    },
    methods: {
        show: function () {
            return this.button = true;
        },
        show2: function () {
            return this.displayPostsUser = true;
        },
        hide2: function () {
            return this.displayPostsUser = false;
        },
        User() {
            this.id = localStorage.getItem("Id")
            this.role = localStorage.getItem("role")
        },
        getOneUser() {
            const Id = localStorage.getItem("userId");
            const token = localStorage.getItem('token');
            axios.get(`http://localhost:3000/api/auth/profile/${Id}`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            }).then(res => {
                this.user.id = res.data.id;
                this.user.nom = res.data.nom;
                this.user.prenom = res.data.prenom;
                this.user.email = res.data.email;
            })
            .catch(() =>{ 
                alert("Non autorisé à supprimer ce message!")
                console.log('Non autorisé à supprimer ce message!')
            })
        },
        modifyUser() {
            const token = localStorage.getItem('token');
            const Id = localStorage.getItem("userId")
            const regexText = /^[a-zA-Z-\s]+$/;
            const regexEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/; 
            if (this.user.nom === "") {
                alert("Veuillez saisir votre nom");
            } else if (regexText.test(this.user.nom) === false) {
                alert("Veuillez vérifier que l'écriture de votre nom soit uniquement en lettre");}
            if (this.user.prenom === "") {
                alert("Veuillez saisir votre prénom");
            } else if (regexText.test(this.user.prenom) === false) {
                alert("Veuillez vérifier que l'écriture de votre prénom soit uniquement en lettre");}
            if (this.user.email === "") {
                alert("Veuillez saisir votre adresse email");
            } else if (regexEmail.test(this.user.email) === false) {
                alert("Veuillez saisir une adresse email valide");
            } else if ((regexText.test(this.user.nom) === true) && regexText.test(this.user.prenom) === true && regexEmail.test(this.user.email) === true === null) {
                axios.put(`http://localhost:3000/api/auth/profile/${Id}`, { 
                    headers: {
                        'authorization': `Bearer ${token}`,           
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((res) => {
                this.user = res.data;
                alert("Votre modification a bien été prise en compte")
                    this.$router.push("/profile");
                })
                .catch((err) => console.log(err))
        
            } else if ((regexText.test(this.user.nom) === true) && regexText.test(this.user.prenom) === true && regexEmail.test(this.user.email) === true != null) {
                let data = new FormData()
                data.append('nom', this.user.nom)
                data.append('prenom', this.user.prenom)
                data.append('email', this.user.email)
                axios.post(`http://localhost:3000/api/auth/profile/${Id}`, data,{
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: data
                })
                .then(() => {
                    alert("Profil modifié")
                    console.log("Profil modifié");
                    this.$router.push("/profile");
                })
                .catch(error => console.log(error))
            }
        },

        deleteUser() {
            const Id = localStorage.getItem("userId")
            if (confirm("Voulez-vous vraiment supprimer le compte?") == true) {
            const token = localStorage.getItem('token');
                axios.delete(`http://localhost:3000/api/auth/profile/${Id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(() => {
                    alert ("Compte supprimé")
                    console.log("Compte supprimé");
                    let publi = this.posts
                    for ( let i = 0 ; i < publi.length ; i++) {
                            axios.delete(`http://localhost:3000/api/posts/${publi[i].id}`, {
                                headers: {
                                    'authorization': `Bearer ${token}`,
                                    'Content-Type': 'multipart/form-data',
                                },
                            })
                            .then(() => {
                                alert("Compte suprimé")
                                console.log("Compte supprimé")
                                this.$router.push("/")
                            })
                            .catch(alert ("impossible de supprimer l'utilisateur"))
                    }
                })
                .then(() => {
                    axios.delete(`http://localhost:3000/api/auth/profile/${Id}`, {
                        headers: {
                            'Accept': 'application/json',
                            'authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        }
                    })
                        .then(response => response.json())
                        .then(() => { 
                            alert("La suppression du compte a bien été prise en compte")
                            localStorage.clear();
                        })
                        this.$router.push("/")
                })
                .catch(alert)
            }
        },

        mounted() {
            this.getOneUser()
        }
    }
}
</script>

<style scoped>
form{
    width: 100%;
    margin: auto;
}
ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
}
label {
    font-size: 15px;
}
li {
    display: flex;
    margin-top: 7px;
    flex-direction: column;
    align-items: center;
    width: 100%;
}
input {
    width: 31%;
    border-radius: 15px;
    font-size: 20px;
    text-align: center;
}
.modify{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 10px 0 10px;
    margin: auto;
    width: 70%;
}
.file {
    width: 200px;
    height: 200px;
    border: 2px solid black;
    border-radius: 100px;
    margin: auto;
}
.input-file {
    display: none;
}
.button {
    margin: 20px 0 0 0;
    padding: 5px 30px ;
    border: 2px solid black;
    border-radius: 15px;
    text-decoration: none;
    color: #000000;
    min-width: 220px;
    width: 40%;
    margin: 30px auto 15px auto;
    background: grey;
    font-size: 15px;
    cursor: pointer;
}
.espacement {
    margin-left: 10px;
}
.submit {
    margin-bottom: 30px;
}
.password {
    margin-top: 5px;
}
</style>