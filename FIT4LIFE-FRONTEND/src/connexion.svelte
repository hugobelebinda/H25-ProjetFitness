<script>
    import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { Link } from "svelte-routing";
  import { login, user } from './common/auth';

  let email = "";
  let password = "";

  onMount(() => {
    const unsubscribe = user.subscribe(u => {
      if (u) navigate("/");
    });
    return unsubscribe;
  });

  async function connecter() {
    if (!email || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4201/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, motDePasse: password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        login(data.user, data.token);
        alert("Connexion réussie !");
        navigate("/");
      } else {
        alert("Erreur de connexion : " + (data.message || "Erreur inconnue"));
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Une erreur s'est produite.");
    }
  }
  /*import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { Link } from "svelte-routing";
  import { login, user } from './common/auth'; // ✅ Import du store

  let email = "";
  let password = "";

  onMount(() => {
      const unsubscribe = user.subscribe(u => {
          if (u) {
              navigate("/"); // Redirige si déjà connecté
          }
      });
      return unsubscribe;
  });

  async function connecter() {
      if (!email || !password) {
          alert("Veuillez remplir tous les champs.");
          return;
      }

      try {
          const response = await fetch("http://localhost:4201/user/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, motDePasse: password })
          });

          const data = await response.json();

          if (response.ok) {
              alert("Connexion réussie ! Redirection en cours...");
              console.log("User data:", data);

              login(data.user); 
              localStorage.setItem("token", data.token); 
localStorage.setItem("userId", data.user._id);



              setTimeout(() => {
                  navigate("/");
              }, 750);
          } else {
              alert("Erreur de connexion : " + (data.message || "Erreur inconnue"));
          }

      } catch (error) {
          console.error("Erreur lors de la connexion :", error);
          alert("Une erreur s'est produite. Veuillez réessayer.");
      }
  } */
</script>

  
  <style>
    .page-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url("https://t3.ftcdn.net/jpg/04/29/35/62/360_F_429356296_CVQ5LkC6Pl55kUNLqLisVKgTw9vjyif1.jpg") no-repeat center center/cover;
      background-size: cover;
      background-position: center;
    }
  
    .form-content {
      background: #222;
      padding: 25px;
      border-radius: 10px;
      box-shadow: 0px 4px 10px rgba(24, 168, 136, 0.5);
      width: 350px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  
    .form-content h2 {
      color: #18a888;
      margin-bottom: 20px;
    }
  
    .form-content input {
      width: 100%;
      padding: 12px;
      margin: 10px 0;
      border: none;
      border-radius: 5px;
      font-size: 16px;
    }
  
    .form-content button {
      width: 100%;
      padding: 12px;
      background: #18a888;
      border: none;
      color: white;
      font-size: 1.2em;
      border-radius: 5px;
      cursor: pointer;
      transition: 0.3s;
      margin-top: 10px;
    }
  
    .form-content button:hover {
      background: white;
      color: #18a888;
    }
  
    .annuler {
      background: red;
      margin-top: 15px;
    }
  
    .lien-connexion {
      margin-top: 15px;
      font-size: 14px;
      color: white;
    }
  </style>
  
  <div class="page-background">
    <div class="form-content">
      <h2>Connexion</h2>
      <form on:submit|preventDefault={connecter}>
        <input type="email" bind:value={email} placeholder="Email" required />
        <input type="password" bind:value={password} placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
      </form>
  
      <button class="annuler" on:click={() => navigate("/")} style="margin-top: 10px; background: red;">
        Annuler
      </button>
  
      <p class="lien-connexion">
        Pas encore inscrit ? <Link to="/inscription">Créez un compte</Link>
      </p>
    </div>
  </div>
  