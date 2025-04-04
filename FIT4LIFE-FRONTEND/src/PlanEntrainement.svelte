<script>
    import { Link } from 'svelte-routing';
    import { onMount } from 'svelte';
    import { marked } from "marked";
  
    let planIA = "";
    let loading = false;

    function renderMarkdown(text) {
    return marked.parse(text); 
  }
  
    async function genererAvecIA() {
  loading = true;
  planIA = "";

  try {
    const payload = {
      objectif: "Perdre du poids",
      experience: "Débutant",
      type: "Full Body"
    };

    console.log("📤 Envoi de la requête à l'IA avec:", payload);

    const res = await fetch("http://localhost:3001/api/generer-entrainement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("📩 Réponse reçue:", data);

    planIA = data.answer || "Une erreur est survenue.";
  } catch (error) {
    console.error("Erreur:", error);
    planIA = "Erreur lors de la génération du plan.";
  } finally {
    loading = false;
  }
}
  </script>
  
  <style>
    .options {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      margin-top: 50px;
    }
  
    button {
      padding: 12px 24px;
      background: #18a888;
      border: none;
      color: white;
      font-size: 1.2em;
      border-radius: 10px;
      cursor: pointer;
      transition: 0.3s;
    }
  
    button:hover {
      background: white;
      color: #18a888;
    }
  
    .plan-ia {
      margin-top: 40px;
      padding: 20px;
      background: #222;
      color: white;
      border-radius: 10px;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
  </style>
  
  <h2 style="text-align: center; color: #18a888; margin-top: 30px">Choisis ton plan d'entraînement</h2>
  
  <div class="options">
    <Link to="/ajout-exercice">
      <button>Créer mon propre programme</button>
    </Link>

    <Link to="/exercices-debutant">
      <button>Utiliser un plan pour débutants</button>
    </Link>
  
    <button on:click={genererAvecIA} disabled={loading}>
      {#if loading}
        Génération en cours...
      {:else}
        Générer avec l'IA
      {/if}
    </button>
  </div>
  
  {#if planIA}
  <div class="plan-ia">
    <h3>Plan généré par Coach Flex 🤖</h3>
    {@html renderMarkdown(planIA)}
  </div>
{/if}
  
