<script>
    import { Link } from "svelte-routing";
</script>

<style>
    .nutrition-container {
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

<div class="nutrition-container">
    <h1>Plan Nutritionnel</h1>
    
    <div class="section">
        <h3>Type de Diète</h3>
        <p>Choix entre Keto, Vegan, Haute Protéine...</p>
    </div>
    
    <div class="section">
        <h3>Plan de Repas</h3>
        <p>Endroit pour repas matin, midi, soir</p>
    </div>
    
    <div class="section">
        <h3>Budget Nutritionnel</h3>
        <p>Option pour définir un budget</p>
    </div>
</div>
