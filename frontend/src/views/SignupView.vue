<template>
  <div>
    <Header />
    <div class="signup">
      <h1>Inscription</h1>
      <h2>Nous sommes ravis de vous accueillir chez Groupomania.</h2>
          <p>Pour vous inscrire, veuillez saisir les informations demandées</p>
      <form>
        <ul>
          <li>
            <input type="text" v-model="nom" placeholder="Nom" size="50" required aria-label="Nom">
          </li>
          <li>
            <input type="text" v-model="prenom" placeholder="Prénom" size="50" required aria-label="Prénom">
          </li>
          <li>
            <input type="email" v-model="email" placeholder="Adresse mail" size="50" required aria-label="Email">
          </li>
          <li>
            <input type="password" v-model="password" placeholder="Mot de passe" size="50" required aria-label="Mot de passe">
          </li>
        </ul>
      </form>   
      <button @click.prevent="signup()" type="submit" aria-label="Inscription" class="btnSave"><i class="fas fa-edit"></i> Enregistrer </button>
    </div>
    <Footer />
  </div>
</template>


<script>
import axios from 'axios'
import Header from "../components/HeaderCompo";
import Footer from "../components/FooterCompo";
export default {
name: 'SignupView',
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
    //SIGNUP
    signup() {
      let data = {
          nom: this.nom,
          prenom: this.prenom,
          email: this.email,
          password: this.password
      };
      {   
      axios.post("http://localhost:3000/api/auth/signup", data, {
          headers: { }
      })
          .then(() => {
              alert("Inscription validée");
              this.$router.push("/login");
          })
          .catch(alert)
      }
    }
  }
}
</script>

<style scoped>
form{
    width: 80%;
    margin: 10px auto 10px auto;
}
h2{
color: black;
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
  margin: 0 auto 0 auto;
}
input {
  width: 90%;
  font-size: 1.2rem;
  text-align: center;
  margin: 15px auto 15px auto;
}
.signup {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
footer{
  padding: 0;
}
::placeholder {
  text-align: center;
  }
/*------------ desktop-----------------*/
@media screen and (min-width: 950px) {
  input {
  width: 50%;
  font-size: 1.2rem;
  text-align: center;
}
}
</style>