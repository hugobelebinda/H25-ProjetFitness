<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  let groupesMusculaires = [];
  let nomRoutine = "";
  let exercices = [];
  let routineId = null;
  let filtres = {}; 

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

  function supprimerExercice(index) {
    exercices = exercices.filter((_, i) => i !== index);
  }

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

      const routineExistante = localStorage.getItem("routine_a_modifier");
      if (routineExistante) {
        const parsed = JSON.parse(routineExistante);
        routineId = parsed.id;
        nomRoutine = parsed.titre;
        exercices = parsed.contenu.split("\n").map(line => {
          const match = line.match(/- (.+?) : (\d+) séries x (\d+) reps/);
          if (match) {
            return {
              nom: match[1],
              series: parseInt(match[2]),
              repetitions: parseInt(match[3])
            };
          }
          return null;
        }).filter(Boolean);

        localStorage.removeItem("routine_a_modifier");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des exercices :", error);
    }
  });

  async function enregistrer() {
    if (!nomRoutine || exercices.length === 0 || exercices.some(e => !e.nom || !e.series || !e.repetitions)) {
      alert("Complétez tous les champs avant de valider la routine.");
      return;
    }

    const token = localStorage.getItem("token");
    const url = routineId
      ? `http://localhost:4201/user/entrainement/${routineId}`
      : "http://localhost:4201/user/entrainement";

    const method = routineId ? "PUT" : "POST";

    const body = {
      nom: nomRoutine,
      exercices
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");

      alert(routineId ? "Routine mise à jour ✅" : "Routine créée ✅");
      navigate("/plan-entrainement");
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de l'enregistrement.");
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

  .custom-dropdown details > .contenu {
    max-height: 200px;
    overflow-y: auto;
    margin-top: 5px;
    padding-left: 10px;
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

  .selected-label {
    color: #ffffff;
    font-size: 0.9em;
    margin-top: 5px;
  }

  .delete-exercice {
    margin-top: 10px;
    background: #c0392b;
  }

  .delete-exercice:hover {
    background: white;
    color: #c0392b;
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
</style>

<div class="container">
  <h2>{routineId ? "Modifier une routine" : "Créer une routine"}</h2>

  <label>Nom de la routine</label>
  <input type="text" bind:value={nomRoutine} placeholder="Routine du haut du corps" />

  <button class="btn" on:click={ajouterExercice}>
    + Ajouter un exercice
  </button>

  {#each exercices as ex, index}
    <div class="exercice">
      <h3>Exercice {index + 1}</h3>
      <div class="input-row">
        <div>
          <label>Nom</label>
          {#if !ex.nom}
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
                        on:click={(e) => {
                          exercices[index].nom = opt.nom;
                          exercices = [...exercices];
                          e.currentTarget.closest("details")?.removeAttribute("open");
                        }}
                      >
                        {opt.nom}
                      </button>
                    {/each}
                  </div>
                </details>
              {/each}
            </div>
          {:else}
            <p class="selected-label">{ex.nom}</p>
          {/if}
        </div>

        <div>
          <label>Séries</label>
          <input type="number" bind:value={ex.series} min="1" placeholder="ex: 3" />
        </div>

        <div>
          <label>Répétitions</label>
          <input type="number" bind:value={ex.repetitions} min="1" placeholder="ex: 10" />
        </div>
      </div>

      <button class="btn delete-exercice" on:click={() => supprimerExercice(index)}>
        Supprimer cet exercice
      </button>
    </div>
  {/each}

  <div class="footer-buttons">
    <button class="btn" on:click={enregistrer}>
      {routineId ? "Mettre à jour" : "Enregistrer"}
    </button>
    <button class="btn cancel-btn" on:click={() => navigate("/plan-entrainement")}>
      Annuler
    </button>
  </div>
</div>
