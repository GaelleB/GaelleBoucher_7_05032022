<template>
  <div>
    <Header />
    <div class="signup">
      <h1>Inscription</h1>
      <h2>Bienvenue chez Groupomania</h2>
      <p>Veillez saisir les informations demandées</p>
      <form>
        <ul>
          <li>
            <input type="text" v-model="nom" placeholder="dupont" size="50" required aria-label="Nom">
          </li>
          <li>
            <input type="text" v-model="prenom" placeholder="jean" size="50" required aria-label="Prénom">
          </li>
          <li>
            <input type="email" v-model="email" placeholder="jean.dupont@groupomania.com" size="50" required aria-label="Email">
          </li>
          <li>
            <input type="password" v-model="password" placeholder="Pass2word" size="50" required aria-label="Mot de passe">
            
          
          </li>
        </ul>
      </form>   
      <button @click.prevent="signup()" type="submit" aria-label="Inscription" class="btnSave"><i class="fas fa-edit"></i> Enregistrer </button>
    </div>
    <Footer />
  </div>
</template>


<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
export default {
  name: Signup,
  components: {
    Header,
    Footer
  },
  data() {
    return {
      nom: '',
      prenom: '',
      email: '',
      password: '',
    }
  },
  methods: {
    signup() {
      let data = {
        
        nom: this.nom,
        prenom: this.prenom,
        email: this.email,
        password: this.password
      };
    }
  }
  }
</script>


<style scoped>
form{
    width: 80%;
    
}
h2{
color:rgb(5, 5, 100);
}
p{
  font-size: 12px;
  margin: 0;
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
input {
  font-size: 1.2rem;
  text-align: center;
}
/*
.btnSave{
    background-color: rgb(105, 206, 105);
}
*/
.signup {
  display: flex;
  flex-direction: column;
  align-items: center;
}
footer{
  padding: 0;
}
::placeholder {
  text-align: center;
  }
</style>