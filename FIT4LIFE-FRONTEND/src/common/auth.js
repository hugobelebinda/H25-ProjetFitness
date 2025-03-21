import { writable } from 'svelte/store';

// Si l'utilisateur est dans le sessionStorage, il est connecté
const storedUser = sessionStorage.getItem('user');
export const user = writable(storedUser ? JSON.parse(storedUser) : null);

// Fonction pour se connecter
export function login(userData) {
    sessionStorage.setItem('user', JSON.stringify(userData));
    user.set(userData);
}

// Fonction pour se déconnecter
export function logout() {
    sessionStorage.removeItem('user');
    user.set(null);
}
