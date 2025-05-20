<script>
  import { Link, navigate } from 'svelte-routing';
  import { marked } from "marked";
  import { onMount } from "svelte";
  import { logout, user } from "./common/auth";

  let planIA = "";
  let loading = false;
  let entrainements = [];
  let isConnected = false;
  let entrainementSelectionne = null;
  let poidsUnit = "kg";
  let suiviDate = new Date().toISOString().split("T")[0];
  let currentUser = $user;
  

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
    chargerEntrainements();

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
        contenu: e.exercices.map(ex => `- ${ex.nom} : ${ex.series} séries x ${ex.repetitions === -1 ? 'AMRAP' : ex.repetitions} reps`).join("\n")
      }));
    })
    .catch(err => {
      console.error("Erreur réseau :", err);
    });
  });

  async function genererAvecIA() {
    loading = true;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:4201/user/generer-entrainement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({})
      });

      const data = await res.json();
      console.log("Réponse IA brute :", data);

      if (!res.ok || !Array.isArray(data.entrainements)) {
        throw new Error("Format de données IA invalide");
      }

      for (const plan of data.entrainements) {
        if (!plan.exercices || plan.exercices.length === 0) continue; 
        const saveRes = await fetch("http://localhost:4201/user/entrainement", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            nom: plan.nom,
            exercices: plan.exercices
          })
        });

        if (!saveRes.ok) {
          console.error(`Erreur lors de l’enregistrement de "${plan.nom}"`);
        }
      }
      await chargerEntrainements();
      navigate("/plan-entrainement");
    } catch (err) {
      console.error("Erreur IA :", err);
      alert("Erreur lors de la génération ou l'enregistrement.");
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
          Authorization: `Bearer ${token}`,
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

  function modifierEntrainement(entrainement) {
    localStorage.setItem("routine_a_modifier", JSON.stringify({
      id: entrainement.id,
      titre: entrainement.titre,
      contenu: entrainement.contenu
    }));
    navigate("/ajout-exercice");
  }

  function ouvrirFormulaire(entrainementId, titre, contenu) {
    entrainementSelectionne = {
      id: entrainementId,
      titre,
      contenu: contenu.split("\n").map(line => {
        const [nomPartiel, desc] = line.split(" : ");
        const [seriesCount] = desc.match(/\d+/g);
        return {
          nom: nomPartiel.replace("- ", "").trim(),
          series: Array.from({ length: parseInt(seriesCount) }, () => ({ charge: '', repetitions: '' }))
        };
      })
    };
  }
  async function chargerEntrainements() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:4201/user/entrainement", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    entrainements = data.map((e, index) => ({
      id: e._id || index,
      titre: e.nom,
      contenu: e.exercices.map(ex => `- ${ex.nom} : ${ex.series} séries x ${ex.repetitions} reps`).join("\n")
    }));
  } catch (err) {
    console.error("Erreur lors du chargement :", err);
  }
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

      alert("Suivi enregistré ");
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

  .dashboard-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 10px;
}

.dashboard-header h1 {
  font-size: 2.4rem;
  color: #18a888;
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: 1px;
}

.ligne-verte {
  height: 4px;
  width: 80px;
  background-color: #18a888;
  margin: 0 auto;
  border-radius: 6px;
}


  
button {
  box-shadow: 0 0 10px rgba(24, 168, 136, 0.15);
}
button:hover {
  box-shadow: 0 0 20px rgba(24, 168, 136, 0.3);
}

.ligne-verte {
  height: 4px;
  background-color: #18a888;
  border-radius: 4px;
  margin: 10px 0 25px;
  width: 100%;
}


  

.page-container {
  background-color: #181818;
  color: white;
  min-height: 100vh;
  padding: 40px;
}

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
  padding: 20px;
  border: 2px solid #18a888;
  border-radius: 20px;
  align-self: flex-start; 
  background-color: #181818;
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
  background-color: #2b2b2b;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(24, 168, 136, 0.2);
  margin-bottom: 20px;
  position: relative;
  color: white;
  transition: box-shadow 0.3s;
}

.plan-item:hover {
  box-shadow: 0 0 25px rgba(24, 168, 136, 0.4);
}

.plan-item h3 {
  color: #18e0a8;
  font-size: 1.3em;
  margin-bottom: 10px;
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
<div class="page-container">
  <div class="container">
  <!-- Colonne gauche -->
  <div class="sidebar">
   
    <button
  on:click={() => navigate('/')}
  style="padding: 10px 18px; background-color: #333; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;"
>
  ⬅️ Retour à l'accueil
</button>

    <Link to="/ajout-exercice">
      <button>Créer un programme</button>
    </Link>

    <Link to="/programme-auto">
      <button>Ajouter un programme déjà fait</button>
    </Link>

    <button on:click={genererAvecIA} disabled={loading}>
      {#if loading}
        Génération en cours...
      {:else}
        Générer votre programme  {currentUser?.entrainement} avec l'IA 
      {/if}
    </button>

    <!-- {#if isConnected}
      <button on:click={seDeconnecter} style="margin-top: auto; background: red;">
        Se déconnecter
      </button>
    {/if} -->
  </div>

  <!-- Colonne droite -->
<div class="content">
  {#if !isConnected}
    <p class="message-erreur">
      Vous devez être connecté pour voir vos entraînements.<br />
      <Link to="/connexion" style="color:#18a888; text-decoration: underline">Se connecter</Link>
    </p>
  {:else}
    <div class="dashboard-header">
  <h1>📋 Vos entraînements</h1>
  <div class="ligne-verte"></div>
</div>
    {#if entrainements.length === 0}
      <p>Aucun entraînement pour le moment.</p>
    {:else}
    {#each entrainements as entrainement (entrainement.id)}
  <div class="plan-item">
    <h3>{entrainement.titre}</h3>
    {@html renderMarkdown(entrainement.contenu)}

    <!-- Boutons actions -->
    <button
  on:click={() => modifierEntrainement(entrainement)}
  style="margin-top: 10px; background: orange;"
>
  Modifier
</button>


    <button
      on:click={() => supprimerEntrainement(entrainement.id)}
      style="background: #cc0000; margin-top: 10px;"
    >
      Supprimer
    </button>

    <button
      on:click={() => ouvrirFormulaire(entrainement.id, entrainement.titre, entrainement.contenu)}
      style="margin-top: 10px;"
    >
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
        <!--<option value="lbs">lbs</option>-->
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
</div>


 