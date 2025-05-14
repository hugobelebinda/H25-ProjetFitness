<script>
  import { Link } from "svelte-routing";
  import { onMount } from 'svelte';

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
  :global(html, body) {
  background-color: #0e0e0e;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  color: white;
}

.dashboard-container {
  background-color: #0e0e0e;
  padding: 40px 20px;
  text-align: center;
}

h1 {
  color: #18e0a8;
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.add-button {
  margin-top: 20px;
  padding: 12px 24px;
  background: #18e0a8;
  border: none;
  color: black;
  font-size: 1.1em;
  font-weight: bold;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s;
}

.add-button:hover {
  background: white;
  color: #18e0a8;
}

.journal-container {
  padding: 40px 20px;
  background-color: #0e0e0e;
}

.journal-container h2 {
  color: #18e0a8;
  font-size: 1.5em;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
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
  <h1>📊 Tableau de Bord</h1>

  <!-- <div class="grid">
    <div class="card">
      <h3>⚖️ Statistiques principales</h3>
      <p>Poids, objectifs, progrès récents</p>
    </div>

    <div class="card">
      <h3>📅 Calendrier des entraînements</h3>
      <p>Vue hebdomadaire des séances planifiées</p>
    </div>

    <div class="card">
      <h3>🍽️ Suivi des repas</h3>
      <p>Calories consommées vs objectif</p>
    </div>

    <div class="card">
      <h3>📈 Progression des performances</h3>
      <p>Graphique dynamique en cours</p>
    </div>
  </div> -->

  <Link to="/">
    <button class="add-button">🏠 Retour à l'accueil</button>
  </Link>
</div>

<div class="journal-container">
  {#if loading}
    <p>⏳ Chargement en cours...</p>
  {:else if suivis.length > 0}
    <h2>📓 Journal des entraînements</h2>

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
