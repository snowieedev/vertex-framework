import './styles/global.css';

console.log('Welcome to VERTEX!');

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <div class="vertex-container">
      <h1>VERTEX Framework</h1>
      <p>Start building your next big thing.</p>
    </div>
  `;
}
