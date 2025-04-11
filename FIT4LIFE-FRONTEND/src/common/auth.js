import { writable } from 'svelte/store';

// Récupération du user et token
const storedUser = sessionStorage.getItem('user');
const storedToken = localStorage.getItem('token');

export const user = writable(storedUser ? JSON.parse(storedUser) : null);
export const token = writable(storedToken || null);

//  Fonction de connexion
export function login(userData, jwtToken) {
    sessionStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwtToken);
    user.set(userData);
    token.set(jwtToken);
}

//  Fonction de déconnexion
export function logout() {
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('userId'); // au cas où tu l’utilises encore
    user.set(null);
    token.set(null);
}

//  Utilitaire
export function isConnected() {
    return !!localStorage.getItem('token');
}
