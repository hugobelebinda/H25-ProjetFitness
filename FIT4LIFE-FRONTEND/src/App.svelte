<script>
    import { Router, Route } from "svelte-routing";
    import Accueil from "./Accueil.svelte";
    import Inscription from "./Inscription.svelte";
</script>

<Router>
    <Route path="/" component={Accueil} />
    <Route path="/inscription" component={Inscription} />
</Router>
