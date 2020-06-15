import Vue from 'vue'
import vuetify from './plugins/vuetify'
import './filters/currency'
import App from './App.vue'
import store from './store/store'

Vue.config.productionTip = false
Vue.config.devtools = true;

new Vue({
  el: '#app',
  vuetify,
  store,
  render: h => h(App),
});