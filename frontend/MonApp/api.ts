import axios from 'axios';

// ANDROID ÉMULATEUR => 10.0.2.2 pointe vers "localhost" de ta machine.
// Sur appareil physique, mets l'IP LAN de ton PC (ex: http://192.168.1.50:3000).
const api = axios.create({
  baseURL: 'http://10.0.2.2:5000',
  headers: { 'Content-Type': 'application/json' },
});




export default api;
