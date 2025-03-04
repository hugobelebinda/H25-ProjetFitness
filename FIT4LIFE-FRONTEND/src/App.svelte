<script>
    import { Router, Route } from "svelte-routing";
    import Accueil from "./Accueil.svelte";
    import Inscription from "./Inscription.svelte";
    import Connexion from "./Connexion.svelte";
    import EnSavoirPlus from "./EnSavoirPlus.svelte";
</script>

<Router>
    <Route path="/" component={Accueil} />
    <Route path="/inscription" component={Inscription} />
    <Route path="/connexion" component={Connexion} />
    <Route path="/en-savoir-plus" component={EnSavoirPlus} />
</Router>
