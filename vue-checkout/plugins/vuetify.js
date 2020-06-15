import Vue from 'vue'
import Vuetify from 'vuetify'


Vue.use(Vuetify)

const opts = {
  breakpoint: {
    thresholds: {
      xs: 340,
      sm: 540,
      md: 800,
      lg: 1280,
    },
  },
}

export default new Vuetify(opts)