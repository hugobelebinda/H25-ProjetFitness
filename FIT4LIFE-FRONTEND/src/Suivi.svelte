<script>
  import { navigate } from 'svelte-routing';

  import { user } from './common/auth';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let currentUser;

$: currentUser = $user;

  let nutriments = [
    { nom: 'Protéines', consommé: currentUser?.proteines || 0 },
    { nom: 'Glucides', consommé: currentUser?.glucides || 0 },
    { nom: 'Lipides', consommé: currentUser?.lipides || 0 }
  ];

  let groupesMusculaires = [];
  let filtres = {};
  let chartInstance;
  let showChart = false;

  onMount(async () => {
    try {
      const res = await fetch("http://localhost:4201/user/exercices");
      const data = await res.json();

      const map = new Map();
      data.data.forEach((ex) => {
        if (!map.has(ex.groupeMusculaire)) {
          map.set(ex.groupeMusculaire, []);
        }
        map.get(ex.groupeMusculaire).push(ex);
      });

      groupesMusculaires = Array.from(map.entries()).map(([nom, exercices]) => ({
        nom,
        exercices
      }));
    } catch (err) {
      console.error("Erreur chargement exercices", err);
    }
  });

  async function fetchPerformance(exercice) {
  if (!exercice) return;

  try {
    const encoded = encodeURIComponent(exercice);
    const url = `http://localhost:4201/user/suivi/performance/${encoded}`;
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("➡️ URL appelée :", url);
    console.log("📦 Status :", res.status);

    if (res.ok) {
      const perf = await res.json();
      console.log("📊 Données reçues :", perf.historique);

      showChart = true;
      drawPerformanceChart(perf.historique || []);
    } else {
      console.warn("❌ Erreur de réponse :", await res.text());
      showChart = false;
    }
  } catch (err) {
    console.error("❌ Erreur de fetchPerformance :", err);
    showChart = false;
  }
}


  function drawPerformanceChart(historique) {
    setTimeout(() => {
      const ctx = document.getElementById('perfChart');
      if (!ctx) return;

      if (chartInstance) chartInstance.destroy();

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: historique.map(p => new Date(p.date).toLocaleDateString()),
          datasets: [{
            label: 'Charge (kg)',
            data: historique.map(p => p.charge),
            borderColor: '#18a888',
            backgroundColor: 'rgba(24,168,136,0.2)',
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: 'white' } } },
          scales: {
            x: { ticks: { color: 'white' } },
            y: { ticks: { color: 'white' } }
          }
        }
      });
    }, 50);
  }

  function choisirExercice(nom) {
    fetchPerformance(nom);
    setTimeout(() => {
      document.getElementById('perfChart')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }
</script>

<style>
  .custom-dropdown {
    background: #222;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 15px;
  }

  .custom-dropdown details {
    margin-bottom: 10px;
  }

  .custom-dropdown summary {
    cursor: pointer;
    color: #18a888;
    font-weight: bold;
  }

  .contenu {
    max-height: 200px;
    overflow-y: auto;
    margin-top: 5px;
    padding-left: 10px;
  }

  .search-input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    background: #1b1b1b;
    color: white;
    border: 1px solid #444;
    border-radius: 6px;
  }

  .exercice-btn {
    display: block;
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    transition: background 0.2s;
    cursor: pointer;
  }

  .exercice-btn:hover {
    background: #333;
  }

  .suivi-container {
    padding: 40px;
    color: white;
    background-color: #181818;
    min-height: 100vh;
  }

  .dashboard-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .dashboard-header h1 {
    font-size: 2.5rem;
    color: #18a888;
  }

  .dashboard-header p {
    margin-top: 10px;
    color: #aaa;
    font-size: 1.1rem;
  }

  .quick-stats {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
    margin-bottom: 40px;
  }

  .stat-box {
    background: #222;
    padding: 25px 30px;
    border-radius: 12px;
    width: 240px;
    box-shadow: 0 0 15px rgba(24, 168, 136, 0.3);
    text-align: center;
  }

  .stat-box h2 {
    font-size: 2rem;
    color: #18a888;
  }

  .stat-box p {
    margin-top: 8px;
    color: #ccc;
  }

  .section {
    background: #222;
    padding: 30px;
    border-radius: 12px;
    margin: 25px 0;
    box-shadow: 0 0 20px rgba(24, 168, 136, 0.15);
    text-align: left;
  }

  .section h3 {
    margin-bottom: 10px;
    color: #18a888;
    font-size: 1.4rem;
  }

  .section p {
    color: #ccc;
  }

  .section ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .section ul li {
    margin: 8px 0;
    color: #ddd;
  }

  canvas {
    max-width: 100%;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }

  th, td {
    padding: 10px;
    border: 1px solid #333;
    text-align: center;
  }

  th {
    background: #18a888;
  }

  td {
    background: #333;
  }

  input {
    width: 80px;
    padding: 5px;
    border-radius: 5px;
    border: none;
    text-align: center;
  }
</style>

<div class="suivi-container">
  <div class="dashboard-header">
    <h1>📊 Suivi de {currentUser?.nom || currentUser?.username || 'ton évolution'}</h1>
    <p>Garde le rythme et célèbre chaque progrès 💪</p>
  </div>

  <div class="quick-stats">
    <div class="stat-box">
      <h2>{currentUser?.poids || '...'} kg</h2>
      <p>Poids actuel</p>
    </div>
    <div class="stat-box">
      <h2>5 séances</h2>
      <p>cette semaine</p>
    </div>
    <div class="stat-box">
      <h2>1,950 kcal</h2>
      <p>calories consommées</p>
    </div>
  </div>

  <div class="section">
    <h3>📊 Statistiques personnalisées</h3>
    <ul>
      <li><strong>Poids actuel :</strong> {currentUser?.poids} kg</li>
      <li><strong>IMC :</strong> {currentUser?.imc}</li>
      <li><strong>Calories visées :</strong> {currentUser?.calories} kcal</li>
      <li><strong>Protéines :</strong> {currentUser?.proteines} g</li>
      <li><strong>Lipides :</strong> {currentUser?.lipides} g</li>
      <li><strong>Glucides :</strong> {currentUser?.glucides} g</li>
    </ul>
  </div>

  <div class="section">
    <h3>🏋️ Évolution des Performances</h3>

    <div class="custom-dropdown">
      {#each groupesMusculaires as groupe}
        <details>
          <summary>{groupe.nom}</summary>
          <div class="contenu">
            <input
              type="text"
              placeholder="Rechercher un exercice..."
              class="search-input"
              bind:value={filtres[groupe.nom]}
              on:input={() => filtres = { ...filtres }}
            />

            {#each groupe.exercices
              .map(e => {
                const recherche = filtres[groupe.nom]?.toLowerCase() || "";
                const nomExercice = e.nom.toLowerCase();
                let score = 0;
                if (nomExercice.includes(recherche)) score += 1;
                if (nomExercice.startsWith(recherche)) score += 2;
                if (nomExercice === recherche) score += 5;
                return { ...e, score };
              })
              .filter(e => e.score > 0)
              .sort((a, b) => b.score - a.score)
              as opt}
              <button
                type="button"
                class="exercice-btn"
                on:click={() => choisirExercice(opt.nom)}
              >
                {opt.nom}
              </button>
            {/each}
          </div>
        </details>
      {/each}
    </div>

    {#if showChart}
      <canvas id="perfChart" width="400" height="200"></canvas>
    {:else}
      <p style="color:#aaa; margin-top:20px;">Sélectionne un exercice pour voir le graphique.</p>
    {/if}
  </div>

 <div class="section">
  <h3>🏋️ Historique des entraînements</h3>
  <button
    on:click={() => navigate("/tableau-de-bord")}
    style="margin-top: 10px; padding: 12px 20px; background-color: #18a888; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;"
  >
    Voir mes entraînements
  </button>
</div>

  <div class="section">
    <h3>🥗 Suivi Nutritionnel</h3>
    <p>Calories aujourd'hui : <strong>1,950</strong></p>
    <p>Protéines : 140g | Glucides : 180g | Lipides : 60g</p>

    <table>
      <thead>
        <tr>
          <th>Nutriment</th>
          <th>Consommé (g)</th>
        </tr>
      </thead>
      <tbody>
        {#each nutriments as n}
          <tr>
            <td>{n.nom}</td>
            <td>
              <input type="number" bind:value={n.consommé} /> g
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
