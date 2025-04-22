
export function exercicesValides(exercices) {
  return exercices.every(e => e.nom && e.series > 0 && e.repetitions > 0);
}

export async function enregistrerRoutine(nomRoutine, exercices) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Vous devez être connecté pour enregistrer un entraînement.");
    return;
  }

  if (!nomRoutine || exercices.length === 0 || !exercicesValides(exercices)) {
    alert("Veuillez remplir tous les champs requis.");
    return;
  }

  const payload = {
    nom: nomRoutine,
    exercices
  };

  try {
    const res = await fetch("http://localhost:4201/user/entrainement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("Entraînement enregistré !");
   
    } else {
      const err = await res.json();
      console.error("Erreur serveur :", err);
      alert("Erreur : " + (err.message || "Échec de l'enregistrement"));
    }
  } catch (e) {
    console.error("Erreur réseau :", e);
    alert("Problème de connexion au serveur.");
  }
}
