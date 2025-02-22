<script>
    export let fermerInscription; 
  
    let nom = "";
    let email = "";
    let password = "";
  
    function inscrire() {
      if (!nom || !email || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
      }
  
      alert("Inscription réussie ! Redirection en cours...");
  
      setTimeout(() => {
        fermerInscription(); 
      }, 750);
    }
  </script>
  
  <style>
  
    .form-content {
      background: #222;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0px 4px 10px rgba(24, 168, 136, 0.5);
      width: 320px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      top: 12%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  
    .form-content h2 {
      color: #18a888;
      margin-bottom: 20px;
    }
  
    .form-content input {
      width: 300px;
      padding: 10px;
      margin: 10px 0;
      border: none;
      border-radius: 5px;
    }
  
    .form-content button {
      width: 100%;
      padding: 10px;
      background: #18a888;
      border: none;
      color: white;
      font-size: 1.2em;
      border-radius: 5px;
      cursor: pointer;
      transition: 0.3s;
    }
  
    .form-content button:hover {
      background: white;
      color: #18a888;
    }
  </style>
  
  <div class="form-content">
      <h2>Inscription</h2>
      <form on:submit|preventDefault={inscrire}>
          <input type="text" bind:value={nom} placeholder="Nom complet" required>
          <input type="email" bind:value={email} placeholder="Email" required>
          <input type="password" bind:value={password} placeholder="Mot de passe" required>
          <button type="submit">S'inscrire</button>
      </form>
      <button on:click={fermerInscription} style="margin-top: 10px; background: red;">Annuler</button>
  </div>
  
