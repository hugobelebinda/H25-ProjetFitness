<script>
  import { Router, Route } from "svelte-routing";
  import Accueil from "./Accueil.svelte";
  import Inscription from "./Inscription.svelte"; 
  import Connexion from "./Connexion.svelte";    
  import EnSavoirPlus from "./EnSavoirPlus.svelte";
  import Evaluation from "./Evaluation.svelte";
  import TableauDeBord from "./TableauDeBord.svelte";
  import Suivi from "./Suivi.svelte";
  import PlanEntrainement from "./PlanEntrainement.svelte";
  import PlanNutritionnel from "./PlanNutritionnel.svelte";
  import AjoutExercice from "./AjoutExercice.svelte";
  import ProgrammeAuto from './ProgrammeAuto.svelte';

  


</script>



<div class="app-layout">
  <Router>
    <Route path="/" component={Accueil} />
    <Route path="/inscription" component={Inscription} />
    <Route path="/connexion" component={Connexion} />
    <Route path="/en-savoir-plus" component={EnSavoirPlus} />
    <Route path="/evaluation" component={Evaluation} />
    <Route path="/tableau-de-bord" component={TableauDeBord} />
    <Route path="/suivi" component={Suivi} />
    <Route path="/plan-entrainement" component={PlanEntrainement} />
    <Route path="/plan-nutritionnel" component={PlanNutritionnel} />
    <Route path="/ajout-exercice" component={AjoutExercice} />
    <Route path="/programme-auto" component={ProgrammeAuto} />
  </Router>

  <footer class="site-footer">
    <p>&copy; {new Date().getFullYear()} Projet Fitness. Tous droits réservés.</p>
  </footer>
</div>



<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
    background-color: #f8f9fa;
    color: #222;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .site-footer {
    text-align: center;
    padding: 2rem 1rem;
    font-size: 0.9rem;
    color: #aaa;
    border-top: 1px solid #ddd;
    margin-top: 2rem;
  }

  :global(button) {
    font-family: inherit;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    background-color: #e64980;
    color: white;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }

  :global(button:hover) {
    transform: scale(1.03);
    background-color: #d6336c;
  }
</style>
