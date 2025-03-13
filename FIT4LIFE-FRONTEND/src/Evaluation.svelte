<script>
    import { navigate } from "svelte-routing";

    // Sélections par défaut
    let objectif = "Perdre du poids";
    let experience = "Débutant";
    let entrainement = "Push Pull Legs";
    let poidsActuel = "70 kg";
    let poidsObjectif = "65 kg";
    let frequence = "3 fois par semaine";
    let planNutrition = "Aucun";
    let budget = "$100";
    
    let joursDisponibles = [];
    
    // Options disponibles
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const objectifs = ["Perdre du poids", "Gagner du muscle", "Garder la forme", "Améliorer mon endurance"];
    const experiences = ["Débutant", "Intermédiaire", "Avancé"];
    const entrainements = ["Push Pull Legs", "Full Body", "Split classique", "Entraînement fonctionnel", "Full cardio (HIIT et cardio)", "CrossFit"];
    const frequences = ["1 fois par semaine", "2 fois par semaine", "3 fois par semaine", "4 fois par semaine", "5 fois par semaine", "6 fois par semaine"];
    const poids = [
    "40 kg", "42 kg", "44 kg", "46 kg", "48 kg", "50 kg",
    "52 kg", "54 kg", "56 kg", "58 kg", "60 kg", "62 kg",
    "64 kg", "66 kg", "68 kg", "70 kg", "72 kg", "74 kg",
    "76 kg", "78 kg", "80 kg", "82 kg", "84 kg", "86 kg",
    "88 kg", "90 kg", "92 kg", "94 kg", "96 kg", "98 kg",
    "100 kg", "102 kg", "104 kg", "106 kg", "108 kg", "110 kg",
    "112 kg", "114 kg", "116 kg", "118 kg", "120 kg", "122 kg",
    "124 kg", "126 kg", "128 kg", "130 kg", "132 kg", "134 kg",
    "136 kg", "138 kg", "140 kg", "142 kg", "144 kg", "146 kg",
    "148 kg", "150 kg"
    ];
    const budgets = ["$100", "$150", "$200", "$250", "$300", "$350", "$400", "$450", "$500"];
    const plansNutrition = ["Aucun", "Régime cétogène", "Végétarien", "Végan", "Régime paléo", "Régime méditerranéen", "Alimentation flexible", "High Protein"];

    function toggleJour(jour) {
        if (joursDisponibles.includes(jour)) {
            joursDisponibles = joursDisponibles.filter(j => j !== jour);
        } else {
            joursDisponibles = [...joursDisponibles, jour];
        }
    }

    function soumettreEvaluation() {
        alert(`Évaluation soumise :
        
    Objectif : ${objectif}
    Poids Actuel : ${poidsActuel}
    Poids Objectif : ${poidsObjectif}
    Expérience : ${experience}
    Entraînement : ${entrainement}
    Jours Disponibles : ${joursDisponibles.join(", ")}
    Fréquence d'entraînement : ${frequence}
    Plan Nutritionnel : ${planNutrition}
    Budget Hebdomadaire : ${budget}`);

        navigate("/tableau-de-bord");
    }
</script>

<style>
    .page-wrapper {
        position: relative;
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .page-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url("https://m.media-amazon.com/images/I/71t2iMRG+rL.jpg") no-repeat center center/cover;
        background-size: cover;
        background-position: center;
        z-index: -1;
    }

    .evaluation-container {
        max-width: 600px;
        padding: 20px;
        background: rgba(34, 34, 34, 0.9);
        color: white;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(24, 168, 136, 0.5);
        text-align: center;
        position: relative;
        z-index: 2;
    }

    h2 {
        color: #18a888;
    }

    .input-group {
        margin: 15px 0;
    }

    label {
        display: block;
        font-size: 16px;
        margin-bottom: 5px;
    }

    select, .days-container {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        border: none;
        font-size: 16px;
        background: white;
    }

    .days-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .day {
        width: 30%;
        padding: 8px;
        text-align: center;
        background: #444;
        color: white;
        border-radius: 5px;
        margin: 5px 0;
        cursor: pointer;
        transition: 0.3s;
    }

    .day.selected {
        background: #18a888;
    }

    .submit-btn {
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 1.2em;
        background: #18a888;
        border: none;
        color: white;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.3s;
    }

    .submit-btn:hover {
        background: white;
        color: #18a888;
    }
</style>

<div class="page-wrapper">
    <div class="page-background"></div>
    <div class="evaluation-container">
        <h2>Évaluation Personnalisée</h2>

        <div class="input-group">
            <label>Objectif Fitness</label>
            <select bind:value={objectif}>
                {#each objectifs as opt}
                    <option value={opt}>{opt}</option>
                {/each}
            </select>
        </div>

        <div class="input-group">
            <label>Poids Actuel (Selectionnez à la hausse)</label>
            <select bind:value={poidsActuel}>
                {#each poids as p}
                    <option value={p}>{p}</option>
                {/each}
            </select>
        </div>

        <div class="input-group">
            <label>Poids Objectif</label>
            <select bind:value={poidsObjectif}>
                {#each poids as p}
                    <option value={p}>{p}</option>
                {/each}
            </select>
        </div>

        <div class="input-group">
            <label>Expérience Fitness</label>
            <select bind:value={experience}>
                {#each experiences as exp}
                    <option value={exp}>{exp}</option>
                {/each}
            </select>
        </div>

        <div class="input-group">
            <label>Type d'Entraînement Préféré</label>
            <select bind:value={entrainement}>
                {#each entrainements as ent}
                    <option value={ent}>{ent}</option>
                {/each}
            </select>
        </div>

        <div class="input-group">
            <label>Jours Disponibles</label>
            <div class="days-container">
                {#each jours as jour}
                    <div class="day {joursDisponibles.includes(jour) ? 'selected' : ''}" on:click={() => toggleJour(jour)}>
                        {jour}
                    </div>
                {/each}
            </div>
        </div>

        <div class="input-group">
            <label>Fréquence d'Entraînement</label>
            <select bind:value={frequence}>
                {#each frequences as f}
                    <option value={f}>{f}</option>
                {/each}
            </select>
        </div>

        <div class="input-group">
            <label>Plan Nutritionnel</label>
            <select bind:value={planNutrition}>
                {#each plansNutrition as pn}
                    <option value={pn}>{pn}</option>
                {/each}
            </select>
        </div>

        <div class="input-group">
            <label>Budget Hebdomadaire</label>
            <select bind:value={budget}>
                {#each budgets as b}
                    <option value={b}>{b}</option>
                {/each}
            </select>
        </div>

        <button class="submit-btn" on:click={soumettreEvaluation}>Valider</button>
    </div>
</div>
