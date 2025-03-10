<script>
    import { Link } from "svelte-routing";
</script>

<style>

    .page-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("https://t3.ftcdn.net/jpg/03/86/34/64/360_F_386346461_ycljRSlIn3X54bITkN6YD8jlL8gjtinh.jpg") no-repeat center center/cover;
    background-size: cover;
    background-position: center;
    
    }

    .container {
        max-width: 900px;
        margin: 50px auto;
        padding: 30px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
        animation: fadeIn 1s ease-in-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .titre {
        font-size: 2.5em;
        color: #18a888;
        margin-bottom: 20px;
    }

    .section {
        margin-top: 30px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
    }

    .section h2 {
        color: #18a888;
        margin-bottom: 10px;
    }

    .section ul {
        list-style: none;
        padding: 0;
    }

    .section ul li {
        margin: 10px 0;
        font-size: 1.2em;
    }

    .content {
        margin-top: 30px;
    }

    .content button {
        padding: 12px 24px;
        font-size: 1.2em;
        border: 2px solid #18a888;
        background: white;
        color: #18a888;
        cursor: pointer;
        border-radius: 20px;
        transition: all 0.3s ease-in-out;
    }

    .content button:hover {
        background: #18a888;
        color: white;
        transform: scale(1.05);
        box-shadow: 0px 4px 10px rgba(24, 168, 136, 0.5);
    }

    .testimonials {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
        flex-wrap: wrap;
    }

    .testimonial {
        width: 250px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(24, 168, 136, 0.5);
    }
</style>

<div class="page-background">
<div class="container">
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

    <div class="content">
        <h2>Rejoignez-nous dès maintenant !</h2>
        <Link to="/inscription"><button>S'inscrire</button></Link>
    </div> 
    </div>
</div>
