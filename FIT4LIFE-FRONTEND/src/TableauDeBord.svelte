<script>
  import { Link } from "svelte-routing";
  import { onMount } from 'svelte';
  import { user } from './common/auth'; // store utilisateur

  let suivis = [];
  let loading = true;

  onMount(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:4201/user/suivi", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      suivis = data;
    } catch (err) {
      console.error("Erreur récupération des suivis :", err);
    } finally {
      loading = false;
    }
  });

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  }

  async function supprimerPoids(id) {
    const confirmation = confirm("Supprimer cette entrée de poids ?");
    if (!confirmation) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:4201/user/poids-historique/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      const data = await res.json();
user.set(data.user); 


      alert("Poids supprimé !");
    } catch (err) {
      console.error(err);
      alert("Erreur pendant la suppression du poids.");
    }
  }

  async function supprimerSuivi(id) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce suivi ?");
    if (!confirmation) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:4201/user/suivi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error("Échec de la suppression");

      suivis = suivis.filter(s => s._id !== id);
    } catch (err) {
      console.error(err);
      alert("Erreur pendant la suppression du suivi.");
    }
  }
</script>


<style>
  /* Titre principal */
.dashboard-container h1 {
  color: #fff !important;
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

/* Sous-titres des colonnes */
.journal-column h2 {
  color: #fff !important;
  font-size: 1.5em;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
 .dashboard-container {
  background-color: #0e0e0e;
  padding: 40px 20px 20px 20px;
  text-align: center;
}

.journal-container {
  background-color: #0e0e0e;
  padding: 0 20px 40px 20px;
  width: 100%;
  margin: 0 auto;
}

.columns {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.journal-column {
  flex: 1;
  min-width: 340px;
  max-width: 600px;
}


.journal-card {
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 0 20px rgba(24, 224, 168, 0.2);
  margin-bottom: 20px;
  position: relative;
  color: white;
  transition: box-shadow 0.3s;
}

.journal-card:hover {
  box-shadow: 0 0 25px rgba(24, 224, 168, 0.35);
}

.journal-card strong {
  color: #18e0a8;
  font-size: 1.1em;
  display: block;
  margin-bottom: 10px;
}

.journal-card em {
  color: #b3fce3;
  font-style: italic;
}

ul {
  padding-left: 20px;
  text-align: left;
}

.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #ccc;
  font-size: 1.2em;
  cursor: pointer;
}

p {
  color: #ccc;
}



</style>

<div class="dashboard-container">
  <h1>📊 Journal de Bord</h1>
  <Link to="/">
    <button class="add-button">🏠 Retour à l'accueil</button>
  </Link>
</div>

<div class="journal-container">
  <div class="columns">
    <!-- Colonne Journal des entraînements -->
    <div class="journal-column">
      <h2>📓 Journal des entraînements</h2>
      {#if loading}
        <p>⏳ Chargement en cours...</p>
      {:else if suivis.length > 0}
        {#each suivis as suivi}
          <div class="journal-card">
            <button class="delete-button" on:click={() => supprimerSuivi(suivi._id)}>🗑️</button>
            <strong>{formatDate(suivi.date)}</strong>
            {#each suivi.exercices as exo}
              <div style="margin-top: 5px;">
                <em>{exo.nom}</em>
                <ul>
                  {#each exo.series as s, i}
                    <li>Série {i + 1} : {s.charge} {s.unite} × {s.repetitions} reps</li>
                  {/each}
                </ul>
              </div>
            {/each}
          </div>
        {/each}
      {:else}
        <p>Aucun suivi enregistré pour l’instant.</p>
      {/if}
    </div>
    <!-- Colonne Historique des poids -->
    <div class="journal-column">
      <h2>⚖️ Historique des poids</h2>
      {#if $user?.poidsHistorique?.length > 0}
        {#each $user.poidsHistorique as p}
          <div class="journal-card">
            <strong>{new Date(p.date).toLocaleDateString('fr-FR')}</strong>
            <p>Poids : {p.poids} kg</p>
            <button class="delete-button" on:click={() => supprimerPoids(p._id)}>🗑️</button>
          </div>
        {/each}
      {:else}
        <p>Aucune donnée de poids enregistrée.</p>
      {/if}
    </div>
  </div>
</div>
