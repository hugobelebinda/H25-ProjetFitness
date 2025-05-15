<script>
  import { onMount } from 'svelte';
  import { enregistrerRoutine } from "./services/routineService.js";

  let plan = "";
  let programme = {};
  let loading = true;

  const programmes = {
    "Push Pull Legs": {
      Push: [
        {
          nom: "Développé couché",
          image: "https://via.placeholder.com/64",
          description: "Exercice pour les pectoraux avec barre.",
          series: 2,
          repetitions: 6
        },
        {
          nom: "Développé militaire",
          image: "https://via.placeholder.com/64",
          description: "Travail des épaules.",
          series: 2,
          repetitions: 8
        },
        {
          nom: "Développé incliné haltères",
          image: "https://via.placeholder.com/64",
          description: "Variante inclinée pour le haut des pectoraux.",
          series: 3,
          repetitions: 8
        },
        {
          nom: "Poussée des triceps au-dessus de la tête",
          image: "https://via.placeholder.com/64",
          description: "Travail des épaules latérales.",
          series: 3,
          repetitions: 10
        },
        {
          nom: "Élévations latérales",
          image: "https://via.placeholder.com/64",
          description: "Travail des épaules latérales.",
          series: 3,
          repetitions: 12
        },
        {
          nom: "Chest flys",
          image: "https://via.placeholder.com/64",
          description: "Travail de la poitrine en isolation.",
          series: 2,
          repetitions: 10
        }
      ],
      Pull: [
        {
          nom: "Tractions",
          image: "https://via.placeholder.com/64",
          description: "Renforce le dos et les biceps.",
          series: 3,
          repetitions: 8
        },
        {
          nom: "Lat pulldown",
          image: "https://via.placeholder.com/64",
          description: "Exercice horizontal pour le grand dorsal.",
          series: 3,
          repetitions: 8
        },
        {
          nom: "Rowing barre T",
          image: "https://via.placeholder.com/64",
          description: "Exercice horizontal pour le dos.",
          series: 3,
          repetitions: 8
        },
        {
          nom: "Curl biceps hammer",
          image: "https://via.placeholder.com/64",
          description: "Travail des biceps et des brachioradials .",
          series: 2,
          repetitions: 10
        },
        {
          nom: "Preacher curls",
          image: "https://via.placeholder.com/64",
          description: "Travail des biceps.",
          series: 2,
          repetitions: 10
        },
        {
          nom: "Face Pull",
          image: "https://via.placeholder.com/64",
          description: "Travail deltoïdes postérieurs et trapèzes.",
          series: 3,
          repetitions: 12
        }
      ],
      Legs: [
        {
          nom: "Squat",
          image: "https://via.placeholder.com/64",
          description: "Exercice de base pour les jambes.",
          series: 4,
          repetitions: 8
        },
        {
          nom: "Fentes bulgares",
          image: "https://via.placeholder.com/64",
          description: "Travail les quadriceps et fessiers.",
          series: 3,
          repetitions: 12
        },
        {
          nom: "Leg Curl",
          image: "https://via.placeholder.com/64",
          description: "Ischios-jambiers en isolation.",
          series: 3,
          repetitions: 15
        },
        {
          nom: "Leg extension",
          image: "https://via.placeholder.com/64",
          description: "Quadriceps en isolation.",
          series: 3,
          repetitions: 15
        }
      ]
    },
    "Upper Lower": {
      Upper: [
        {
          nom: "Développé couché",
          image: "https://via.placeholder.com/64",
          description: "Pectoraux avec barre.",
          series: 3,
          repetitions: 8
        },
        {
          nom: "Développé militaire",
          image: "https://via.placeholder.com/64",
          description: "Travail des épaules.",
          series: 2,
          repetitions: 8
        },
        {
          nom: "Dips",
          image: "https://via.placeholder.com/64",
          description: "Exercice horizontal pour les triceos et la poitrine.",
          series: 2,
          repetitions: 8
        },
        {
          nom: "Tractions",
          image: "https://via.placeholder.com/64",
          description: "Renforce le dos et les biceps.",
          series: 3,
          repetitions: 8
        },

         {
          nom: "Lat pulldown",
          image: "https://via.placeholder.com/64",
          description: "Exercice horizontal pour le grand dorsal.",
          series: 2,
          repetitions: 8
        },
        {
          nom: "Rowing barre T",
          image: "https://via.placeholder.com/64",
          description: "Exercice horizontal pour le dos.",
          series: 2,
          repetitions: 8
        },
        
      ],
      Lower: [
        {
          nom: "Squat",
          image: "https://via.placeholder.com/64",
          description: "Exercice de base pour les jambes.",
          series: 4,
          repetitions: 8
        },
        {
          nom: "Fentes bulgares",
          image: "https://via.placeholder.com/64",
          description: "Travail les quadriceps et fessiers.",
          series: 3,
          repetitions: 12
        },
        {
          nom: "Leg Curl",
          image: "https://via.placeholder.com/64",
          description: "Ischios-jambiers en isolation.",
          series: 3,
          repetitions: 15
        },
        {
          nom: "Leg extension",
          image: "https://via.placeholder.com/64",
          description: "Quadriceps en isolation.",
          series: 3,
          repetitions: 15
        }
      ]
    },
    "Arnold Split": {
      "Poitrine Et Dos": [
       {
          nom: "Développé couché",
          image: "https://via.placeholder.com/64",
          description: "Exercice pour les pectoraux avec barre.",
          series: 2,
          repetitions: 6
        },
        {
          nom: "Développé incliné haltères",
          image: "https://via.placeholder.com/64",
          description: "Variante inclinée pour le haut des pectoraux.",
          series: 3,
          repetitions: 8
        },
        {
          nom: "Tractions",
          image: "https://via.placeholder.com/64",
          description: "Renforce le dos et les biceps.",
          series: 3,
          repetitions: 8
        },
       {
          nom: "Rowing barre T",
          image: "https://via.placeholder.com/64",
          description: "Exercice horizontal pour le dos.",
          series: 3,
          repetitions: 8
        },
      ],
      Jambes: [
        {
            nom: "Squat",
          image: "https://via.placeholder.com/64",
          description: "Exercice de base pour les jambes.",
          series: 4,
          repetitions: 8
        },
        {
          nom: "Fentes bulgares",
          image: "https://via.placeholder.com/64",
          description: "Travail les quadriceps et fessiers.",
          series: 3,
          repetitions: 12
        },
        {
          nom: "Leg Curl",
          image: "https://via.placeholder.com/64",
          description: "Ischios-jambiers en isolation.",
          series: 3,
          repetitions: 15
        },
        {
          nom: "Leg extension",
          image: "https://via.placeholder.com/64",
          description: "Quadriceps en isolation.",
          series: 3,
          repetitions: 15
        }
      ],
      Bras: [
        {
          nom: "Élévations latérales",
          image: "https://via.placeholder.com/64",
          description: "Travail des épaules latérales.",
          series: 3,
          repetitions: 12
        },
        {
          nom: "Face Pull",
          image: "https://via.placeholder.com/64",
          description: "Travail deltoïdes postérieurs et trapèzes.",
          series: 3,
          repetitions: 12
        },
       {
          nom: "Poussée des triceps au-dessus de la tête",
          image: "https://via.placeholder.com/64",
          description: "Travail des épaules latérales.",
          series: 3,
          repetitions: 10
        },
        {
          nom: "Curl biceps hammer",
          image: "https://via.placeholder.com/64",
          description: "Travail des biceps et des brachioradials .",
          series: 2,
          repetitions: 10
        },
        {
          nom: "Preacher curls",
          image: "https://via.placeholder.com/64",
          description: "Travail des biceps.",
          series: 2,
          repetitions: 10
        },
        {
          nom: "Flexion avant-bras poulie",
          image: "https://via.placeholder.com/64",
          description: "Travail des avants-bras.",
          series: 3,
          repetitions: 12
        }
      ]
    }
  };

  const splitsDisponibles = Object.keys(programmes);

  function changerPlan(nouveauPlan) {
    plan = nouveauPlan;
    programme = programmes[plan] || {};
  }

  async function enregistrer(jour, exercices, index) {
  const nomRoutine = `Jour ${index + 1} de l'entraînement ${plan}`;
  await enregistrerRoutine(nomRoutine, exercices);
}




  onMount(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.entrainement && programmes[user.entrainement]) {
      changerPlan(user.entrainement);
    } else {
      changerPlan("Push Pull Legs");
    }
    loading = false;
  });

</script>

<style>
  body {
    background-color: #1e1e1e;
    color: #00FF00;
  }

  .split-title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #00FF00;
  }

  .changer-split-select {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem;
    border: 2px solid #00FF00;
    background: #1e1e1e;
    color: #00FF00;
    border-radius: 8px;
  }

  .programme-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .jour-column {
    display: flex;
    flex-direction: column;
    border-left: 2px solid #444;
    padding: 1rem;
  }

  .jour-title {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #00FF00;
  }

  .exo {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    color: #e0e0e0;
  }

  .exo img {
    width: 48px;
    height: 48px;
    border: 1px solid #666;
  }

  .exo-text {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .ajouter-btn {
    margin-top: auto;
    padding: 0.5rem;
    border: 2px solid #00FF00;
    color: #00FF00;
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
  }
</style>

{#if loading}
  <p class="text-center">Chargement...</p>
{:else}
  <h2 class="split-title">{plan}</h2>
  <select class="changer-split-select" bind:value={plan} on:change={() => changerPlan(plan)}>
    {#each splitsDisponibles as split}
      <option value={split}>{split}</option>
    {/each}
  </select>

  <div class="programme-grid">
    {#each Object.entries(programme) as [jour, exercices], i}
      <div class="jour-column">
        <h3 class="jour-title">Jour {i + 1}</h3>
        {#each exercices as exo}
          <div class="exo">
            <img src={exo.image} alt={exo.nom} />
            <div class="exo-text">
              <span>{exo.description}</span>
              <span>{exo.repetitions} reps</span>
              <span>{exo.series} séries</span>
            </div>
          </div>
        {/each}
        <button class="ajouter-btn"on:click={() => enregistrer(jour, exercices, i)}>ajouter aux entraînements</button>
      </div>
    {/each}
  </div>
{/if}
