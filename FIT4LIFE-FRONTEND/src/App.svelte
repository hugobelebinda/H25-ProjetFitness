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
  </script>
  

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
</Router>
