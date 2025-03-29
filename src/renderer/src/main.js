// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

// createApp(App).mount('#app')

const app = createApp(App)

app.use(router)

// app.directive('scroll', {
//     inserted: function (el, binding) {
//       let f = function (evt) {
//         if (binding.value(evt, el)) {
//           window.removeEventListener('scroll', f)
//         }
//       }
//       window.addEventListener('scroll', f)
//     }
//   })

app.mount('#app')