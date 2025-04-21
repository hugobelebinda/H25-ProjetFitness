<script>
import { Link, navigate } from 'svelte-routing';
  import { marked } from "marked";
  import { onMount } from "svelte";
  import { logout } from "./common/auth";
  let planIA = "";
  let loading = false;
  let entrainements = [];
  let isConnected = false;
  let suiviEnCours = null;
  let entrainementSelectionne = null;
  let poidsUnit = "kg"; // ou "lbs"
  let suiviDate = new Date().toISOString().split("T")[0]; 


  function renderMarkdown(text) {
    return marked.parse(text); 
  }

  onMount(() => {
    const token = localStorage.getItem("token");
    isConnected = !!token;

    if (!token) {
      alert("Vous devez être connecté pour voir vos entraînements.");
      navigate("/connexion");
      return;
    }

    fetch("http://localhost:4201/user/entrainement", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        entrainements = data.map((e, index) => ({
          id: e._id || index,
          titre: e.nom,
          contenu: e.exercices.map(ex => `- ${ex.nom} : ${ex.series} séries x ${ex.repetitions} reps`).join("\n")
        }));
      })
      .catch(err => {
        console.error("Erreur réseau :", err);
      });
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

  async function supprimerEntrainement(id) {
  const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet entraînement ?");

  if (!confirmation) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`http://localhost:4201/user/entrainement/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("Échec de la suppression");

  
    entrainements = entrainements.filter(e => e.id !== id);
  } catch (err) {
    console.error(err);
    alert("Une erreur est survenue pendant la suppression.");
  }
}

function ouvrirFormulaire(entrainementId, titre, contenu) {
  entrainementSelectionne = {
    id: entrainementId,
    titre,
    contenu: contenu.split("\n").map(line => {
      const [nomPartiel, desc] = line.split(" : ");
      const [seriesCount, repsCount] = desc.match(/\d+/g);
      return {
        nom: nomPartiel.replace("- ", "").trim(),
        series: Array.from({ length: parseInt(seriesCount) }, () => ({ charge: '', repetitions: '' }))
      };
    })
  };
}

async function envoyerSuivi() {
  const token = localStorage.getItem("token");

  const body = {
    entrainementId: entrainementSelectionne.id,
    date: suiviDate,
        exercices: entrainementSelectionne.contenu.map(exo => ({
      nom: exo.nom,
      series: exo.series.map(s => ({
        charge: parseFloat(s.charge),
        repetitions: parseInt(s.repetitions),
        unite: poidsUnit
      }))
    }))
  };

  try {
    const res = await fetch("http://localhost:4201/user/suivi", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("Erreur serveur");

    alert("Suivi enregistré ✅");
    entrainementSelectionne = null;
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l’enregistrement du suivi");
  }
}


  function seDeconnecter() {
    logout();
    navigate("/connexion");
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

  label {
  display: inline-block;
  margin-top: 5px;
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

    {#if isConnected}
      <button on:click={seDeconnecter} style="margin-top: auto; background: red;">
        Se déconnecter
      </button>
    {/if}
  </div>

  <!-- Colonne droite -->
<div class="content">
  {#if !isConnected}
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
      
      <!-- Bouton supprimer -->
      <button on:click={() => supprimerEntrainement(entrainement.id)} style="background: #cc0000; margin-top: 10px;">
        Supprimer
      </button>
  
      <!-- Bouton suivi -->
      <button on:click={() => ouvrirFormulaire(entrainement.id, entrainement.titre, entrainement.contenu)} style="margin-top: 10px;">
        Je viens de faire cet entraînement
      </button>
    </div>
  {/each}

  {#if entrainementSelectionne}
  <div class="plan-item" style="margin-top: 30px;">
    <h3>Suivi : {entrainementSelectionne.titre}</h3>

    <label style="margin-top: 10px; display: block;">
      Date de l'entraînement :
      <input type="date" bind:value={suiviDate} />
    </label>
    
    <label>Unité :
      <select bind:value={poidsUnit}>
        <option value="kg">kg</option>
        <option value="lbs">lbs</option>
      </select>
    </label>

    {#each entrainementSelectionne.contenu as exercice, i}
      <div style="margin-top: 10px;">
        <h4>{exercice.nom}</h4>
        {#each exercice.series as serie, j}
  <div style="margin-bottom: 8px;">
    <strong>Série {j + 1}</strong>
    <div style="margin-left: 10px;">
      <label>
        Poids :
        <input
          type="number"
          min="0"
          step="0.5"
          placeholder="ex: 50"
          bind:value={exercice.series[j].charge}
          style="width: 70px;"
        />
        {poidsUnit}
      </label>

      <label style="margin-left: 20px;">
        Répétitions :
        <input
          type="number"
          min="0"
          step="1"
          placeholder="ex: 10"
          bind:value={exercice.series[j].repetitions}
          style="width: 70px;"
        />
      </label>
    </div>
  </div>
{/each}

      </div>
    {/each}

    <button on:click={envoyerSuivi} style="margin-top: 15px;">Valider le suivi</button>
    <button on:click={() => (entrainementSelectionne = null)} style="margin-top: 10px; background: #444;">
      Annuler
    </button>
  </div>
{/if}

    {/if}
  {/if} 
</div>
</div> 


 