import '@/assets/main.css'

import { createApp } from 'vue'
import App from '@/App.vue'

// Add proper modulo arithmatic to numbers
Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
}

createApp(App).mount('#app')
