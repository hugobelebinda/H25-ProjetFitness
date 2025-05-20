<script>
    import { Link } from "svelte-routing";

    import { user } from './common/auth'; 

    let currentUser;
    $: currentUser = $user;

</script>

<style>

   .page-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  background: #181818;
  color: white;
  padding: 50px 20px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px;
  background: #222;
  border-radius: 20px;
  box-shadow: 0 0 15px rgba(24, 168, 136, 0.3);
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.titre {
  font-size: 2.8em;
  color: #18a888;
  margin-bottom: 30px;
  text-align: center;
}

.section {
  margin-top: 40px;
  background: #1f1f1f;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(24, 168, 136, 0.2);
}

.section h2 {
  color: #18a888;
  margin-bottom: 15px;
  font-size: 1.6em;
}

.section p, .section ul li {
  font-size: 1.1em;
  line-height: 1.6;
}

.section ul {
  padding-left: 0;
  list-style: none;
}

.section ul li::before {
  content: "✔ ";
  color: #18a888;
  margin-right: 8px;
}

.testimonials {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.testimonial {
  background: #2a2a2a;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(24, 168, 136, 0.3);
  max-width: 280px;
  font-style: italic;
}

.testimonial h4 {
  margin-top: 10px;
  color: #ccc;
  font-style: normal;
}

.content {
  text-align: center;
  margin-top: 50px;
}

.content h2 {
  margin-bottom: 20px;
  color: #18a888;
}

.content button {
  padding: 12px 30px;
  background: white;
  color: #18a888;
  font-size: 1.2em;
  border: 2px solid #18a888;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.content button:hover {
  background: #18a888;
  color: white;
  box-shadow: 0 0 12px rgba(24, 168, 136, 0.5);
  transform: scale(1.05);
}

.retour-wrapper {
  text-align: left;
  margin-bottom: 20px;
}

.btn-retour {
  background: transparent;
  color: #18a888;
  border: 2px solid #18a888;
  padding: 10px 20px;
  font-size: 1em;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-retour:hover {
  background: #18a888;
  color: white;
  box-shadow: 0 0 10px rgba(24, 168, 136, 0.5);
}


</style>

<div class="page-background">
<div class="container">
    <div class="retour-wrapper">
  <Link to="/"><button class="btn-retour">← Retour à l'accueil</button></Link>
</div>
    <h1 class="titre">En savoir plus sur Fit4Life</h1>

    <div class="section">
        <h2>Qui sommes-nous ?</h2>
        <p>
            Bienvenue sur Fit4Life, la plateforme qui vous accompagne dans votre parcours de remise en forme !
            Fit4Life est une plateforme dédiée à votre bien-être physique et mental. 
            Nous croyons que le bien-être physique et mental est à la portée de tous, et nous mettons à votre disposition des programmes d'entraînement, des conseils nutritionnels et des outils de suivi personnalisés pour vous aider à atteindre vos objectifs.

        </p>
    </div>

    <div class="section">
        <h2>Nos Services</h2>
        <ul>
            <li>📌 Un aperçu des fonctionnalités et services disponibles sur Fit4Life.</li>
            <li>💪 Programmes d'entraînement personnalisés</li>
            <li>🥗 Plans nutritionnels adaptés</li>
            <li>📊 Suivi des progrès</li>
            <li>👨‍🏫 Coaching et conseils</li>
            <li>🤝 Communauté motivante</li>
        </ul>
    </div>

    <div class="section">
        <h2>Pourquoi nous choisir ?</h2>
        <p>
            ✔ Accessibilité | ✔ Personnalisation | ✔ Fiabilité | ✔ Communauté
        </p>
    </div>

    <div class="section">
        <h2>Témoignages</h2>
        <div class="testimonials">
            <div class="testimonial">
                <p>"Grâce à Fit4Life, j’ai pu atteindre mes objectifs de perte de poids tout en restant motivé !"</p>
                <h4>- Sarah M.</h4>
            </div>
            <div class="testimonial">
                <p>"J'adore la simplicité de la plateforme et la variété des entraînements. Super motivant !"</p>
                <h4>- Lucas D.</h4>
            </div>
            <div class="testimonial">
                <p>"Des plans nutritionnels adaptés à mes besoins, un vrai boost pour ma santé !"</p>
                <h4>- Sophie B.</h4>
            </div>
        </div>
    </div>

    {#if !currentUser}
    <div class="content">
        <h2>Rejoignez-nous dès maintenant !</h2>
        <Link to="/inscription"><button>S'inscrire</button></Link>
    </div>
{/if}

    </div>
</div>
