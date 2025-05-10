<script>

    import { navigate } from "svelte-routing";
    import { get } from "svelte/store";
import { user } from "./common/auth"; 

    // Sélections par défaut
    let objectif = "Perdre du poids";
    
   let age = 20;
    
    let experience = "Débutant";
    let entrainement = "Push Pull Legs";
    let poidsActuel = "70 kg";
    let poidsObjectif = "65 kg";
    let niveauActivite = 1.55; 
    let frequence = "3 fois par semaine";
    let planNutrition = "Aucun";
    let sexe = "Homme";
    let taille = 170;

    
    let joursDisponibles = [];
    
  
    const ages = Array.from({ length: 150 }, (_, i) => i + 1);

    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const objectifs = ["Perdre du poids", "Gagner du muscle", "Garder la forme", "Améliorer mon endurance"];
    const experiences = ["Débutant", "Intermédiaire", "Avancé"];
    const entrainements = ["Push Pull Legs", "Full Body", "Split d'un muscle par jour", "Arnold Split", "Fullbody", "Arnold X PushPullLeg"];
    const frequences = ["1 fois par semaine", "2 fois par semaine", "3 fois par semaine", "4 fois par semaine", "5 fois par semaine", "6 fois par semaine"];
    const poids = Array.from({ length: 171 }, (_, i) => `${30 + i} kg`);
    const niveauxActivite = [
    { label: "Repos (aucune activité)", value: 1.2 },
    { label: "Léger (1-3 jours/semaine)", value: 1.375 },
    { label: "Modéré (3-5 jours/semaine)", value: 1.55 },
    { label: "Intense (6-7 jours/semaine)", value: 1.725 },
    { label: "Très intense (2x/jour ou travail physique)", value: 1.9 }
];
    function toggleJour(jour) {
        if (joursDisponibles.includes(jour)) {
            joursDisponibles = joursDisponibles.filter(j => j !== jour);
        } else {
            joursDisponibles = [...joursDisponibles, jour];
        }
    }

    async function soumettreEvaluation() {
        //alert("Fonction appelée !");
    const currentUser = get(user);
    

    

    if (!currentUser || !currentUser._id) {
        alert("Utilisateur non connecté.");
        return;
    }
    
    const token = localStorage.getItem("token");

    if (!token) {
  alert("Token non trouvé, veuillez vous reconnecter.");
  return;
}

    const body = {
        poids: parseInt(poidsActuel), 
        age: parseInt(age),
        dispo: joursDisponibles.join(', '),
        objectif,
        poidsObjectif,
        experience,
        entrainement,
        frequence,
        planNutrition,
       sexe,
        taille: parseInt(taille),
        niveauActivite: parseFloat(niveauActivite)
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
        console.log("Évaluation enregistrée !");
  console.log("Calories recommandées :", data.calories); 
  console.log("Utilisateur mis à jour :", data.user);    
  user.set(data.user); 

        navigate("/tableau-de-bord");
      } else {
        const data = await res.json();
        alert(" Erreur : " + (data.message || "Échec de l'enregistrement"));
        
      }
    } catch (error) {

      console.error("Erreur:", error);
      alert("Erreur lors de l'envoi au serveur.");
    }
  }

  $: poidsObjectifOptions = poids.filter(p => {
    const poidsActuelKg = parseInt(poidsActuel); // "80 kg" → 80
    const pKg = parseInt(p); // "65 kg" → 65

    if (objectif === "Perdre du poids") {
        return pKg < poidsActuelKg;
    } else if (objectif === "Gagner du muscle") {
        return pKg > poidsActuelKg;
    } else {
        return true; // Aucun filtre pour les autres objectifs
    }
});


    
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
            <label>Age</label>
            <select bind:value={age}>
                {#each ages as a}
                    <option value={a}>{a}</option>
                {/each}
            </select>
        </div> 
        

        <div class="input-group">
            <label>Poids Objectif</label>
            <select bind:value={poidsObjectif}>
                {#each poidsObjectifOptions as p}
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
            <label>Niveau d'activité</label>
            <select bind:value={niveauActivite}>
                {#each niveauxActivite as na}
                    <option value={na.value}>{na.label}</option>
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

        <button class="submit-btn" on:click={soumettreEvaluation}>Valider</button>
    </div>
</div>
