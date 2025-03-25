<script>
    import { Link } from "svelte-routing";
</script>

<style>
    .dashboard-container {
        padding: 30px;
        color: white;
        text-align: center;
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .card {
        background: #222;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(24, 168, 136, 0.5);
        text-align: center;
    }

    .add-button {
        margin-top: 20px;
        padding: 12px 24px;
        background: #18a888;
        border: none;
        color: white;
        font-size: 1.2em;
        border-radius: 10px;
        cursor: pointer;
        transition: 0.3s;
    }

    .add-button:hover {
        background: white;
        color: #18a888;
    }
</style>

<div class="dashboard-container">
    <h1>Tableau de Bord</h1>

    <div class="grid">
        <div class="card">
            <h3>Statistiques principales</h3>
            <p>Placeholder pour poids actuel, objectif et progrès</p>
        </div>

        <div class="card">
            <h3>Calendrier des entraînements</h3>
            <p>Vue hebdomadaire des entraînements à venir</p>
        </div>

        <div class="card">
            <h3>Suivi des repas</h3>
            <p>Résumé des calories consommées vs objectif</p>
        </div>

        <div class="card">
            <h3>Progression des performances</h3>
            <p>Graphique montrant l'évolution</p>
        </div>
    </div>

    <Link to="/ajout-exercice">
        <button class="add-button">➕ Ajouter un exercice</button>
    </Link>

    <Link to="/"> 
        <button class="add-button"> Acceuil</button>
    </Link>
</div>

