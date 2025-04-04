<script>
  import { Link } from 'svelte-routing';
  import { marked } from "marked";
  import { onMount } from "svelte";

  let planIA = "";
  let loading = false;
  let entrainements = [];

  function renderMarkdown(text) {
    return marked.parse(text); 
  }

  onMount(async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("Vous devez être connecté pour voir vos entraînements.");
    navigate("/connexion"); 
    return;
  }

  try {
    const res = await fetch(`http://localhost:4201/user/entrainement/${userId}`);
    if (res.ok) {
      const data = await res.json();
      entrainements = data.map((e, index) => ({
        id: e._id || index,
        titre: e.nom,
        contenu: e.exercices.map(ex => `- ${ex.nom} : ${ex.series} séries x ${ex.repetitions} reps`).join("\n")
      }));
    } else {
      console.error("Erreur de récupération des entraînements.");
    }
  } catch (err) {
    console.error("Erreur réseau :", err);
  }
});


  async function genererAvecIA() {
    loading = true;
    planIA = "";

    try {
      const payload = {
        objectif: "Perdre du poids",
        experience: "Débutant",
        type: "Full Body"
      };

      const res = await fetch("http://localhost:3001/api/generer-entrainement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      planIA = data.answer || "Une erreur est survenue.";

      entrainements = [
        ...entrainements,
        { id: Date.now(), titre: "Plan IA", contenu: planIA }
      ];
    } catch (error) {
      console.error("Erreur:", error);
      planIA = "Erreur lors de la génération du plan.";
    } finally {
      loading = false;
    }
  }
</script>


<style>
  .container {
    display: flex;
    height: 100%;
    padding: 30px;
    gap: 30px;
    color: white;
  }

  .sidebar {
    width: 280px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .content {
    flex: 1;
  }

  button {
    padding: 12px 20px;
    background: #18a888;
    border: none;
    color: white;
    font-size: 1em;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
    width: 100%;
    text-align: left;
  }

  button:hover {
    background: white;
    color: #18a888;
  }

  .plan-item {
    background: #222;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 15px;
  }

  h2 {
    color: #18a888;
  }

  .retour {
    font-size: 1em;
    margin-bottom: 20px;
    color: #18a888;
    cursor: pointer;
  }

  .message-erreur {
    color: red;
    font-weight: bold;
    margin-top: 50px;
  }
</style>

<div class="container">
  <!-- Colonne gauche -->
  <div class="sidebar">
    <Link to="/tableau-de-bord" class="retour">← Retour</Link>

    <Link to="/ajout-exercice">
      <button>Créer un programme</button>
    </Link>

    <Link to="/exercices-debutant">
      <button>Ajouter programme déjà fait</button>
    </Link>

    <button on:click={genererAvecIA} disabled={loading}>
      {#if loading}
        Génération en cours...
      {:else}
        Générer avec l'IA
      {/if}
    </button>
  </div>

  <!-- Colonne droite -->
  <div class="content">
    {#if !localStorage.getItem("userId")}
      <p class="message-erreur">
        Vous devez être connecté pour voir vos entraînements.<br />
        <Link to="/connexion" style="color:#18a888; text-decoration: underline">Se connecter</Link>
      </p>
    {:else}
      <h2>Vos entraînements :</h2>

      {#if entrainements.length === 0}
        <p>Aucun entraînement pour le moment.</p>
      {:else}
        {#each entrainements as entrainement (entrainement.id)}
          <div class="plan-item">
            <h3>{entrainement.titre}</h3>
            {@html renderMarkdown(entrainement.contenu)}
          </div>
        {/each}
      {/if}
    {/if}
  </div>
</div>

