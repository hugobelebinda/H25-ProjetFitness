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
	.container {
		display: flex;
		min-height: 100vh;
		padding: 40px 30px;
		background: #181818;
		color: white;
		gap: 40px;
		font-family: "Segoe UI", sans-serif;
	}

	.sidebar {
		width: 260px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		background: #222;
		padding: 25px;
		border-radius: 12px;
		box-shadow: 0 0 20px rgba(24, 168, 136, 0.2);
	}

	.sidebar button {
		padding: 12px 16px;
		background: #18a888;
		border: none;
		color: white;
		font-size: 1em;
		border-radius: 8px;
		cursor: pointer;
		transition: 0.2s;
		text-align: center;
	}

	.sidebar button:hover {
		background: white;
		color: #18a888;
	}

	.sidebar .retour {
		font-size: 1em;
		color: #18a888;
		margin-bottom: 15px;
		text-decoration: none;
	}

	.sidebar .retour:hover {
		text-decoration: underline;
	}

	.sidebar .logout {
		margin-top: auto;
		background: #d9534f;
		color: white;
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
		margin-bottom: 10px;
	}

	.plan-item {
		background: #222;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 4px 15px rgba(24, 168, 136, 0.15);
	}

	.plan-item h3 {
		margin-bottom: 10px;
		color: #18a888;
	}

	.markdown {
		margin-top: 10px;
		white-space: pre-wrap;
	}

	.message-erreur {
		color: #ff6b6b;
		font-weight: bold;
		font-size: 1.1rem;
		background: #300;
		padding: 20px;
		border-radius: 8px;
	}
</style>

<div class="container">
	<!-- Sidebar -->
	<div class="sidebar">
		<Link to="/tableau-de-bord" class="retour">← Retour</Link>

		<Link to="/ajout-exercice">
			<button>Créer un programme</button>
		</Link>

		<Link to="/exercices-debutant">
			<button>Ajouter un programme existant</button>
		</Link>

		<button on:click={genererAvecIA} disabled={loading}>
			{#if loading}
				Génération en cours...
			{:else}
				🧠 Générer avec l'IA
			{/if}
		</button>

		{#if isConnected}
			<button class="logout" on:click={seDeconnecter}>Se déconnecter</button>
		{/if}
	</div>

	<!-- Contenu -->
	<div class="content">
		{#if !isConnected}
			<p class="message-erreur">
				Vous devez être connecté pour voir vos entraînements.<br />
				<Link to="/connexion" style="color:#18a888; text-decoration: underline">Se connecter</Link>
			</p>
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
