<script>
  import { onMount } from "svelte";
  import { user } from "./common/auth";
  import { navigate } from "svelte-routing";
  import Chart from "chart.js/auto";

  let currentUser;
let caloriesInput = ""
let erreurCalories = "";

  let nomRepas = "";
  let kcal = "";
  let prot = "";
  let gluc = "";
  let lip = "";

  let dateSelectionnee = new Date().toISOString().slice(0, 10);
  let repasEnregistres = [];
  let repasDuJour = [];
  let caloriesBrulees = 0;

  let objectifs = {
    calories: 0,
    proteines: 0,
    glucides: 0,
    lipides: 0
  };

  let calories = {
    mangees: 0,
    brulees: 0,
    objectif: 0
  };

  let macros = [
    { nom: "Protéines", consommé: 0, objectif: 0, couleur: '#f2a900', emoji: '🍗' },
    { nom: "Glucides", consommé: 0, objectif: 0, couleur: '#18a888', emoji: '🍞' },
    { nom: "Lipides", consommé: 0, objectif: 0, couleur: '#9b59b6', emoji: '🧈' }
  ];

  let chartCaloriesInstance;
  let macroChartsInstances = [];

  let showFormulaire = true;
  let showListeRepas = true;
  let showHistoriqueJour = true;

 

$: currentUser = $user;
  onMount(() => {

    
    chargerRepas();
    chargerJournee(dateSelectionnee);

    });

  async function chargerRepas() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:4201/user/repas", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      repasEnregistres = data.repas;
    } catch (err) {
      console.error("Erreur chargement repas :", err);
    }
  }

  async function chargerJournee(date) {
    caloriesInput = caloriesBrulees.toString();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
          console.log(`📡 [frontend] ➤ Chargement de la journée nutritionnelle pour : ${date}`);
      const res = await fetch(`http://localhost:4201/user/jour/${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.journee) {
        repasDuJour = data.journee.repas;
        caloriesBrulees = data.journee.caloriesBrulees;
        calories.brulees = caloriesBrulees;
        caloriesInput = caloriesBrulees.toString();
        objectifs.calories = data.journee.objectifCalories;
        objectifs.proteines = data.journee.objectifProteines;
        objectifs.glucides = data.journee.objectifGlucides;
        objectifs.lipides = data.journee.objectifLipides;

         console.log(`📅 [frontend] Contenu de la journée ${date} :`);
      console.log("  🔹 Repas :", repasDuJour);
      console.log("  🔥 Calories brûlées :", caloriesBrulees);
      console.log("  🎯 Objectifs :", objectifs);

      } else {

         console.log(`📭 [frontend] Aucune journée trouvée pour ${date}, valeurs par défaut utilisées.`);

        repasDuJour = [];
        caloriesBrulees = 0;
        objectifs = {
          calories: currentUser?.calories || 0,
          proteines: currentUser?.proteines || 0,
          glucides: currentUser?.glucides || 0,
          lipides: currentUser?.lipides || 0
        };
      }

      recalculerStats();
    } catch (err) {
      console.error("Erreur chargement journée :", err);
    }
  }

  function recalculerStats() {
    calories.mangees = repasDuJour.reduce((sum, r) => sum + r.calories, 0);
    calories.brulees = caloriesBrulees;
    calories.objectif = objectifs.calories;

    macros = [
      {
        nom: "Protéines",
        consommé: repasDuJour.reduce((sum, r) => sum + r.proteines, 0),
        objectif: objectifs.proteines,
        couleur: '#f2a900',
        emoji: '🍗'
      },
      {
        nom: "Glucides",
        consommé: repasDuJour.reduce((sum, r) => sum + r.glucides, 0),
        objectif: objectifs.glucides,
        couleur: '#18a888',
        emoji: '🍞'
      },
      {
        nom: "Lipides",
        consommé: repasDuJour.reduce((sum, r) => sum + r.lipides, 0),
        objectif: objectifs.lipides,
        couleur: '#9b59b6',
        emoji: '🧈'
      }
    ];
    caloriesBrulees = calories.brulees;


    updateCharts();
  }

 function updateCharts() {
  const ctxCalories = document.getElementById("caloriesChart");
  if (ctxCalories) {
    if (chartCaloriesInstance) {
      chartCaloriesInstance.destroy();
    }

    const mangees = calories.mangees;
    const brulees = calories.brulees;
    const objectif = calories.objectif;

    const net = Math.max(mangees - brulees, 0);
    const depassement = Math.max(net - objectif, 0);
const consomméesSansDepassement = Math.min(net, objectif);
const restantes = Math.max(objectif - net, 0);


    
    const data = depassement > 0
      ? [consomméesSansDepassement, depassement]
      : [net, restantes];

    const colors = depassement > 0
      ? ['#1d86f2', '#e74c3c']
      : ['#1d86f2', '#444'];

    chartCaloriesInstance = new Chart(ctxCalories, {
      type: 'doughnut',
      data: {
        labels: ['Net consommé', 'Reste ou dépassement'],
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 0
        }]
      },
      options: {
        cutout: '80%',
        rotation: 0,
        circumference: 360,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });

    const texteCentre = document.getElementById("caloriesCenterText");
    if (texteCentre) {
      if (depassement > 0) {
        texteCentre.innerHTML = `
          <h2 style="color:#e74c3c; font-size: 1rem; margin: 0;">Objectif dépassé de</h2>
          <p style="color:#e74c3c; font-size: 1.6rem; font-weight: bold; margin: 4px 0 0;">${depassement} calories</p>
        `;
      } else {
        texteCentre.innerHTML = `
          <h2 style="font-size: 1.6rem; font-weight: bold; margin: 0;">${objectif-mangees+brulees}</h2>
          <p style="font-size: 1rem; color: #ccc; margin: 4px 0 0;">Calories restantes</p>
        `;
      }
    }
  }

  
  macros.forEach((macro, index) => {
    const ctx = document.getElementById(`macroChart-${index}`);
    if (!ctx) return;

    if (macroChartsInstances[index]) {
      macroChartsInstances[index].destroy();
    }

    macroChartsInstances[index] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [macro.nom, 'Reste'],
        datasets: [{
          data: [macro.consommé, Math.max(macro.objectif - macro.consommé, 0)],
          backgroundColor: [macro.couleur, '#333'],
          borderWidth: 0
        }]
      },
      options: {
        cutout: '75%',
        plugins: { legend: { display: false } }
      }
    });
  });
}


  async function ajouterAuxRepasDuJour(repas) {
    repasDuJour = [...repasDuJour, repas];
    await sauvegarderJournee();
    recalculerStats();
  }

  async function sauvegarderJournee() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch("http://localhost:4201/user/jour", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: dateSelectionnee,
          caloriesBrulees,
          repas: repasDuJour
        })
      });
    } catch (err) {
      console.error("Erreur enregistrement journée :", err);
    }
  }

  async function enregistrerRepasPerso() {
    if (!nomRepas || !kcal || !prot || !gluc || !lip) {
      alert("Remplis tous les champs.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Utilisateur non connecté.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4201/user/repas", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nom: nomRepas,
          calories: parseInt(kcal),
          proteines: parseInt(prot),
          glucides: parseInt(gluc),
          lipides: parseInt(lip)
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur serveur");
      }

      alert("Repas enregistré ✅");
      chargerRepas();
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  }

  function supprimerRepasDuJour(index) {
  repasDuJour.splice(index, 1); // retire le repas à l'index donné
  repasDuJour = [...repasDuJour]; // force la réactivité
  recalculerStats();
  sauvegarderJournee();
}

async function supprimerRepas(id) {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`http://localhost:4201/user/repas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Erreur serveur");
    }

    // Recharger la liste après suppression
    await chargerRepas();
  } catch (err) {
    console.error("Erreur suppression repas :", err);
  }
}


</script>



<style>
  * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.macros-container {
  padding: 40px;
  background-color: #181818;
  min-height: 100vh;
  color: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
}

.header h1 {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  color: #18a888;
  pointer-events: none;
}

.date-picker {
  background: #333;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1rem;
}

.btn-retour {
  padding: 10px 18px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.btn-retour:hover {
  background-color: #444;
  color: #18a888;
}

.calories-main {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 50px;
  flex-wrap: wrap;
}

.calories-side {
  width: 200px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


.calories-text {
  font-size: 2rem;
  margin-bottom: 8px;
}

.calories-value {
  margin: 0;
  font-size: 1.5rem;
}

.calories-box {
  width: 300px;
  height: 300px;
  background: #222;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 0 10px rgba(24, 168, 136, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.calories-label {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
}

.caloriesChart-container {
  position: relative;
  width: 200px;
  height: 200px;
}

.calories-box canvas {
  width: 100% !important;
  height: 100% !important;
}

.calories-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.calories-input {
  background: #333;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  font-size: 1.2rem;
  width: 100px;
  margin-top: 5px;
}

.macro-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.macro-box {
  background: #222;
  border-radius: 12px;
  padding: 20px;
  width: 25%;
  min-width: 250px;
  height: 320px;
  text-align: center;
  box-shadow: 0 0 10px rgba(24, 168, 136, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.macro-label {
  font-size: 1.4rem;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
}

.chart-container {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-container canvas {
  width: 100% !important;
  height: 100% !important;
}

.macro-box h2 {
  margin-top: 12px;
  font-size: 1.4rem;
  font-weight: bold;
}

.macro-box p {
  font-size: 1rem;
  color: #ccc;
  margin: 4px 0 0 0;
}

@media screen and (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
  }

  .calories-main {
    flex-direction: column;
    gap: 30px;
  }

  .macro-grid {
    flex-direction: column;
    align-items: center;
  }

  .macro-box {
    width: 90%;
  }
}

.zone-ajout-repas {
  display: flex;
  gap: 40px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.formulaire-repas,
.liste-repas {
  flex: 1;
  background: #222;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(24, 168, 136, 0.2);
  min-width: 300px;
}

.formulaire-repas h2,
.liste-repas h2 {
  color: #18a888;
  text-align: center;
  margin-bottom: 20px;
}


.formulaire-repas input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: #333;
  color: white;
  font-size: 1rem;
  margin-bottom: 10px;
}

.formulaire-repas button {
  margin-top: 20px;
  width: 100%;
  background-color: #18a888;
  color: #181818;
  font-weight: bold;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: not-allowed;
  opacity: 0.6;
}

.repas-item {
  background: #333;
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 15px;
}

.repas-item h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #f2a900;
}

.repas-item p {
  margin: 5px 0;
  font-size: 0.95rem;
  color: #ccc;
}

.zone-ajout-repas {
  display: flex;
  gap: 40px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.formulaire-repas,
.liste-repas {
  flex: 1;
  background: #222;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(24, 168, 136, 0.2);
  min-width: 300px;
}

.formulaire-repas h2,
.liste-repas h2 {
  color: #18a888;
  text-align: center;
  margin-bottom: 20px;
}


.formulaire-repas input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: #333;
  color: white;
  font-size: 1rem;
  margin-bottom: 10px;
}

.boutons-formulaire {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-principal {
  flex: 1;
  background-color: #18a888;
  color: #181818;
  font-weight: bold;
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-secondaire {
  flex: 1;
  background-color: #444;
  color: white;
  font-weight: bold;
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: not-allowed;
  opacity: 0.6;
}

.repas-item {
  background: #333;
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 15px;
}

.repas-item h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #f2a900;
}

.repas-item p {
  margin: 5px 0;
  font-size: 0.95rem;
  color: #ccc;
}


.historique-repas-jour {
  margin-top: 50px;
  background: #222;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(24, 168, 136, 0.2);
  color: white;
}

.historique-repas-jour h2 {
  color: #18a888;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.repas-jour-item {
  background: #333;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.repas-jour-item h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #f2a900;
}

.repas-jour-item p {
  margin: 5px 0 0 0;
  font-size: 0.95rem;
  color: #ccc;
}

.repas-btns-pair {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.repas-btns-pair button {
  flex: 1;
  padding: 10px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  background-color: #18a888;
  color: #181818;
}

.repas-btns-pair .btn-supprimer {
  background-color: #aa4444;
  color: white;
}

.repas-btns-pair button:hover {
  filter: brightness(1.1);
}


</style>

<div class="macros-container">
  <div class="header">
  <button class="btn-retour" on:click={() => navigate("/")}>⬅ Retour</button>
  <h1>🍽️ Suivi Nutritionnel</h1>
 <input
  type="date"
  class="date-picker"
  bind:value={dateSelectionnee}
  on:change={() => chargerJournee(dateSelectionnee)}
/>

</div>

  

 <div class="calories-main">
  <div class="calories-side">
    <p class="calories-text">Mangées</p>
    <h3 class="calories-value">{calories.mangees}</h3>
  </div>

  <div class="calories-box">
    <div class="calories-label">Calories</div>
    <div class="caloriesChart-container">
      <canvas id="caloriesChart"></canvas>
      <div class="calories-center" id="caloriesCenterText">
      </div>
    </div>
  </div>

<div class="calories-side">
  <p class="calories-text">Brûlées</p>

  <input
    type="number"
    class="calories-input"
    bind:value={caloriesInput}
    placeholder="ex: 300"
  />
  {#if erreurCalories}
  <p style="color: #e74c3c; font-size: 0.9rem; margin-top: 4px;">{erreurCalories}</p>
{/if}

 <button
  style="margin-top: 8px; background-color: #18a888; color: black; padding: 8px 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;"
  on:click={() => {
    const valeur = parseInt(caloriesInput);
    if (isNaN(valeur) || valeur < 0) {
      erreurCalories = "Les calories brûlées ne peuvent pas être négatives.";
      return;
    }

    erreurCalories = ""; // clear error
    calories.brulees = valeur;
    caloriesBrulees = valeur;
    recalculerStats();
    sauvegarderJournee();
  }}
>
  Sauvegarder
</button>


  {#if calories.brulees > 0}
    <p style="margin-top: 10px; font-size: 1rem; color: #18a888;">
      Calories brûlées aujourd’hui : {calories.brulees}
    </p>
  {/if}
</div>


</div>

  <div class="macro-grid">
    {#each macros as m, i}
      <div class="macro-box">
        <div class="macro-label">{m.nom} {m.emoji}</div>
        <div class="chart-container">
          <canvas id={`macroChart-${i}`}></canvas>
        </div>
        <h2>{m.consommé} / {m.objectif}g</h2>
        <p>{Math.max(m.objectif - m.consommé, 0)}g restants</p>
      </div>
    {/each}
  </div>


  
  

  <!-- Header + calories + macros ici... -->

<!-- Ajout repas et liste -->
<div class="zone-ajout-repas">
  <!-- Créer un repas -->
  <div class="formulaire-repas">
    <h2 on:click={() => showFormulaire = !showFormulaire} style="cursor: pointer;">
      {showFormulaire ? '▼' : '▶'} Créer un repas
    </h2>
    {#if showFormulaire}
      <input type="text" placeholder="Nom du repas" bind:value={nomRepas} />
      <input type="number" placeholder="calories" bind:value={kcal} />
      <input type="number" placeholder="protéines" bind:value={prot} />
      <input type="number" placeholder="glucides" bind:value={gluc} />
      <input type="number" placeholder="lipides" bind:value={lip} />

      <div class="boutons-formulaire">
        <button class="btn-secondaire" on:click={enregistrerRepasPerso}>Enregistrer</button>
        <button class="btn-principal" on:click={() => {
  if (!nomRepas || !kcal || !prot || !gluc || !lip) {
    alert("Remplis tous les champs.");
    return;
  }

  const repas = {
    nom: nomRepas,
    calories: parseInt(kcal),
    proteines: parseInt(prot),
    glucides: parseInt(gluc),
    lipides: parseInt(lip)
  };

  ajouterAuxRepasDuJour(repas);
  nomRepas = kcal = prot = gluc = lip = ""; // reset
}}>Je viens de manger ceci</button>
      </div>
    {/if}
  </div>

  <!-- Repas enregistrés -->
  <div class="liste-repas">
    <h2 on:click={() => showListeRepas = !showListeRepas} style="cursor: pointer;">
      {showListeRepas ? '▼' : '▶'} Repas enregistrés
    </h2>
 {#if showListeRepas}
  {#each repasEnregistres as repas}
    <div class="repas-item">
      <h3>{repas.nom}</h3>
      <p>{repas.calories} kcal</p>
      <p>{repas.proteines}g protéines, {repas.glucides}g glucides, {repas.lipides}g lipides</p>

      <div class="repas-btns-pair">
        <button on:click={() => ajouterAuxRepasDuJour(repas)}>Ajouter à la journée</button>
        <button on:click={() => supprimerRepas(repas._id)} class="btn-supprimer">Supprimer</button>
      </div>
    </div>
  {/each}
{/if}

  </div>
</div>

<!-- Historique des repas du jour -->
<div class="historique-repas-jour">
  <h2 on:click={() => showHistoriqueJour = !showHistoriqueJour} style="cursor: pointer;">
    {showHistoriqueJour ? '▼' : '▶'} 📅 Repas du {dateSelectionnee}
  </h2>

  {#if showHistoriqueJour}
    {#if repasDuJour.length === 0}
      <p style="color: #ccc; margin-top: 10px;">Aucun repas ajouté pour cette journée.</p>
    {:else}
      <div class="repas-jour">
      {#each repasDuJour as repas, index}
  <div class="repas-jour-item">
    <h3>{repas.nom}</h3>
    <p>{repas.calories} kcal – {repas.proteines}g protéines, {repas.glucides}g glucides, {repas.lipides}g lipides</p>
    <button
      style="margin-top: 10px; padding: 8px 12px; background-color: #aa4444; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;"
      on:click={() => supprimerRepasDuJour(index)}
    >
      Supprimer
    </button>
  </div>
{/each}

      </div>
    {/if}
  {/if}
</div>
</div>
