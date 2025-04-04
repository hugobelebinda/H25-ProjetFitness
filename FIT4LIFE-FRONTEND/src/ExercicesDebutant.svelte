<script>
    let selectedPartie = "";

    const partiesDuCorps = [
        "Poitrine", "Dos", "Jambes", "Bras",
        "Épaules", "Abdominaux", "Cardio", "CrossFit"
    ];

    const exercices = {
        Poitrine: [
            { nom: "Développé couché", series: 4, repetitions: 10, image: "https://example.com/developpe-couche.jpg" },
            { nom: "Pompes", series: 3, repetitions: 15, image: "https://example.com/pompes.jpg" },
            { nom: "Développé incliné", series: 4, repetitions: 8, image: "https://example.com/developpe-incline.jpg" },
            { nom: "Écarté couché", series: 3, repetitions: 12, image: "https://example.com/ecurte-couche.jpg" },
            { nom: "Dips", series: 3, repetitions: 10, image: "https://example.com/dips.jpg" },
            { nom: "Développé décliné", series: 3, repetitions: 8, image: "https://example.com/developpe-decline.jpg" },
            { nom: "Pec deck", series: 4, repetitions: 12, image: "https://example.com/pec-deck.jpg" },
            { nom: "Pompes surélevées", series: 3, repetitions: 12, image: "https://example.com/pompes-surelevees.jpg" },
            { nom: "Machine à poitrine", series: 4, repetitions: 10, image: "https://example.com/machine-poitrine.jpg" },
            { nom: "Développé haltères", series: 4, repetitions: 8, image: "https://example.com/developpe-halteres.jpg" }
        ],
        Dos: [
            { nom: "Tractions", series: 3, repetitions: 8, image: "https://example.com/tractions.jpg" },
            { nom: "Rowing barre", series: 4, repetitions: 10, image: "https://example.com/rowing-barre.jpg" },
            { nom: "Tirage horizontal", series: 4, repetitions: 12, image: "https://example.com/tirage-horizontal.jpg" },
            { nom: "Tirage vertical", series: 4, repetitions: 12, image: "https://example.com/tirage-vertical.jpg" },
            { nom: "Soulevé de terre", series: 4, repetitions: 6, image: "https://example.com/souleve-terre.jpg" },
            { nom: "Rowing haltères", series: 3, repetitions: 12, image: "https://example.com/rowing-halteres.jpg" },
            { nom: "Pull-over", series: 3, repetitions: 15, image: "https://example.com/pull-over.jpg" },
            { nom: "Face pull", series: 3, repetitions: 12, image: "https://example.com/face-pull.jpg" },
            { nom: "Machine dos", series: 4, repetitions: 10, image: "https://example.com/machine-dos.jpg" },
            { nom: "Deadlift roumain", series: 3, repetitions: 8, image: "https://example.com/deadlift-roumain.jpg" }
        ],
        Jambes: [
            { nom: "Squats", series: 4, repetitions: 10, image: "https://example.com/squats.jpg" },
            { nom: "Fentes", series: 3, repetitions: 12, image: "https://example.com/fentes.jpg" },
            { nom: "Leg press", series: 4, repetitions: 12, image: "https://example.com/leg-press.jpg" },
            { nom: "Soulevé de terre jambes tendues", series: 3, repetitions: 10, image: "https://example.com/souleve-jambes.jpg" },
            { nom: "Extensions de jambes", series: 4, repetitions: 12, image: "https://example.com/extensions-jambes.jpg" },
            { nom: "Curl jambes", series: 3, repetitions: 12, image: "https://example.com/curl-jambes.jpg" },
            { nom: "Hip thrust", series: 3, repetitions: 10, image: "https://example.com/hip-thrust.jpg" },
            { nom: "Montée de marche", series: 3, repetitions: 12, image: "https://example.com/montee-marche.jpg" },
            { nom: "Jump squats", series: 3, repetitions: 15, image: "https://example.com/jump-squats.jpg" },
            { nom: "Mollets debout", series: 3, repetitions: 20, image: "https://example.com/mollets-debout.jpg" }
        ],
        Bras: [
            { nom: "Curl biceps", series: 4, repetitions: 12, image: "https://example.com/curl-biceps.jpg" },
            { nom: "Extensions triceps", series: 3, repetitions: 10, image: "https://example.com/extensions-triceps.jpg" },
            { nom: "Curl marteau", series: 3, repetitions: 12, image: "https://example.com/curl-marteau.jpg" },
            { nom: "Barre au front", series: 3, repetitions: 10, image: "https://example.com/barre-front.jpg" },
            { nom: "Curl concentré", series: 3, repetitions: 10, image: "https://example.com/curl-concentre.jpg" },
            { nom: "Kickbacks", series: 3, repetitions: 12, image: "https://example.com/kickbacks.jpg" },
            { nom: "Curl câble", series: 3, repetitions: 15, image: "https://example.com/curl-cable.jpg" },
            { nom: "Pushdown triceps", series: 4, repetitions: 12, image: "https://example.com/pushdown.jpg" },
            { nom: "Curl inversé", series: 3, repetitions: 10, image: "https://example.com/curl-inverse.jpg" },
            { nom: "Pompes triceps", series: 3, repetitions: 12, image: "https://example.com/pompes-triceps.jpg" }
        ],
        Épaules: [
            { nom: "Développé militaire", series: 4, repetitions: 10, image: "https://example.com/dev-militaire.jpg" },
            { nom: "Élévations latérales", series: 3, repetitions: 15, image: "https://example.com/elevations-lat.jpg" },
            { nom: "Oiseau", series: 3, repetitions: 12, image: "https://example.com/oiseau.jpg" },
            { nom: "Développé haltères", series: 4, repetitions: 10, image: "https://example.com/dev-halteres.jpg" },
            { nom: "Shrugs", series: 3, repetitions: 12, image: "https://example.com/shrugs.jpg" },
            { nom: "Élévations frontales", series: 3, repetitions: 12, image: "https://example.com/elevations-front.jpg" }
        ],
        Abdominaux: [
            { nom: "Crunchs", series: 3, repetitions: 20, image: "https://example.com/crunchs.jpg" },
            { nom: "Gainage", series: 3, repetitions: 60, image: "https://example.com/gainage.jpg" },
            { nom: "Relevés de jambes", series: 3, repetitions: 15, image: "https://example.com/releves-jambes.jpg" },
            { nom: "Russian twists", series: 3, repetitions: 20, image: "https://example.com/russian-twists.jpg" }
        ],
        Cardio: [
            { nom: "Course à pied", duration: "20 min", image: "https://example.com/course.jpg" },
            { nom: "Corde à sauter", duration: "15 min", image: "https://example.com/corde.jpg" },
            { nom: "Vélo stationnaire", duration: "30 min", image: "https://example.com/velo.jpg" }
        ],
        CrossFit: [
            {
                nom: "Circuit débutant",
                description: "3 rounds: 10 squats, 10 pompes, 10 sit-ups, 200m course",
                image: "https://example.com/circuit-crossfit.jpg"
            }
        ]
    };
</script>

<style>
    .container {
        padding: 30px;
        max-width: 900px;
        margin: auto;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    h2, label {
        color: #18a888;
    }

    select {
        width: 100%;
        padding: 10px;
        margin: 15px 0;
        border-radius: 5px;
        border: 1px solid #ccc;
    }

    .exercise-card {
        background: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        margin: 10px 0;
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .exercise-card img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
    }
</style>

<div class="container">
    <h2>Choisis la partie du corps à entraîner</h2>

    <label for="partie-select">Partie du corps :</label>
    <select id="partie-select" bind:value={selectedPartie}>
        <option value="" disabled selected>-- Choisir --</option>
        {#each partiesDuCorps as partie}
            <option value={partie}>{partie}</option>
        {/each}
    </select>

    {#if selectedPartie}
        <div class="exercise-list">
            <h3>Exercices pour {selectedPartie} :</h3>
            {#each exercices[selectedPartie] as exercice}
                <div class="exercise-card">
                    <img src={exercice.image} alt={exercice.nom} />
                    <div>
                        <p><strong>{exercice.nom}</strong></p>
                        {#if exercice.series}
                            <p>{exercice.series} séries de {exercice.repetitions} répétitions</p>
                        {:else if exercice.duration}
                            <p>Durée : {exercice.duration}</p>
                        {:else if exercice.description}
                            <p>{exercice.description}</p>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
