<script>
    let darkMode = true;
</script>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
		
    }

    body {
        font-family: Arial, sans-serif;
		height: 100%;
        background-color:#181818;
        color: white;
        display: flex;
    }

    
    .sidebar {
        width: 250px;
        height: 100vh;
        background: #181818;
        padding: 20px;
        position: absolute;
        left: 0;
        top: 10;
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
		height: 100vh;
    }

    .header {
		margin-top: -40px;
        display: flex;
        justify-content: space-between;
		color: white;
        align-items: center;
        padding: 15px;
        background: #181818;
        position: sticky;
        top: 0;
    }

    .midHeading {
        text-align: center;
        padding: 50px;
        background: #18a888;
    }

    .midHeading h1 {
        font-size: 2.5em;
		margin-bottom: 10px;
    }

	.midHeading p {
		font-size: 1.2em;
		margin-bottom: 20px;
	}

    .midHeading button {
        padding: 10px 20px;
        font-size: 1.2em;
        border: 2px solid #18a888;
        background: white;
        color: #18a888;
        cursor: pointer;
        border-radius: 20px;
		transition: all 0.3s ease-in-out;
    }

	.midHeading button:hover {
		background: #18a888;
		 color: white;
		  border-color: white;
		  transform: scale(1.05); 
		  box-shadow: 0px 4px 10px rgba(24, 168, 136, 0.5); 
	}

    .sections {
        display: flex;
		color: white;
		background-color: #18a888;
        gap: 0px;
		justify-content: flex-start;
    
    }

    .textInfo {
        width: 100%;
        text-align: center;
        padding: 20px;
        border-radius: 10px;
    }

    .textInfo img {
        width: 80px;
        margin-bottom: 10px;
    }


	.sidebar img {
        width: 80px;
        height: 70px;
		position: absolute;
    }

	.midHeading img {
        width: 160px;
        height: 140px;
		position: relative;
    }

</style>

<div class="sidebar">
    <h2>
		FIT4LIFE 
		<img src="https://mail.google.com/mail/u/0?ui=2&ik=9e853468ec&attid=0.1&permmsgid=msg-a:r6906140957147156578&th=194d4e5453841c19&view=att&disp=safe&realattid=f_m6rk1zc80&zw" alt="icon">
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
        <div><a href="#">Inscription</a></div>
    </div>

    <section class="midHeading">
        <h1><img src="https://mail.google.com/mail/u/0?ui=2&ik=9e853468ec&attid=0.1&permmsgid=msg-a:r6906140957147156578&th=194d4e5453841c19&view=att&disp=safe&realattid=f_m6rk1zc80&zw" alt="icon"></h1>
        <p>Le site qui vous permettra de rester fit pour la vie!</p>
        <button>Évaluation</button>
    </section>

    <section class="sections">
        <div class="textInfo">
            <img src="https://www.freeiconspng.com/uploads/transparent-medical-doctor-background-logos-18.png" alt="icon">
            <h3>Objectif Santé</h3>
            <p>Améliore ton bien-être global grâce à des conseils sur la récupération, le sommeil et la gestion du stress.</p>
        </div>
        <div class="textInfo">
            <img src="https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/1f3cb-2642.png" alt="icon">
            <h3>Objectif Fitness</h3>
            <p>Atteins tes objectifs sportifs avec des programmes d'entraînement personnalisés et un suivi de tes performances.</p>
        </div>
        <div class="textInfo">
            <img src="https://static.thenounproject.com/png/583-200.png" alt="icon">
            <h3>Objectif Nutrition</h3>
            <p>Optimise ton alimentation avec des plans de repas équilibrés adaptés à ton style de vie et à tes besoins.</p>
        </div>
    </section>
</div>