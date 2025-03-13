<script>
    import { Link } from "svelte-routing";
</script>

<style>
    .suivi-container {
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

<div class="suivi-container">
    <h1>Suivi des Progrès</h1>
    
    <div class="section">
        <h3>Évolution du Poids</h3>
        <p>Placeholder pour un graphique</p>
    </div>
    
    <div class="section">
        <h3>Historique des entraînements</h3>
        <p>Liste des séances passées</p>
    </div>
    
    <div class="section">
        <h3>Suivi Nutritionnel</h3>
        <p>Calories et macros consommés</p>
    </div>
</div>
