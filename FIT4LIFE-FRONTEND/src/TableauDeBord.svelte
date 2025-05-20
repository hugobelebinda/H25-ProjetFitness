<script>
  import { Link } from "svelte-routing";
  import { onMount } from 'svelte';
  import { user } from './common/auth';
  import { tick } from 'svelte';

  let suivis = [];
  let loading = true;
  let message = null;
  let messageType = "success"; // or "error"

  let confirmAction = null;
  let showConfirmModal = false;
  let confirmText = "";

  function showMessage(text, type = "success") {
    message = text;
    messageType = type;
    tick().then(() => setTimeout(() => message = null, 3000));
  }

  function demanderConfirmation(action, texte) {
    confirmAction = action;
    confirmText = texte;
    showConfirmModal = true;
  }

  function confirmer() {
    if (confirmAction) confirmAction();
    showConfirmModal = false;
    confirmAction = null;
  }

  function annulerConfirmation() {
    showConfirmModal = false;
    confirmAction = null;
  }

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
      showMessage("Poids supprimé !", "success");
    } catch (err) {
      console.error(err);
      showMessage("Erreur pendant la suppression du poids.", "error");
    }
  }

  async function supprimerSuivi(id) {
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
      showMessage("Suivi supprimé !", "success");
    } catch (err) {
      console.error(err);
      showMessage("Erreur pendant la suppression du suivi.", "error");
    }
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

  .columns {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 40px;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    flex-wrap: wrap;
  }

  .journal-column {
    flex: 1;
    min-width: 340px;
    max-width: 600px;
    background: #222;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(24, 168, 136, 0.15);
  }

  .journal-column h2 {
    color: #18a888;
    font-size: 1.5em;
    margin-bottom: 20px;
  }

  .journal-card {
    background-color: #2b2b2b;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 0 15px rgba(24, 168, 136, 0.2);
    margin-bottom: 20px;
    position: relative;
    color: white;
    transition: box-shadow 0.3s;
  }

  .journal-card:hover {
    box-shadow: 0 0 25px rgba(24, 168, 136, 0.4);
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

  ul {
    padding-left: 20px;
    text-align: left;
  }

  p {
    color: #ccc;
  }

  .back-button {
    margin-bottom: 20px;
    padding: 10px 18px;
    background-color: #18a888;
    color: #181818;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
  }

  .back-button:hover {
    background-color: #14997a;
  }

  .toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #2b2b2b;
    color: white;
    padding: 14px 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    border-left: 5px solid;
  }
  .toast.success { border-color: #18a888; }
  .toast.error { border-color: #e05f5f; }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }

  .modal-content {
    background: #222;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(24, 168, 136, 0.3);
    text-align: center;
    color: white;
    max-width: 400px;
  }

  .modal-content button {
    margin: 10px;
    padding: 10px 18px;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
  }
  .modal-content .confirm {
    background-color: #18a888;
    color: #181818;
  }
  .modal-content .cancel {
    background-color: #444;
    color: #ccc;
  }
</style>

{#if message}
  <div class="toast {messageType}">{message}</div>
{/if}

{#if showConfirmModal}
  <div class="modal">
    <div class="modal-content">
      <p>{confirmText}</p>
      <button class="confirm" on:click={confirmer}>Oui</button>
      <button class="cancel" on:click={annulerConfirmation}>Non</button>
    </div>
  </div>
{/if}

<div class="suivi-container">
  <div class="dashboard-header">
    <h1>📊 Journal de Bord</h1>
    <Link to="/">
      <button class="back-button">🏠 Retour à l'accueil</button>
    </Link>
  </div>

  <div class="columns">
    <div class="journal-column">
      <h2>📓 Journal des entraînements</h2>
      {#if loading}
        <p>⏳ Chargement en cours...</p>
      {:else if suivis.length > 0}
        {#each suivis as suivi}
          <div class="journal-card">
            <button class="delete-button" on:click={() => demanderConfirmation(() => supprimerSuivi(suivi._id), 'Supprimer ce suivi ?')}>🗑️</button>
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

    <div class="journal-column">
      <h2>⚖️ Historique des poids</h2>
      {#if $user?.poidsHistorique?.length > 0}
        {#each $user.poidsHistorique as p}
          <div class="journal-card">
            <strong>{new Date(p.date).toLocaleDateString('fr-FR')}</strong>
            <p>Poids : {p.poids} kg</p>
            <button class="delete-button" on:click={() => demanderConfirmation(() => supprimerPoids(p._id), 'Supprimer ce poids ?')}>🗑️</button>
          </div>
        {/each}
      {:else}
        <p>Aucune donnée de poids enregistrée.</p>
      {/if}
    </div>
  </div>
</div>
