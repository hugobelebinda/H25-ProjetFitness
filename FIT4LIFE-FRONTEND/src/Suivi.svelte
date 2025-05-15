<script>
  import { navigate } from "svelte-routing";
  import { get } from "svelte/store";
  import { user } from "./common/auth"; 
  import { onMount } from "svelte";
  

  $: currentUser = $user;
  let datePoids = new Date().toISOString().slice(0, 10);
  let editingPoids = false;
  let nouveauPoids = $user?.poids || null;

  async function changerPoids() {

    const aujourdHui = new Date().toISOString().slice(0, 10);
    const estAujourdhui = datePoids === aujourdHui;


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

    if (!datePoids || isNaN(new Date(datePoids).getTime())) {
      alert('Veuillez choisir une date valide.');
      return;
    }

    const body = {
      poids: parseInt(nouveauPoids),
      date: new Date(datePoids)
    };

    try {
      const res = await fetch(`http://localhost:4201/user/evaluation/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const data = await res.json();
          user.set(data.user);
         editingPoids = false;
      } else {
        const errorText = await res.text();
        alert("Erreur : " + errorText);
      }
    } catch (err) {
      alert("Erreur serveur");
    }
  }

  function dateLocaleAujourdHui() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // pour être sûr qu’on est à minuit local
  return today.toISOString().slice(0, 10);
}

</script>

<style>
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

  .section ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .section ul li {
    margin: 8px 0;
    color: #ddd;
  }

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

  .edit-btn:hover {
    background-color: #18a888;
    color: #181818;
  }

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

  .confirm-btn:hover {
    background-color: #14997a;
  }

  button:disabled {
    background-color: #444;
    color: #888;
    cursor: not-allowed;
    border: 1px solid #333;
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
      <li><strong>Poids actuel :</strong> {$user?.poids} kg</li>
      <li><strong>IMC :</strong> {$user?.imc}</li>
      <li><strong>Calories visées :</strong> {$user?.calories} kcal</li>
      <li><strong>Protéines :</strong> {$user?.proteines} g</li>
      <li><strong>Lipides :</strong> {$user?.lipides} g</li>
      <li><strong>Glucides :</strong> {$user?.glucides} g</li>
    </ul>
  </div>

  <div class="section">
    <h3>📉 Évolution du Poids</h3>
    <div class="placeholder-graph">Graphique en cours...</div>
  </div>

  <div class="section">
    <h3>🏋️ Historique des entraînements</h3>
    <ul>
      <li>✅ Lundi - Full Body</li>
      <li>✅ Mardi - Cardio HIIT</li>
      <li>✅ Jeudi - Haut du corps</li>
    </ul>
  </div>

  <div class="section">
    <h3>🥗 Suivi Nutritionnel</h3>
    <p>Calories aujourd'hui : <strong>1,950</strong></p>
    <p>Protéines : 140g | Glucides : 180g | Lipides : 60g</p>
  </div>
</div>
