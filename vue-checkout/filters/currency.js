import Vue from 'vue'

Vue.filter('currency', function (value) {
  if (!value) return ''
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  
  return formatter.format(value);
})
