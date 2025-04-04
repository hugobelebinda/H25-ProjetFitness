<script>
  import { navigate } from "svelte-routing";
  import { Link } from "svelte-routing";

  let nom = "";
  let nomFamille = "";
  let username = "";
  let email = "";
  let password = "";
  let message = "";

  async function inscrire() {
    if (!nom || !nomFamille || !username || !email || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4201/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nom,
          nomFamille,
          username,
          email,
          motDePasse: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        message = "✅ Inscription réussie ! Redirection en cours...";
        console.log("Réponse du backend :", data);

        setTimeout(() => {
          navigate("/connexion");
        }, 1500);
      } else {
        message = `❌ Erreur : ${data.message || "Une erreur est survenue."}`;
        console.error(data);
      }
    } catch (error) {
      message = "❌ Erreur réseau, réessayez plus tard.";
      console.error("Erreur réseau :", error);
    }
  }
</script>

<style>
  .page-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("https://images.unsplash.com/photo-1544033527-b192daee1f5b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZHVtYmVsbHN8ZW58MHx8MHx8fDA%3D") no-repeat center center/cover;
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

  .lien-connexion {
    margin-top: 15px;
    font-size: 14px;
    color: white;
  }
</style>

<div class="page-background">
  <div class="form-content">
    <h2>Inscription</h2>
    <form on:submit|preventDefault={inscrire}>
      <input type="text" bind:value={nom} placeholder="Prénom" required />
      <input type="text" bind:value={nomFamille} placeholder="Nom de famille" required />
      <input type="text" bind:value={username} placeholder="Nom d'utilisateur" required />
      <input type="email" bind:value={email} placeholder="Email" required />
      <input type="password" bind:value={password} placeholder="Mot de passe" required />
      <button type="submit">S'inscrire</button>
    </form>

    {#if message}
      <p style="margin-top: 10px; color: white;">{message}</p>
    {/if}

    <button on:click={() => navigate("/")} style="margin-top: 10px; background: red;">
      Annuler
    </button>
    
    <p class="lien-connexion">
      Déjà inscrit ? <Link to="/connexion">Connectez-vous</Link>
    </p>
  </div>
</div>
