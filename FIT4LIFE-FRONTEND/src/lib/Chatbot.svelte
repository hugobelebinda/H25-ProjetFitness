<script>

    import { onMount } from "svelte";
    import { user } from "../common/auth";

    $: currentUser = $user;
 

 function isLocked() {
  return !$user || !$user.frequence;
}

function lockReason() {
  if (!$user) return "Veuillez vous connecter";
  if (!$user.frequence) return "Veuillez compléter l’évaluation";
  return "";
}


    let userInput = "";
    let messages = [
        { sender: "bot", text: "Salut! Moi c'est Coach Flex! Pose-moi une question 😊" }
    ];

    async function sendMessage() {
        const text = userInput.trim();
        if (!text) return;

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
            messages = [...messages, { sender: "bot", text: data.answer }];
        } catch (error) {
            console.error("Erreur:", error);
            messages = [...messages, { sender: "bot", text: "Désolé, une erreur est survenue." }];
        }
    }

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
    width: 100%;
    text-align: center;
    font-size: 0.9rem;
    color: #999;
    background: #f9f9f9;
    padding: 10px;
    border-radius: 5px;
}

</style>

<div class="chat-container">
    <div class="chat-header">🤖 Coach Flex AI</div>
    <div class="chat-body">
        {#each messages as msg}
            <div class="message {msg.sender}">{msg.text}</div>
        {/each}
    </div>
    <div class="chat-footer">
    {#if isLocked()}
      <div class="chatbot-locked">{lockReason()}</div>
    {:else}
        <input type="text" bind:value={userInput} on:keydown={handleKeydown} placeholder="Écris ici..." />
        <button on:click={sendMessage}>Envoyer</button>
    {/if}
</div>
</div>

