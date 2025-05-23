<script>
  import { onMount, onDestroy } from "svelte";
  import { Chart, registerables } from "chart.js";

  Chart.register(...registerables);

  export let historique = [];

  let canvasEl;
  let chart;

  onMount(() => {
    if (!historique || historique.length === 0) return;

    const sorted = [...historique].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sorted.map(e => new Date(e.date).toLocaleDateString());
    const data = sorted.map(e => e.poids);

    chart = new Chart(canvasEl, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: "Poids (kg)",
          data,
          borderColor: '#18a888',
          backgroundColor: 'rgba(24, 168, 136, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#18a888',
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { ticks: { color: '#ccc' }, grid: { color: '#333' } },
          y: { beginAtZero: false, ticks: { color: '#ccc' }, grid: { color: '#333' } }
        },
        plugins: {
          legend: { labels: { color: '#18a888', font: { size: 14 } } }
        }
      }
    });
  });

  // Met à jour le graphique si l'historique change
  $: if (chart && historique && historique.length > 0) {
    const sorted = [...historique].sort((a, b) => new Date(a.date) - new Date(b.date));
    chart.data.labels = sorted.map(e => new Date(e.date).toLocaleDateString());
    chart.data.datasets[0].data = sorted.map(e => e.poids);
    chart.update();
  }

  onDestroy(() => {
    if (chart) chart.destroy();
  });
</script>
