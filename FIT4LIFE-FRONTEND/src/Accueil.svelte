<script>
    import { Link } from "svelte-routing";
</script>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .sidebar {
        margin-top: -10px;
        width: 250px;
        height: 100vh;
        background: #181818;
        padding: 20px;
        position: absolute;
        left: 0;
        top: 10;
    }
    .sidebar img {
    width: 110px;  
    height: auto; 
    margin-left: -17px;
    vertical-align: middle; 
}

    .sidebar h2 {
        color: #18a888;
        margin-bottom: 20px;
    }

    .sidebar a {
        display: block;
        text-decoration: none;
        color: white;
        padding: 10px 0;
        font-weight: bold;
    }

    .sidebar a:hover {
        color: #18a888;
    } 

    .content {
        margin-left: 190px;
        margin-right: -60px;
        padding: 50px;
        flex-grow: 1;
        background-color: #181818;
        position: relative;
        min-height: 100vh;
    }

    .header {
        margin-top: -80px;
        display: flex;
        justify-content: space-between;
        color: white;
        align-items: center;
        padding: 15px;
        background: #181818;
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .button-container {
        display: flex;
        gap: 10px; 
    }

    .button {
        padding: 10px 20px;
        font-size: 1.2em;
        border: 2px solid #18a888;
        background: white;
        color: #18a888;
        cursor: pointer;
        border-radius: 20px;
        transition: all 0.3s ease-in-out;
    }

    .button:hover {
        background: #18a888;
        color: white;
        border-color: white;
        transform: scale(1.05);
        box-shadow: 0px 4px 10px rgba(24, 168, 136, 0.5);
    }

    .vidbackground {
        position: relative;
    width: 100%;
    height: 80vh;
    overflow: hidden; 
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    }

    .overlay {
        position: absolute;
        width: 100%;
        height: 100%;
       
    }

    .vidbackground-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

    .vidbackground-content {
        position: relative;
        z-index: 2;
    }

    .vidbackground-content h1 {
        font-size: 2.5em;
        margin-bottom: 20px;
    }

    .vidbackground-content button {
        padding: 12px 24px;
        background: #18a888;
        border: none;
        color: white;
        font-size: 1.2em;
        border-radius: 10px;
        cursor: pointer;
        transition: 0.3s;
    }

    .vidbackground-content button:hover {
        background: white;
        color: #18a888;
    }

    .avisClients {
        text-align: center;
        padding: 50px;
        background: #18a888;
        color: white;
    }

    .features {
        display: flex;
        justify-content: center;
        gap: 40px;
        margin-top: 20px;
    }

    .feature {
        width: 250px;
    }

    .feature img {
        width: 80px;
        margin-bottom: 10px;
    }

    .testimonie {
        text-align: center;
        padding: 50px;
        background: #181818;
        color: white;
    }

    .testimonie-container {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
    }

    .testimonieIndividuel {
        width: 300px;
        padding: 20px;
        background: #222;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(24, 168, 136, 0.5);
    }

    .inscriptionAcceuil {
        text-align: center;
        padding: 50px;
        background: #222;
        color: white;
    }

    .inscriptionAcceuil button {
        padding: 12px 24px;
        background: #18a888;
        border: none;
        color: white;
        font-size: 1.2em;
        border-radius: 10px;
        cursor: pointer;
        transition: 0.3s;
    }

    .inscriptionAcceuil button:hover {
        background: white;
        color: #18a888;
    }
</style>

<div class="sidebar">
    <h2>FIT4LIFE 
        <img src="/logo.png" alt="Logo" />
    </h2>
    <a href="#">Plan d'entraînement</a>
    <a href="#">Plan nutritionnel</a>
    <a href="#">Tableau de bord</a>
    <a href="#">Suivi</a>
    <a href="#">En savoir plus</a>
</div>

<div class="content">
    <div class="header">
        <div><strong>FIT4LIFE</strong></div>
        <div class="button-container">
            <Link to="/connexion">
                <button class="button"><strong>Connexion</strong></button>
            </Link>
            <Link to="/inscription">
                <button class="button"><strong>Inscription</strong></button>
            </Link>
        </div>
    </div>

    <section class="vidbackground">
        <video autoplay loop muted playsinline class="vidbackground-video">
            <source src="/videos/fitness.mp4" type="video/mp4">
                <source src="/videos/fitness.webm" type="video/webm">
        </video>
        <div class="overlay"></div>
        <div class="vidbackground-content">
            <h1>Transforme ton corps, améliore ta vie</h1>
            <p>Rejoins la communauté FIT4LIFE et atteins tes objectifs fitness avec des entraînements et conseils adaptés.</p>
            <button>Commencer maintenant</button>
        </div>
    </section>

    

    <section class="avisClients">
        <h2>Pourquoi choisir Fit4Life ?</h2>
        <div class="features">
            <div class="feature">
                <img src="https://www.freeiconspng.com/uploads/transparent-medical-doctor-background-logos-18.png" alt="icon">
                <h3>Coachs professionnels</h3>
                <p>Accède à des experts certifiés en fitness et nutrition.</p>
            </div>
            <div class="feature">
                <img src="https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/1f3cb-2642.png" alt="icon">
                <h3>Programmes adaptés</h3>
                <p>Des plans personnalisés selon ton niveau et tes objectifs.</p>
            </div>
            <div class="feature">
                <img src="https://static.thenounproject.com/png/583-200.png" alt="icon">
                <h3>Communauté motivante</h3>
                <p>Rejoins une communauté dynamique et partage tes progrès.</p>
            </div>
        </div>
    </section>

    <section class="testimonie">
        <h2>Ce que nos membres disent</h2>
        <div class="testimonie-container">
            <div class="testimonieIndividuel">
                <p>"Grâce à Fit4Life, j'ai perdu 10 kg et je me sens plus en forme que jamais !"</p>
                <h4>- Abdelrazak Chafchadi.</h4>
            </div>
        </div>
    </section>

    <section class="inscriptionAcceuil">
        <h2>Prêt à transformer ta vie ?</h2>
        <p>Rejoins-nous dès maintenant et commence ton parcours fitness !</p>
        <Link to="/inscription">
            <button>S'inscrire</button>
        </Link>
    </section>
</div>
