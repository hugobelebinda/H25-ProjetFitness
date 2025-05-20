<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { Link } from "svelte-routing";
  import { login, user } from './common/auth';
  

  let email = "";
  let password = "";
  let message = "";
  let messageType = "";

  let isLoggedIn = false;

  onMount(() => {
    const unsubscribe = user.subscribe(u => {
      if (u && isLoggedIn) {
        navigate("/");
      }
    });
    return unsubscribe;
  });

  async function connecter() {
    message = "";
    messageType = "";
    isLoggedIn = false;

    if (!email || !password) {
      message = "Veuillez remplir tous les champs.";
      messageType = "error";
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
        localStorage.setItem("user", JSON.stringify(data.user));
        message = "Connexion réussie !";
        messageType = "success";
        isLoggedIn = true;

        // Redirection après 1.5 seconde
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        message = data.message || "Erreur inconnue";
        messageType = "error";
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      message = "Une erreur s'est produite.";
      messageType = "error";
    }
  }
</script>



  
  <style>
  .message {
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  width: 100%;
  text-align: center;
  transition: all 0.3s ease-in-out;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
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

    {#if message}
      <div class="message {messageType}">
        {message}
      </div>
    {/if}
  </div>
</div>

  