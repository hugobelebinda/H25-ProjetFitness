<script>
  import { user } from "../common/auth";

  let currentUser;
  // reactive assignment : currentUser suit $user
  $: currentUser = $user;

  // lock état : bloqué si pas connecté ou évaluation incomplète
  $: isLocked = !$user || !$user.frequence;

  // raison du blocage affichée
  $: lockReason = !$user
    ? "Veuillez vous connecter"
    : !$user.frequence
    ? "Veuillez compléter l’évaluation"
    : "";

  let isOpen = true;  // état ouvert/fermé d'un panel ?

  let userInput = ""; // texte saisi par l'utilisateur
  let messages = [
    { sender: "bot", text: "Salut! Moi c'est Coach Flex! Pose-moi une question 😊" }
  ];

  // envoie message à l'API chat backend
  async function sendMessage() {
    const text = userInput.trim();
    if (!text) return;

    // ajoute message utilisateur
    messages = [...messages, { sender: "user", text }];
    userInput = "";

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();

      console.log("Réponse reçue dans Svelte :", data);
      // ajoute réponse bot
      messages = [...messages, { sender: "bot", text: data.answer }];
    } catch (error) {
      console.error("Erreur:", error);
      messages = [...messages, { sender: "bot", text: "Désolé, une erreur est survenue." }];
    }
  }

  // envoie message si touche Enter pressée
  function handleKeydown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  }
</script>


<style>
    .chat-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        background: white;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        z-index: 1000;
    }

    .chat-header {
        background: #18a888;
        color: white;
        padding: 10px;
        text-align: center;
        font-weight: bold;
    }

    .chat-body {
        max-height: 300px;
        overflow-y: auto;
        padding: 10px;
    }

    .message {
        margin: 5px 0;
        padding: 8px;
        border-radius: 10px;
        max-width: 80%;
    }

    .user {
        background: #18a888;
        color: white;
        align-self: flex-end;
    }

    .bot {
        background: #f1f1f1;
        color: black;
        align-self: flex-start;
    }

    .chat-footer {
        display: flex;
        padding: 10px;
        border-top: 1px solid #ddd;
    }

    .chat-footer input {
        flex: 1;
        padding: 8px;
        border: none;
        outline: none;
    }

    .chat-footer button {
        background: #18a888;
        color: white;
        border: none;
        padding: 8px;
        cursor: pointer;
    }

.chatbot-locked {
    background: #fff0f0;
    color: #d33;
    font-weight: bold;
    border: 1px solid #d33;
    border-radius: 8px;
    padding: 10px;
    width: 100%;
    text-align: center;
    font-size: 0.9rem;
}

.chat-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #222; /* fond gris foncé */
  color: white;
  border: none;
  font-size: 1.4rem;
  padding: 14px 16px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  transition: all 0.3s ease;
}

.chat-toggle:hover {
  background: #333;
  transform: scale(1.05);
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  float: right;
  cursor: pointer;
}

</style>

{#if isOpen}
  <div class="chat-container">
    <div class="chat-header">
      🤖 Coach Flex AI
      <button class="close-btn" on:click={() => isOpen = false}>✖</button>
    </div>
    <div class="chat-body">
      {#each messages as msg}
        <div class="message {msg.sender}">{msg.text}</div>
      {/each}
    </div>
    <div class="chat-footer">
      {#if isLocked}
        <div class="chatbot-locked">{lockReason}</div>
      {:else}
        <input type="text" bind:value={userInput} on:keydown={handleKeydown} placeholder="Écris ici..." />
        <button on:click={sendMessage}>Envoyer</button>
      {/if}
    </div>
  </div>
{/if}

{#if !isOpen}
  <button class="chat-toggle" on:click={() => isOpen = true}>💬</button>
{/if}

