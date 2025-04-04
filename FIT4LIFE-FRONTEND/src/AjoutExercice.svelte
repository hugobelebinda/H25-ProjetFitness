<script>
    import { navigate } from "svelte-routing";
  
    let nomRoutine = "";
    let exercices = [];
  
    function ajouterExercice() {
      exercices = [
        ...exercices,
        {
          nom: "",
          series: 3,
          repetitions: 10
        }
      ];
    }
  
    function exercicesValides() {
      return exercices.every(e => e.nom && e.series > 0 && e.repetitions > 0);
    }
  
    async function enregistrerRoutine() {
        
        const userId = localStorage.getItem("userId");

if (userId == null) {
  alert("⚠️ Vous devez être connecté pour enregistrer un entraînement.");
  console.error("Tentative d'enregistrement sans userId");
  return;
}
  
      if (!userId || !nomRoutine || exercices.length === 0 || !exercicesValides()) {
        alert("Veuillez remplir tous les champs requis.");
        return;
      }
  
      const payload = {
        userId,
        nom: nomRoutine,
        exercices
      };
  
      try {
        const res = await fetch("http://localhost:4201/user/entrainement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
  
        if (res.ok) {
          const data = await res.json();
          alert("✅ Entraînement enregistré !");
          navigate("/tableau-de-bord");
        } else {
          const err = await res.json();
          console.error("Erreur serveur :", err);
          alert("❌ Erreur : " + (err.message || "Échec de l'enregistrement"));
        }
      } catch (e) {
        console.error("Erreur réseau :", e);
        alert("❌ Problème de connexion au serveur.");
      }
    }
  </script>
  
  
  
  <style>
    .container {
      max-width: 800px;
      margin: 40px auto;
      padding: 25px;
      background: #111;
      color: white;
      border-radius: 12px;
      box-shadow: 0px 0px 10px rgba(24, 168, 136, 0.3);
    }
  
    h2 {
      color: #18a888;
      text-align: center;
      margin-bottom: 30px;
    }
  
    label {
      display: block;
      margin-bottom: 8px;
      color: #aaa;
      font-weight: bold;
    }
  
    input {
      width: 100%;
      padding: 10px;
      background: #222;
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 16px;
      margin-bottom: 20px;
    }
  
    .exercice {
      background: #222;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
  
    .exercice h3 {
      margin-bottom: 15px;
      color: #18a888;
    }
  
    .input-row {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
    }
  
    .input-row > div {
      flex: 1;
    }
  
    .btn {
      padding: 12px;
      background: #18a888;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1em;
      transition: 0.3s;
      margin-top: 10px;
    }
  
    .btn:hover {
      background: white;
      color: #18a888;
    }
  
    .footer-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }
  
    .cancel-btn {
      background: red;
    }
  
    .cancel-btn:hover {
      background: white;
      color: red;
    }
  </style>
  
  <div class="container">
    <h2>Créer une routine</h2>
  
    <label>Nom de la routine</label>
    <input type="text" bind:value={nomRoutine} placeholder="Routine du haut du corps" />
  
    <button class="btn" on:click={ajouterExercice}>+ Ajouter un exercice</button>
  
    {#each exercices as ex, index}
      <div class="exercice">
        <h3>Exercice {index + 1}</h3>
        <div class="input-row">
          <div>
            <label>Nom</label>
            <input type="text" bind:value={ex.nom} placeholder="Ex: Développé couché" />
          </div>
          <div>
            <label>Séries</label>
            <input type="number" bind:value={ex.series} min="1" />
          </div>
          <div>
            <label>Répétitions</label>
            <input type="number" bind:value={ex.repetitions} min="1" />
          </div>
        </div>
      </div>
    {/each}
  
    <div class="footer-buttons">
      <button class="btn" on:click={enregistrerRoutine}>Enregistrer</button>
      <button class="btn cancel-btn" on:click={() => navigate("/tableau-de-bord")}>Annuler</button>
    </div>
  </div>
  