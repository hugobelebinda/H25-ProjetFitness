<script>
  import { navigate } from 'svelte-routing';
  import { get } from "svelte/store";
  import { user } from './common/auth';
  import { onMount, afterUpdate, tick } from 'svelte';
  import Chart from 'chart.js/auto';
let lastPoidsHash = "";
  let currentUser;
  let poidsChartInstance;
let showPoidsChart = false; 
let records1RM = {
  "Développé couché à la barre": { absolu: null, dernier: null },
  "Squat à la barre libre": { absolu: null, dernier: null },
  "Soulevé de terre à la barre": { absolu: null, dernier: null },
};
let loading1RM = true;


  $: currentUser = $user;
  let datePoids = new Date().toISOString().slice(0, 10);
  let editingPoids = false;
  let nouveauPoids = $user?.poids || null;
  let nutriments = [
    { nom: 'Protéines', consommé: currentUser?.proteines || 0 },
    { nom: 'Glucides', consommé: currentUser?.glucides || 0 },
    { nom: 'Lipides', consommé: currentUser?.lipides || 0 }
  ];

  let groupesMusculaires = [];
  let filtres = {};
  let chartInstance;
  let showChart = false;
 let loadingUser = true;
  $: loadingUser = !$user || !$user.poidsHistorique; 
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

async function fetchAllRecords1RM() {
  loading1RM = true;
  const exercices = [
    "Développé couché à la barre",
    "Squat à la barre libre",
    "Soulevé de terre à la barre",
  ];
  const token = localStorage.getItem("token");
  try {
    for (const ex of exercices) {
      const encoded = encodeURIComponent(ex);
      const res = await fetch(
        `http://localhost:4201/user/suivi/performance/${encoded}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        records1RM[ex] = {
          absolu: data.recordAbsolu1RM ?? null,
          dernier: data.dernier1RM ?? null,
        };
      } else {
        records1RM[ex] = { absolu: null, dernier: null };
      }
    }
  } catch (e) {
    for (const ex of exercices)
      records1RM[ex] = { absolu: null, dernier: null };
  }
  loading1RM = false;
}

onMount(() => {
  fetchAllRecords1RM();
});

  async function changerPoids() {
    const aujourdHui = new Date().toISOString().slice(0, 10);

    if (!currentUser || !currentUser._id) {
      alert("Utilisateur non connecté.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token non trouvé, veuillez vous reconnecter.");
      return;
    }

    if (!nouveauPoids || isNaN(nouveauPoids)) {
      alert('Veuillez entrer un poids valide.');
      return;
    }

    const body = {
      field: "poids",
      value: parseInt(nouveauPoids),
      date: datePoids
    };

    try {
      const res = await fetch(`http://localhost:4201/user/attribut`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
  const data = await res.json();
  console.log("User reçu du backend :", data.user); 
  console.log("Réponse du backend :", data);

user.set(data.user);
console.log("data.user", data.user);
console.log("data.dateEstimeeObjectif", data.dateEstimeeObjectif);


  editingPoids = false;
  showPoidsChart = true;
}
 else {
        const errorText = await res.text();
        alert("Erreur : " + errorText);
      }
    } catch (err) {
      alert("Erreur serveur");
    }
  }

  function drawPoidsChart() {
    const ctx = document.getElementById('poidsChart');
    if (!ctx || !currentUser?.poidsHistorique || currentUser.poidsHistorique.length === 0) return;

    if (poidsChartInstance) poidsChartInstance.destroy();

    const sorted = [...currentUser.poidsHistorique].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    poidsChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sorted.map(p => new Date(p.date).toLocaleDateString()),
        datasets: [{
          label: 'Poids (kg)',
          data: sorted.map(p => p.poids),
          borderColor: '#18a888',
          backgroundColor: 'rgba(24,168,136,0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
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
  }

  $: if (
  showPoidsChart &&
  $user?.poidsHistorique &&
  $user.poidsHistorique.length > 0
) {
  const poidsHash = $user.poidsHistorique.map(p => `${p.date}:${p.poids}`).join('|');
  if (poidsHash !== lastPoidsHash) {
    lastPoidsHash = poidsHash;
    tick().then(() => drawPoidsChart());
  }
}


  function dateLocaleAujourdHui() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return today.toISOString().slice(0, 10);
  }

  async function fetchPerformance(exercice) {
  if (!exercice) return;

  try {
    const encoded = encodeURIComponent(exercice);
    const url = `http://localhost:4201/user/suivi/performance/${encoded}`;
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const perf = await res.json();
      showChart = true;
   
      drawPerformanceChart(perf.progression || []);
    } else {
      showChart = false;
    }
  } catch (err) {
    showChart = false;
  }
}


  function drawPerformanceChart(progression) {
  setTimeout(() => {
    const ctx = document.getElementById('perfChart');
    if (!ctx) return;

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: progression.map(p => new Date(p.date).toLocaleDateString()),
        datasets: [{
          label: 'Charge moyenne (kg)',
          data: progression.map(p => p.chargeMoyenne),
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
  .confirm-btn {
    margin-top: 10px;
    background-color: #18a888;
    color: #181818;
    border: none;
    padding: 8px 24px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: bold;
    transition: background-color 0.2s;
  }
  .confirm-btn:hover { background-color: #14997a; }

  .custom-dropdown {
    background: #222;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 15px;
  }

  .custom-dropdown details { margin-bottom: 10px; }
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
  .exercice-btn:hover { background: #333; }

  .suivi-container {
    padding: 40px;
    color: white;
    background-color: #181818;
    min-height: 100vh;
  }
  .dashboard-header { text-align: center; margin-bottom: 40px; }
  .dashboard-header h1 { font-size: 2.5rem; color: #18a888; }
  .dashboard-header p { margin-top: 10px; color: #aaa; font-size: 1.1rem; }

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
  .stat-box h2 { font-size: 2rem; color: #18a888; }
  .stat-box p { margin-top: 8px; color: #ccc; }

  .section {
    background: #222;
    padding: 30px;
    border-radius: 12px;
    margin: 25px 0;
    box-shadow: 0 0 20px rgba(24, 168, 136, 0.15);
    text-align: left;
  }
  .section h3 { margin-bottom: 10px; color: #18a888; font-size: 1.4rem; }
  .section p { color: #ccc; }

  .placeholder-graph {
    margin-top: 20px;
    background: #333;
    border-radius: 8px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-style: italic;
  }
  .section ul { list-style-type: none; padding: 0; margin: 0; }
  .section ul li { margin: 8px 0; color: #ddd; }

  .edit-btn {
    margin-top: 12px;
    background-color: #1e3f3f;
    color: #18a888;
    border: 1px solid #18a888;
    padding: 8px 16px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s, color 0.2s;
  }
  .edit-btn:hover { background-color: #18a888; color: #181818; }

  input[type="number"],
  input[type="date"] {
    margin-top: 10px;
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid #18a888;
    background-color: #111;
    color: #eee;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }

  .confirm-btn {
    margin-top: 10px;
    background-color: #18a888;
    color: #181818;
    border: none;
    padding: 8px 16px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }
  .confirm-btn:hover { background-color: #14997a; }
  button:disabled {
    background-color: #444;
    color: #888;
    cursor: not-allowed;
    border: 1px solid #333;
  }
  canvas { max-width: 100%; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }
  th, td { padding: 10px; border: 1px solid #333; text-align: center; }
  th { background: #18a888; }
  td { background: #333; }
  input {
    width: 80px;
    padding: 5px;
    border-radius: 5px;
    border: none;
    text-align: center;
  }

  /* Styles spécifiques projection objectif */
  .stat-box .objectif-projection {
    font-size: 1.2rem;
    color: #18a888;
    font-weight: bold;
    margin-top: 8px;
    margin-bottom: 4px;
  }
  .stat-box .objectif-date {
    font-size: 1.4rem;
    color: #fff;
    margin-bottom: 2px;
  }
  .stat-box .objectif-jours {
    font-size: 1rem;
    color: #ccc;
    margin-top: 6px;
  }
  .stat-box .objectif-pente {
    font-size: 0.96rem;
    color: #aaa;
    margin-bottom: 6px;
  }
  .stat-box .objectif-calories {
    font-size: 1.07rem;
    color: #ffd37b;
    font-weight: 500;
    margin-top: 12px;
  }
  .stat-box .objectif-ligne {
    margin: 14px 0 10px 0;
    border: 0;
    border-top: 1px solid #222;
    opacity: 0.8;
  }
  .stat-box .objectif-message {
    color: #aaa;
    font-size: 0.96rem;
    margin-top: 6px;
  }
</style>
<!--{#if currentUser}
  <pre>{JSON.stringify(currentUser, null, 2)}</pre>
{/if} -->


<div class="suivi-container">
  <div class="dashboard-header">
    <h1>📊 Suivi de {currentUser?.nom || currentUser?.username || 'ton évolution'}</h1>
    <p>Garde le rythme et célèbre chaque progrès 💪</p>
  </div>

  <div class="quick-stats">
    <div class="stat-box">
      <h2>{currentUser?.poids || '...'} kg</h2>
      <p>Poids actuel</p>
      <button on:click={() => editingPoids = true} class="edit-btn">Modifier</button>
      {#if editingPoids}
        <input type="number" bind:value={nouveauPoids} placeholder="Nouveau poids" />
        <input type="date" bind:value={datePoids} max={dateLocaleAujourdHui()} />
        <button 
          on:click={changerPoids} 
          class="confirm-btn"
          disabled={!nouveauPoids || isNaN(nouveauPoids) || !datePoids || isNaN(new Date(datePoids).getTime())}
        >
          Confirmer
        </button>
      {/if}
    </div>

   <div class="stat-box">
  <h2>{currentUser?.poidsObjectif} kg</h2>
  <p>Votre objectif</p>
  {#if currentUser?.objectif === "Perdre du poids" && currentUser.poids <= currentUser.poidsObjectif}
    <p>Vous avez atteint votre objectif ! Bravo ! 🎉</p>
  {:else if currentUser?.objectif === "Gagner du muscle" && currentUser.poids >= currentUser.poidsObjectif}
    <p>Vous avez atteint votre objectif ! Bravo ! 🎉</p>
  {/if}
</div>


   <div class="stat-box">
  {#if 
    (currentUser?.objectif === "Perdre du poids" && currentUser.poids <= currentUser.poidsObjectif)
    ||
    (currentUser?.objectif === "Gagner du muscle" && currentUser.poids >= currentUser.poidsObjectif)
  }
    <div class="objectif-date">🎉</div>
    <div class="objectif-projection">Félicitations, tu as atteint ton objectif !</div>
    <div class="objectif-message">Continue comme ça !</div>
  {:else if currentUser?.dateEstimeeObjectif}
    <div class="objectif-date">
      📅 {new Date(currentUser.dateEstimeeObjectif).toLocaleDateString('fr-FR')}
    </div>
    <div class="objectif-projection">
      Objectif atteint estimé
    </div>
    {#if currentUser.nbJoursRestant !== null}
      <div class="objectif-jours">
        ~{Math.round(currentUser.nbJoursRestant)} jours restants
      </div>
    {/if}
    {#if currentUser.pentePoids !== null}
      <div class="objectif-pente">
        Progression moyenne : {currentUser.pentePoids.toFixed(2)} kg/jour
      </div>
      <div class="objectif-pente">
        (selon les 4 derniers poids entrés)
      </div>
    {/if}
    <hr class="objectif-ligne">
    <div class="objectif-calories">
      Calories à viser : <strong>{currentUser?.calories ?? "..."}</strong> kcal
    </div>
  {:else}
    <div class="objectif-date">—</div>
    <div class="objectif-projection">Projection indisponible</div>
    <div class="objectif-message">Ajoute plus de données de poids pour voir une estimation ! (ou peut-être que tu as rentré n'importe quoi??)</div>
  {/if}
</div>

  </div>
  <div class="section">
  <h3>🏆 Records 1RM </h3>
  {#if loading1RM}
    <div>Chargement...</div>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Exercice</th>
          <th>Record absolu 1RM<br><span style="font-weight:normal;font-size:0.9em;">(meilleure perf. historique)</span></th>
          <th>Dernier 1RM<br><span style="font-weight:normal;font-size:0.9em;">(d'après la dernière séance)</span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Développé couché à la barre</td>
          <td>{records1RM["Développé couché à la barre"].absolu ?? "—"} kg</td>
          <td>{records1RM["Développé couché à la barre"].dernier ?? "—"} kg</td>
        </tr>
        <tr>
          <td>Squat à la barre libre</td>
          <td>{records1RM["Squat à la barre libre"].absolu ?? "—"} kg</td>
          <td>{records1RM["Squat à la barre libre"].dernier ?? "—"} kg</td>
        </tr>
        <tr>
          <td>Soulevé de terre à la barre</td>
          <td>{records1RM["Soulevé de terre à la barre"].absolu ?? "—"} kg</td>
          <td>{records1RM["Soulevé de terre à la barre"].dernier ?? "—"} kg</td>
        </tr>
      </tbody>
    </table>
  {/if}
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

  <h3>📉 Évolution du Poids</h3>
  {#if !$user}
    <div class="placeholder-graph">Chargement...</div>
  {:else if $user.poidsHistorique && $user.poidsHistorique.length > 0}
    {#if !showPoidsChart}
      <div class="placeholder-graph" style="flex-direction: column;">
        <span style="margin-bottom: 10px;">Tu as des données de poids !</span>
        <button class="confirm-btn" on:click={() => showPoidsChart = true}>
          Afficher le graphique
        </button>
      </div>
    {:else}
      <canvas id="poidsChart" width="400" height="200"></canvas>
    {/if}
  {:else}
    <div class="placeholder-graph">Pas encore de données de poids.</div>
  {/if}

  <div class="section">
    <h3>🥗 Suivi Nutritionnel</h3>
    <p>Calories à viser <strong>{currentUser?.calories}</strong></p>
    <p>Protéines : {currentUser?.proteines}g | Glucides : {currentUser?.glucides}g | Lipides : {currentUser?.lipides}g</p>
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
