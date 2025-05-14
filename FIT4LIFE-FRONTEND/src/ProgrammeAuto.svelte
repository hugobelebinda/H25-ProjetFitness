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
        nom: "Développé couché à la barre",
        image: "https://via.placeholder.com/64",
        description: "Développé couché à la barre: Exercice de base pour les pectoraux.",
        series: 4,
        repetitions: 8
      },
      {
        nom: "Développé incliné aux haltères",
        image: "https://via.placeholder.com/64",
        description: "Développé incliné aux haltères: Cible le haut des pectoraux.",
        series: 3,
        repetitions: 10
      },
      {
        nom: "Élévations latérales aux haltères",
        image: "https://via.placeholder.com/64",
        description: "Élévations latérales aux haltères: Renforce les épaules latérales.",
        series: 3,
        repetitions: 15
      },
      {
        nom: "Extension triceps à la poulie haute (corde)",
        image: "https://via.placeholder.com/64",
        description: "Extension triceps à la poulie haute (corde): Cible les triceps efficacement.",
        series: 3,
        repetitions: 12
      }
    ],
    Pull: [
      {
        nom: "Tractions pronation",
        image: "https://via.placeholder.com/64",
        description: "Tractions pronation: Renforce le dos et les biceps.",
        series: 4,
        repetitions: 10
      },
      {
        nom: "Rowing à la poulie basse",
        image: "https://via.placeholder.com/64",
        description: "Rowing à la poulie basse: Exercice horizontal pour le dos.",
        series: 4,
        repetitions: 12
      },
      {
        nom: "Curl biceps aux haltères",
        image: "https://via.placeholder.com/64",
        description: "Curl biceps aux haltères: Travail direct des biceps.",
        series: 3,
        repetitions: 12
      },
      {
        nom: "Face pull à la poulie",
        image: "https://via.placeholder.com/64",
        description: "Face pull à la poulie: Renforce les deltoïdes postérieurs et les trapèzes.",
        series: 3,
        repetitions: 15
      }
    ],
    Legs: [
      {
        nom: "Squat à la barre libre",
        image: "https://via.placeholder.com/64",
        description: "Squat à la barre libre: Exercice de base pour les jambes.",
        series: 4,
        repetitions: 8
      },
      {
        nom: "Presse à jambes inclinée",
        image: "https://via.placeholder.com/64",
        description: "Presse à jambes inclinée: Travail des quadriceps et fessiers.",
        series: 3,
        repetitions: 12
      },
      {
        nom: "Fentes marchées",
        image: "https://via.placeholder.com/64",
        description: "Fentes marchées: Fentes dynamiques pour jambes et équilibre.",
        series: 3,
        repetitions: 12
      },
      {
        nom: "Leg curl allongé",
        image: "https://via.placeholder.com/64",
        description: "Leg curl allongé: Travail en isolation des ischios-jambiers.",
        series: 3,
        repetitions: 15
      }
    ]
  },

  "Upper Lower": {
    Upper: [
      {
        nom: "Développé couché à la barre",
        image: "https://via.placeholder.com/64",
        description: "Développé couché à la barre: Travail des pectoraux en force.",
        series: 4,
        repetitions: 10
      },
      {
        nom: "Développé militaire à la barre",
        image: "https://via.placeholder.com/64",
        description: "Développé militaire à la barre: Cible les épaules antérieures.",
        series: 4,
        repetitions: 10
      },
      {
        nom: "Tirage horizontal à la poulie basse",
        image: "https://via.placeholder.com/64",
        description: "Tirage horizontal à la poulie basse: Renforce les dorsaux et le milieu du dos.",
        series: 3,
        repetitions: 12
      },
      {
        nom: "Tractions pronation",
        image: "https://via.placeholder.com/64",
        description: "Tractions pronation: Travail complet du dos et biceps.",
        series: 4,
        repetitions: 10
      },
      {
        nom: "Curl biceps à la barre EZ",
        image: "https://via.placeholder.com/64",
        description: "Curl biceps à la barre EZ: Cible les biceps efficacement.",
        series: 3,
        repetitions: 12
      },
      {
        nom: "Extension triceps à la poulie haute (corde)",
        image: "https://via.placeholder.com/64",
        description: "Extension triceps à la poulie haute (corde): Isolation des triceps.",
        series: 3,
        repetitions: 12
      }
    ],
    Lower: [
      {
        nom: "Squat à la barre libre",
        image: "https://via.placeholder.com/64",
        description: "Squat à la barre libre: Exercice de base pour les jambes.",
        series: 4,
        repetitions: 10
      },
      {
        nom: "Soulevé de terre jambes tendues avec haltères",
        image: "https://via.placeholder.com/64",
        description: "Soulevé de terre jambes tendues avec haltères: Travail des ischios-jambiers.",
        series: 4,
        repetitions: 10
      },
      {
        nom: "Fentes avec haltères",
        image: "https://via.placeholder.com/64",
        description: "Fentes avec haltères: Mobilité et équilibre pour les jambes.",
        series: 3,
        repetitions: 12
      },
      {
        nom: "Mollets debout à la machine",
        image: "https://via.placeholder.com/64",
        description: "Mollets debout à la machine: Cible les mollets.",
        series: 3,
        repetitions: 12
      },
      {
        nom: "Leg curl allongé",
        image: "https://via.placeholder.com/64",
        description: "Leg curl allongé: Isolation des ischios.",
        series: 3,
        repetitions: 12
      },
      {
        nom: "Leg extension",
        image: "https://via.placeholder.com/64",
        description: "Leg extension: Cible le quadriceps.",
        series: 3,
        repetitions: 12
      }
    ]
  },

  "Arnold Split": {
  Poitrine: [
    {
      nom: "Développé couché aux haltères",
      image: "https://via.placeholder.com/64",
      description: "Développé couché aux haltères: Travail global des pectoraux.",
      series: 4,
      repetitions: 10
    },
    {
      nom: "Développé incliné à la barre",
      image: "https://via.placeholder.com/64",
      description: "Développé incliné à la barre: Cible le haut des pectoraux.",
      series: 4,
      repetitions: 8
    },
    {
      nom: "Écarté à la poulie vis-à-vis",
      image: "https://via.placeholder.com/64",
      description: "Écarté à la poulie vis-à-vis: Isolation et étirement des pectoraux.",
      series: 3,
      repetitions: 15
    },
    {
      nom: "Dips",
      image: "https://via.placeholder.com/64",
      description: "Dips: Renforce les pectoraux et triceps.",
      series: 3,
      repetitions: 12
    }
  ],
  Dos: [
    {
      nom: "Tirage horizontal à la poulie basse",
      image: "https://via.placeholder.com/64",
      description: "Tirage horizontal à la poulie basse: Travail l’épaisseur du dos.",
      series: 4,
      repetitions: 12
    },
    {
      nom: "Tirage vertical à la poulie (prise neutre)",
      image: "https://via.placeholder.com/64",
      description: "Tirage vertical à la poulie (prise neutre): Renforce le dos de façon globale.",
      series: 4,
      repetitions: 10
    },
    {
      nom: "Rowing à la T-bar",
      image: "https://via.placeholder.com/64",
      description: "Rowing à la T-bar: Accent sur le milieu du dos.",
      series: 3,
      repetitions: 12
    },
    {
      nom: "Extensions lombaires au banc",
      image: "https://via.placeholder.com/64",
      description: "Extensions lombaires au banc: Renforce les lombaires.",
      series: 3,
      repetitions: 15
    }
  ],
  Jambes: [
    {
      nom: "Squat à la barre libre",
      image: "https://via.placeholder.com/64",
      description: "Squat à la barre libre: Exercice fondamental jambes/fessiers.",
      series: 4,
      repetitions: 8
    },
    {
      nom: "Leg extension",
      image: "https://via.placeholder.com/64",
      description: "Leg extension: Isolation des quadriceps.",
      series: 3,
      repetitions: 15
    },
    {
      nom: "Leg curl allongé",
      image: "https://via.placeholder.com/64",
      description: "Leg curl allongé: Travail des ischios-jambiers.",
      series: 3,
      repetitions: 15
    },
    {
      nom: "Mollets assis à la machine",
      image: "https://via.placeholder.com/64",
      description: "Mollets assis à la machine: Cible le soléaire et les mollets.",
      series: 4,
      repetitions: 20
    }
  ],
  Épaules: [
    {
      nom: "Développé haltères assis",
      image: "https://via.placeholder.com/64",
      description: "Développé haltères assis: Travail global des deltoïdes.",
      series: 4,
      repetitions: 10
    },
    {
      nom: "Élévations latérales aux haltères",
      image: "https://via.placeholder.com/64",
      description: "Élévations latérales aux haltères: Isolation du deltoïde moyen.",
      series: 3,
      repetitions: 15
    },
    {
      nom: "Face pull à la poulie",
      image: "https://via.placeholder.com/64",
      description: "Face pull à la poulie: Renforce l’arrière des épaules.",
      series: 3,
      repetitions: 15
    }
  ],
  Bras: [
    {
      nom: "Curl biceps aux haltères",
      image: "https://via.placeholder.com/64",
      description: "Curl biceps aux haltères: Cible les biceps de manière équilibrée.",
      series: 3,
      repetitions: 12
    },
    {
      nom: "Curl marteau",
      image: "https://via.placeholder.com/64",
      description: "Curl marteau: Renforce le brachial et les avant-bras.",
      series: 3,
      repetitions: 12
    },
    {
      nom: "Extension triceps à la poulie haute (corde)",
      image: "https://via.placeholder.com/64",
      description: "Extension triceps à la poulie haute (corde): Travail précis des triceps.",
      series: 3,
      repetitions: 12
    },
    {
      nom: "Dips sur banc",
      image: "https://via.placeholder.com/64",
      description: "Dips sur banc: Renforcement général des triceps.",
      series: 3,
      repetitions: 15
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

  async function toutEnregistrer() {
  const jours = Object.entries(programme);
  for (let i = 0; i < jours.length; i++) {
    const [jour, exercices] = jours[i];
    const nomRoutine = `Jour ${i + 1} de l'entraînement ${plan}`;
    await enregistrerRoutine(nomRoutine, exercices);
  }
  alert("Tous les entraînements ont été ajoutés !");
}


</script>

<style>
  .page-container {
  background-color: #181818;
  color: white;
  padding: 40px;
  min-height: 100vh;
}

.split-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #18a888;
}

.changer-split-select {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  border: 2px solid #18a888;
  background: #222;
  color: white;
  border-radius: 8px;
}

.programme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 20px;
}

.jour-column {
  background-color: #222;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 15px rgba(24, 168, 136, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.jour-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1.2rem;
  color: #18a888;
}

.exo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.exo img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}

.exo-text {
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  color: #ccc;
}

.ajouter-btn {
  margin-top: auto;
  padding: 0.6rem;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  background: #18a888;
  cursor: pointer;
  transition: background 0.3s;
}

.ajouter-btn:hover {
  background: #13c1a3;
}
.ajouter-btn-global {
  display: block;
  margin: 0 auto 20px auto;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  background-color: #18a888;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.ajouter-btn-global:hover {
  background-color: #13c1a3;
}

</style>

{#if loading}
  <p class="text-center">Chargement...</p>
{:else}
  <div class="page-container">
    <h2 class="split-title">{plan}</h2>
    <select class="changer-split-select" bind:value={plan} on:change={() => changerPlan(plan)}>
      {#each splitsDisponibles as split}
        <option value={split}>{split}</option>
      {/each}
    </select>
<button class="ajouter-btn-global" on:click={toutEnregistrer}>
  Ajouter tout le programme
</button>


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
          <button class="ajouter-btn" on:click={() => enregistrer(jour, exercices, i)}>ajouter aux entraînements</button>
        </div>
      {/each}
    </div>
  </div>
{/if}
