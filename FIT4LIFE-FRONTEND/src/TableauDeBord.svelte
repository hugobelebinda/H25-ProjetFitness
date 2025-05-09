<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import { Calendar } from 'svelte-calendar'; // Exemple si tu veux un package calendrier

    let nutriments = [
        { nom: 'Protéines', consommé: 120 },
        { nom: 'Glucides', consommé: 200 },
        { nom: 'Lipides', consommé: 60 }
    ];

    onMount(() => {
        // Graphique 1 : Poids
        new Chart(document.getElementById('poidsChart'), {
            type: 'line',
            data: {
                labels: ['S1', 'S2', 'S3', 'S4'],
                datasets: [{
                    label: 'Poids (kg)',
                    data: [82, 80.5, 79.8, 78.5],
                    borderColor: '#18a888',
                    backgroundColor: 'rgba(24,168,136,0.2)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: { plugins: { legend: { labels: { color: 'white' } } }, scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } } }
        });

        // Graphique 2 : Performances
        new Chart(document.getElementById('perfChart'), {
            type: 'bar',
            data: {
                labels: ['S1', 'S2', 'S3', 'S4'],
                datasets: [{
                    label: 'Performance',
                    data: [10, 20, 30, 40],
                    backgroundColor: '#18a888'
                }]
            },
            options: { plugins: { legend: { labels: { color: 'white' } } }, scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } } }
        });
    });
</script>

<style>
    .dashboard-container {
        padding: 40px;
        color: white;
        background-color: #181818;
        min-height: 100vh;
        display: grid;
        gap: 30px;
    }

    .section {
        background: #222;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 0 15px rgba(24, 168, 136, 0.3);
    }

    h2 {
        color: #18a888;
        margin-bottom: 20px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 10px;
        border: 1px solid #333;
        text-align: center;
    }

    th {
        background: #18a888;
    }

    td {
        background: #333;
    }

    input {
        width: 80px;
        padding: 5px;
        border-radius: 5px;
        border: none;
        text-align: center;
    }

    canvas {
        max-width: 100%;
    }
</style>

<div class="dashboard-container">
    <!-- Statistiques -->
    <div class="section">
        <h2>📈 Statistiques</h2>
        <canvas id="poidsChart"></canvas>
    </div>

    <!-- Calendrier -->
    <div class="section">
        <h2>🗓️ Calendrier des entraînements</h2>

    </div>

    <!-- Suivi Nutritionnel -->
    <div class="section">
        <h2>🍽️ Suivi Nutritionnel</h2>
        <table>
            <thead>
                <tr>
                    <th>Nutriment</th>
                    <th>Consommé (g)</th>
                </tr>
            </thead>
            <tbody>
                {#each nutriments as n}
                <tr>
                    <td>{n.nom}</td>
                    <td>
                        <input type="number" bind:value={n.consommé} /> g
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <!-- Performances -->
    <div class="section">
        <h2>💪 Performances</h2>
        <canvas id="perfChart"></canvas>
    </div>
</div>