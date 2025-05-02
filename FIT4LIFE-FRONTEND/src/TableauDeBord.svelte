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
    .dashboard-container {
      padding: 30px;
      color: white;
      text-align: center;
    }
  
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
  
    .card {
      background: #222;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0px 4px 10px rgba(24, 168, 136, 0.5);
      text-align: center;
    }
  
    .add-button {
      margin-top: 20px;
      padding: 12px 24px;
      background: #18a888;
      border: none;
      color: white;
      font-size: 1.2em;
      border-radius: 10px;
      cursor: pointer;
      transition: 0.3s;
    }
  
    .add-button:hover {
      background: white;
      color: #18a888;
    }
  
    h2 {
      color: #18a888;
    }
  
    ul {
      padding-left: 20px;
      margin-top: 5px;
      text-align: left;
    }
  
    .journal-container {
      margin-top: 60px;
      padding: 20px;
    }
  
    .journal-card {
      background: #111;
      padding: 15px;
      border-radius: 10px;
      border: 1px solid #18a888;
      margin-bottom: 20px;
      position: relative;
    }
  
    .journal-card em {
      font-style: italic;
      color: #18a888;
    }
  
    .journal-card strong {
      font-size: 1.1em;
      display: block;
      margin-bottom: 8px;
    }
  
    .delete-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: transparent;
      color: red;
      border: none;
      cursor: pointer;
      font-size: 1em;
    }
  </style>
  
  <div class="dashboard-container">
    <h1>Tableau de Bord</h1>
  
    <div class="grid">
      <div class="card">
        <h3>Statistiques principales</h3>
        <p>Placeholder pour poids actuel, objectif et progrès</p>
      </div>
  
      <div class="card">
        <h3>Calendrier des entraînements</h3>
        <p>Vue hebdomadaire des entraînements à venir</p>
      </div>
  
      <div class="card">
        <h3>Suivi des repas</h3>
        <p>Résumé des calories consommées vs objectif</p>
      </div>
  
      <div class="card">
        <h3>Progression des performances</h3>
        <p>Graphique montrant l'évolution</p>
      </div>
    </div>
  
    <Link to="/">
      <button class="add-button">Accueil</button>
    </Link>
  </div>
  
  <div class="journal-container">
    {#if loading}
      <p>Chargement en cours...</p>
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
  