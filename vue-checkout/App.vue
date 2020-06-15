<template>
	<v-app>
		<v-container>
			<v-row justify="center" v-if="store_config.checkoutSettings">
				<v-col cols="12">
					<v-row>
						<v-col cols="7" lg="8">
							<v-row no-gutters>
								<v-col cols="12" lg="10">
									<v-expansion-panels flat tile accordion readonly v-model="panel">
										<Customer :service="service" :checkout="checkout" :store_config="store_config" />
										<Shipping :service="service" :checkout="checkout" :store_config="store_config" />
										<Billing :service="service" :checkout="checkout" :store_config="store_config" />
										<Payment :service="service" :checkout="checkout" :store_config="store_config" />
									</v-expansion-panels>
								</v-col>
							</v-row>
						</v-col>
						<v-col cols="5" lg="4">
							<Cart :service="service" :checkout="checkout" :store_config="store_config" />
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-container>
	</v-app>
</template>

<script>
import { createCheckoutService } from '@bigcommerce/checkout-sdk'
import axios from 'axios'
import { mapState } from 'vuex'
import Customer from './components/Customer.vue'
import Shipping from './components/Shipping.vue'
import Billing from './components/Billing.vue'
import Payment from './components/Payment.vue'
import Cart from './components/Cart.vue'

export default {
	data: () => ({
		store_config: {},
		checkout: {},
		service: {},
		cartItems: 0
	}),
	components: {
		Customer,
		Shipping,
		Billing,
		Payment,
		Cart
	},
	mounted() {
		this.getCheckout()
	},
	computed: {
		...mapState(['panel'])
	},
	methods: {
		async getCheckout() {
			try {
				const checkout = await axios.get('/api/storefront/carts')
				this.service = createCheckoutService()
				const state = await this.service.loadCheckout(checkout.data[0].id)
				this.checkout = await state.data.getCheckout()
				this.store_config = await state.data.getConfig()
				// this.$store.dispatch('setStoreConfig', this.store_config)
				this.$store.dispatch('setCheckout', this.checkout)
				console.log(state.data.getShippingAddress());
console.log(state.data.getBillingAddress());
				this.checkout.cart.lineItems.physicalItems.forEach(i => (this.cartItems += i.quantity))
				this.$store.dispatch('setCartItemTotal', this.cartItems)

				if (this.checkout.consignments.length) {
					console.log('consignments pressemt')

					if (this.checkout.consignments[0].selectedShippingOption) {
						console.log('consignments')
						this.$store.dispatch('setPanel', 3)
					} else {
						this.$store.dispatch('setPanel', 1)
					}
				} else {
					console.log('no consignments')
					this.$store.dispatch('setPanel', 0)
				}

				this.service.subscribe(state => {
					this.checkout = state.data.getCheckout()
					this.$store.dispatch('setCheckout', this.checkout)
				})
			} catch (err) {
				console.log(err)
			}
		}
	}
}
</script>

<style lang="scss">
@import './scss/variables.scss';
@import '../node_modules/vuetify/dist/vuetify.min.css';

.v-application--wrap {
	margin: 0 auto;
	max-width: 92.30769rem;
	width: 100%;
	min-height: 15.38462rem;
	padding: 0 1.5rem 7.5rem;
}
</style>