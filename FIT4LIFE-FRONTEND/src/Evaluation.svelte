<script>

    import { navigate } from "svelte-routing";
    import { get } from "svelte/store";
import { user } from "./common/auth"; 

    // Sélections par défaut
    let objectif = "Perdre du poids";
    let experience = "Débutant";
    let entrainement = "Push Pull Legs";
    let poidsActuel = "70 kg";
    let poidsObjectif = "65 kg";
    let frequence = "3 fois par semaine";
    let planNutrition = "Aucun";
    let budget = "$100";
    let sexe = "Homme";
    let taille = 170;

    
    let joursDisponibles = [];
    
    // Options disponibles
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const objectifs = ["Perdre du poids", "Gagner du muscle", "Garder la forme", "Améliorer mon endurance"];
    const experiences = ["Débutant", "Intermédiaire", "Avancé"];
    const entrainements = ["Push Pull Legs", "Full Body", "Split classique", "Entraînement fonctionnel", "Full cardio (HIIT et cardio)", "CrossFit"];
    const frequences = ["1 fois par semaine", "2 fois par semaine", "3 fois par semaine", "4 fois par semaine", "5 fois par semaine", "6 fois par semaine"];
    const poids = Array.from({ length: 171 }, (_, i) => `${30 + i} kg`);
    const budgets = ["$100", "$150", "$200", "$250", "$300", "$350", "$400", "$450", "$500"];
    const plansNutrition = ["Aucun", "Régime cétogène", "Végétarien", "Végan", "Régime paléo", "Régime méditerranéen", "Alimentation flexible", "High Protein"];

    function toggleJour(jour) {
        if (joursDisponibles.includes(jour)) {
            joursDisponibles = joursDisponibles.filter(j => j !== jour);
        } else {
            joursDisponibles = [...joursDisponibles, jour];
        }
    }

    async function soumettreEvaluation() {
    const currentUser = get(user);

    if (!currentUser || !currentUser._id) {
        alert("Utilisateur non connecté.");
        return;
    }

    const body = {
        poids: parseInt(poidsActuel), // "70 kg" => 70
        dispo: joursDisponibles.join(', '),
        objectif,
        poidsObjectif,
        experience,
        entrainement,
        frequence,
        planNutrition,
        budget,
       sexe,
        taille: parseInt(taille)
    };

    try {
        const res = await fetch(`http://localhost:4201/user/evaluation/${currentUser._id}`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
});

        if (res.ok) {
            console.log("✅ Évaluation enregistrée !");
            navigate("/tableau-de-bord");
        } else {
            const data = await res.json();
            alert("❌ Erreur : " + (data.message || "Échec de l'enregistrement"));
        }
    } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de l'envoi au serveur.");
    }

    console.log(get(user))
}


    /*function soumettreEvaluation() {
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
    } */
    
</script>



<style>
    .page-wrapper {
        position: relative;
    width: 100%;
    min-height: 100vh; 
    display: flex;
    align-items: center;
    justify-content: flex-start; 
    flex-direction: column;
    padding: 40px 20px;
    box-sizing: border-box;
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
            <label>Sexe</label>
            <select bind:value={sexe}>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
            </select>
        </div>
        
        <div class="input-group">
            <label>Taille (en cm)</label>
            <select bind:value={taille}>
                {#each Array.from({ length: 81 }, (_, i) => 140 + i) as cm}
                    <option value={cm}>{cm} cm</option>
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
