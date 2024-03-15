import { createApp } from 'vue'
import PrimeVue from '../node_modules/primevue/config';
import './style.css'
import App from './App.vue'

const ws = new WebSocket("ws://localhost:8082")
ws.addEventListener("open", () => {
  console.log("connected !")
})


createApp(App).use(PrimeVue).mount('#app')

