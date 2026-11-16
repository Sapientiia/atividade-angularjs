// Ponto de entrada da versão Vue: importa o CSS (cópia exata de ../css/estilo.css
// da versão AngularJS) e monta o componente raiz App.vue na <div id="app">.
import { createApp } from 'vue';
import App from './App.vue';
import './estilo.css';

createApp(App).mount('#app');
