<script>
	import { Link, navigate } from 'svelte-routing';
	import { marked } from "marked";
	import { onMount } from "svelte";
	import { logout } from "./common/auth";

	let planIA = "";
	let loading = false;
	let entrainements = [];
	let isConnected = false;

	function renderMarkdown(text) {
		return marked.parse(text);
	}

	onMount(() => {
		const token = localStorage.getItem("token");
		isConnected = !!token;

		if (!token) {
			alert("Vous devez être connecté pour voir vos entraînements.");
			navigate("/connexion");
			return;
		}

		fetch("http://localhost:4201/user/entrainement", {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
			.then(res => res.json())
			.then(data => {
				entrainements = data.map((e, index) => ({
					id: e._id || index,
					titre: e.nom,
					contenu: e.exercices.map(ex => `- ${ex.nom} : ${ex.series} séries x ${ex.repetitions} reps`).join("\n")
				}));
			})
			.catch(err => {
				console.error("Erreur réseau :", err);
			});
	});

	async function genererAvecIA() {
		loading = true;
		planIA = "";

		try {
			const payload = {
				objectif: "Perdre du poids",
				experience: "Débutant",
				type: "Full Body"
			};

			const res = await fetch("http://localhost:3001/api/generer-entrainement", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});

			const data = await res.json();
			planIA = data.answer || "Une erreur est survenue.";

			entrainements = [
				...entrainements,
				{ id: Date.now(), titre: "Plan IA", contenu: planIA }
			];
		} catch (error) {
			console.error("Erreur:", error);
			planIA = "Erreur lors de la génération du plan.";
		} finally {
			loading = false;
		}
	}

	function seDeconnecter() {
		logout();
		navigate("/connexion");
	}
</script>

<style>
	.page-container {
		display: flex;
		min-height: 100vh;
		padding: 40px;
		background: #181818;
		color: white;
		font-family: "Segoe UI", sans-serif;
		gap: 40px;
	}

	.sidebar {
		width: 250px;
		background: #222;
		padding: 25px;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		gap: 15px;
		box-shadow: 0 0 20px rgba(24,168,136,0.15);
	}

	.sidebar a,
	.sidebar button {
		padding: 12px 16px;
		background: #18a888;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1em;
		text-align: center;
		cursor: pointer;
		text-decoration: none;
		transition: 0.3s;
	}

	.sidebar a:hover,
	.sidebar button:hover {
		background: white;
		color: #18a888;
	}

	.sidebar .retour {
		background: transparent;
		color: #18a888;
		border: none;
		text-align: left;
		padding: 0;
		margin-bottom: 15px;
		cursor: pointer;
		font-weight: bold;
	}

	.sidebar .logout {
		background: #d9534f;
		margin-top: auto;
	}

	.sidebar .logout:hover {
		background: #ff6b6b;
		color: white;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 25px;
	}

	h2 {
		font-size: 2rem;
		color: #18a888;
	}

	.plan-item {
		background: #222;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 4px 15px rgba(24, 168, 136, 0.15);
	}

	.plan-item h3 {
		color: #18a888;
		margin-bottom: 10px;
	}

	.markdown {
		margin-top: 10px;
		white-space: pre-wrap;
		line-height: 1.6;
	}

	.error-message {
		background: #300;
		padding: 20px;
		border-radius: 10px;
		color: #ff6b6b;
		font-weight: bold;
	}
</style>

<div class="page-container">
	<!-- Sidebar -->
	<div class="sidebar">
		<Link to="/tableau-de-bord" class="retour">← Retour au tableau de bord</Link>

		<Link to="/ajout-exercice">Créer un programme</Link>
		<Link to="/exercices-debutant">Ajouter programme existant</Link>

		<button on:click={genererAvecIA} disabled={loading}>
			{#if loading}
				⌛ Génération...
			{:else}
				🧠 Générer avec l'IA
			{/if}
		</button>

		{#if isConnected}
			<button class="logout" on:click={seDeconnecter}>Se déconnecter</button>
		{/if}
	</div>

	<!-- Content -->
	<div class="content">
		{#if !isConnected}
			<div class="error-message">
				Vous devez être connecté pour voir vos entraînements.<br />
				<Link to="/connexion" style="color:#18a888; text-decoration: underline">Se connecter</Link>
			</div>
		{:else}
			<h2>📋 Vos entraînements</h2>

			{#if entrainements.length === 0}
				<p>Aucun entraînement enregistré pour le moment.</p>
			{:else}
				{#each entrainements as entrainement (entrainement.id)}
					<div class="plan-item">
						<h3>{entrainement.titre}</h3>
						<div class="markdown">
							{@html renderMarkdown(entrainement.contenu)}
						</div>
					</div>
				{/each}
			{/if}
		{/if}
	</div>
</div>
