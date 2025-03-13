<script>
    import { navigate } from "svelte-routing";

    let titre = "";
    let typeExercice = "Course";
    let duree = "";
    let distance = "";
    let caloriesBrulees = "";
    let date = "";
    let notes = "";

    const typesExercice = ["Course", "Cyclisme", "Musculation", "Natation", "Randonnée", "Autre"];

    function enregistrerExercice() {
        alert(`Exercice ajouté :\n\nTitre : ${titre}\nType : ${typeExercice}\nDurée : ${duree}\nDistance : ${distance}\nCalories brûlées : ${caloriesBrulees}\nDate : ${date}\nNotes : ${notes}`);
        navigate("/tableau-de-bord");
    }
</script>

<style>
    .exercice-container {
        max-width: 700px;
        margin: 50px auto;
        padding: 20px;
        background: #222;
        color: white;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(24, 168, 136, 0.5);
        text-align: center;
    }

    h2 {
        color: #18a888;
        margin-bottom: 20px;
    }

    .input-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
    }

    .input-group {
        text-align: left;
    }

    label {
        display: block;
        font-size: 16px;
        margin-bottom: 5px;
    }

    input, select, textarea {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        border: none;
        font-size: 16px;
        background: #333;
        color: white;
    }

    textarea {
        height: 80px;
        resize: none;
    }

    .submit-btn, .cancel-btn {
        margin-top: 20px;
        padding: 12px 24px;
        font-size: 1.2em;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: 0.3s;
    }

    .submit-btn {
        background: #18a888;
        color: white;
    }

    .submit-btn:hover {
        background: white;
        color: #18a888;
    }

    .cancel-btn {
        background: red;
        color: white;
        margin-left: 10px;
    }

    .cancel-btn:hover {
        background: white;
        color: red;
    }

    .button-container {
        text-align: center;
        margin-top: 20px;
    }
</style>

<div class="exercice-container">
    <h2>Ajouter un Exercice</h2>

    <div class="input-group">
        <label>Titre</label>
        <input type="text" bind:value={titre} placeholder="Ex: Sortie du matin, Entraînement muscu..." />
    </div>

    <div class="input-grid">
        <div class="input-group">
            <label>Type d'Exercice</label>
            <select bind:value={typeExercice}>
                {#each typesExercice as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
        </div>

        <div class="input-group">
            <label>Durée (minutes)</label>
            <input type="number" bind:value={duree} placeholder="Ex: 45" />
        </div>

        <div class="input-group">
            <label>Distance (km) (optionnel)</label>
            <input type="number" bind:value={distance} placeholder="Ex: 5" />
        </div>

        <div class="input-group">
            <label>Calories Brûlées</label>
            <input type="number" bind:value={caloriesBrulees} placeholder="Ex: 350" />
        </div>

        <div class="input-group">
            <label>Date</label>
            <input type="date" bind:value={date} />
        </div>

        <div class="input-group">
            <label>Notes (optionnel)</label>
            <textarea bind:value={notes} placeholder="Ajoutez un commentaire sur votre entraînement"></textarea>
        </div>
    </div>

    <div class="button-container">
        <button class="submit-btn" on:click={enregistrerExercice}>Enregistrer</button>
        <button class="cancel-btn" on:click={() => navigate("/tableau-de-bord")}>Annuler</button>
    </div>
</div>

