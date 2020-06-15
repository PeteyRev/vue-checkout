import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

Vue.config.devtools = true;

export default new Vuex.Store({
  state: {
    storeConfig: {},
    service: null,
    checkout: {},
    panel: 0,
    cartItemTotal: 0,
    multiShipOrder: false
  },
  mutations: {
    setStoreConfig(state, payload) {
      state.storeConfig = payload;
    },
    setService(state, payload) {
      state.service = payload;
    },
    setCheckout(state, payload) {
      state.checkout = payload;
    },
    setPanel(state, payload) {
      state.panel = payload;
    },
    setCartItemTotal(state, payload) {
      state.cartItemTotal = payload;
    },
    multiShipOrder(state, payload) {
      state.multiShipOrder = payload;
    }
  },
  actions: {
    setStoreConfig(store, payload) {
      store.commit('setStoreConfig', payload);
    },
    setService(store, payload) {
      store.commit('setService', payload);
    },
    setCheckout(store, payload) {
      store.commit('setCheckout', payload);
    },
    setPanel(store, payload) {
      store.commit('setPanel', payload);
    },
    setCartItemTotal(store, payload) {
      store.commit('setCartItemTotal', payload);
    },
    setMultiShip(store, payload) {
      store.commit('multiShipOrder', payload);
    }
  },
});
