<script>
    import { Link } from "svelte-routing";
</script>

<style>
    .plan-container {
        padding: 30px;
        color: white;
        text-align: center;
    }

    .section {
        background: #222;
        padding: 20px;
        border-radius: 10px;
        margin: 15px 0;
        box-shadow: 0px 4px 10px rgba(24, 168, 136, 0.5);
    }
</style>

<div class="plan-container">
    <h1>Plan d'Entraînement</h1>
    
    <div class="section">
        <h3>Type d'Entraînement</h3>
        <p>Push Pull Legs, Full Body, Split...</p>
    </div>
    
    <div class="section">
        <h3>Jours sélectionnés</h3>
        <p>Endroit pour affichage des jours</p>
    </div>
    
    <div class="section">
        <h3>Exercices Planifiés</h3>
        <p>Liste des exercices avec séries et répétitions</p>
    </div>
</div>
