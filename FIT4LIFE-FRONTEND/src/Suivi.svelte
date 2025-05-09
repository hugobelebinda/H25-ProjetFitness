<script>
    import { user } from './common/auth';
    let currentUser = $user;
  </script>
  
  <style>
    .suivi-container {
      padding: 40px;
      color: white;
      background-color: #181818;
      min-height: 100vh;
    }
  
    .dashboard-header {
      text-align: center;
      margin-bottom: 40px;
    }
  
    .dashboard-header h1 {
      font-size: 2.5rem;
      color: #18a888;
    }
  
    .dashboard-header p {
      margin-top: 10px;
      color: #aaa;
      font-size: 1.1rem;
    }
  
    .quick-stats {
      display: flex;
      justify-content: center;
      gap: 30px;
      flex-wrap: wrap;
      margin-bottom: 40px;
    }
  
    .stat-box {
      background: #222;
      padding: 25px 30px;
      border-radius: 12px;
      width: 240px;
      box-shadow: 0 0 15px rgba(24, 168, 136, 0.3);
      text-align: center;
    }
  
    .stat-box h2 {
      font-size: 2rem;
      color: #18a888;
    }
  
    .stat-box p {
      margin-top: 8px;
      color: #ccc;
    }
  
    .section {
      background: #222;
      padding: 30px;
      border-radius: 12px;
      margin: 25px 0;
      box-shadow: 0 0 20px rgba(24, 168, 136, 0.15);
      text-align: left;
    }
  
    .section h3 {
      margin-bottom: 10px;
      color: #18a888;
      font-size: 1.4rem;
    }
  
    .section p {
      color: #ccc;
    }
  
    .placeholder-graph {
      margin-top: 20px;
      background: #333;
      border-radius: 8px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      font-style: italic;
    }
  </style>
  
  <div class="suivi-container">
    <div class="dashboard-header">
      <h1>📊 Suivi de {currentUser?.nom || currentUser?.username || 'ton évolution'}</h1>
      <p>Garde le rythme et célèbre chaque progrès 💪</p>
    </div>
  
    <div class="quick-stats">
      <div class="stat-box">
        <h2>78.5 kg</h2>
        <p>Poids actuel</p>
      </div>
      <div class="stat-box">
        <h2>5 séances</h2>
        <p>cette semaine</p>
      </div>
      <div class="stat-box">
        <h2>1,950 kcal</h2>
        <p>calories consommées</p>
      </div>
    </div>
  
    <div class="section">
      <h3>🏋️ Historique des entraînements</h3>
      <ul>
        <li>✅ Lundi - Full Body</li>
        <li>✅ Mardi - Cardio HIIT</li>
        <li>✅ Jeudi - Haut du corps</li>
      </ul>
    </div>
  
    <div class="section">
      <h3>🥗 Suivi Nutritionnel</h3>
      <p>Calories aujourd'hui : <strong>1,950</strong></p>
      <p>Protéines : 140g | Glucides : 180g | Lipides : 60g</p>
    </div>
  </div>
  