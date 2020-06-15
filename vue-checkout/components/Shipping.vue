<template>
	<v-expansion-panel>
		<PanelHeader :panelInfo="panelInfo" />
		<v-expansion-panel-content v-if="cartItemTotal">
			<div
				v-if="!checkout.customer.isGuest && cartItemTotal > 1 && store_config.checkoutSettings.hasMultiShippingEnabled"
				class="d-flex justify-space-between align-center my-5"
			>
				<a @click="toggleMultiShipping">
					<span v-if="isMultiShipping">Ship to a single address</span>
					<span v-if="!isMultiShipping">Ship to multiple addresses</span>
				</a>
			</div>

			<Consignment
				v-for="(consignment, index) of consignments"
				:key="index"
				ref="consignment"
				:service="service"
				:checkout="checkout"
				:store_config="store_config"
				:consignment_data="consignment"
			/>
			<v-checkbox v-model="billingSame" label="My Billing address is the same as my Shipping address"></v-checkbox>

			<v-btn
				color="primary"
				:loading="loading"
				:disabled="!shippingSelected"
				@click="submitShippingStep"
			>Continue</v-btn>
		</v-expansion-panel-content>
		<v-divider></v-divider>
	</v-expansion-panel>
</template>

<script>
import PanelHeader from './PanelHeader.vue'
import Consignment from './Consignment.vue'
import { mapState } from 'vuex'

export default {
	name: 'ShippingPanel',
	props: ['service', 'checkout', 'store_config'],
	components: {
		PanelHeader,
		Consignment
	},
	data: () => ({
		panelInfo: {
			title: 'Shipping',
			step: 1
		},
		isMultiShipping: false,
		billingSame: true,
		loading: false,
		consignments: [],
		shippingSelected: false
	}),
	computed: {
		...mapState(['cartItemTotal', 'multiShipOrder'])
	},
	async created() {
		const state = await this.service.loadShippingOptions()

		this.service.subscribe(state => {
			const checkout = state.data.getCheckout()
			if (!this.isMultiShipping) {
				if (checkout.consignments.length) {
					this.consignments = checkout.consignments
					if (this.consignments[0].selectedShippingOption) {
						this.shippingSelected = true
					}
				} else {
					this.consignments = [{ availableShippingOptions: [] }]
				}
			} else {
				this.shippingSelected = true
			}
		})
	},
	methods: {
		async toggleMultiShipping() {
			this.isMultiShipping = !this.isMultiShipping
			this.$store.dispatch('setMultiShip', this.isMultiShipping)
			if (this.isMultiShipping) {
				const consignmentItems = []
				this.checkout.cart.lineItems.physicalItems.forEach(i => {
					const consignment = this.checkout.consignments[0]
					const item = Array(i.quantity).fill({
						...consignment,
						cartItems: [i]
					})
					consignmentItems.push(...item)
				})
				this.consignments = consignmentItems
			} else {
				// const removeConsignments = this.checkout.consignments.map(async i => {
				// 	await this.service.deleteConsignment(i.id)
				// })
				// await Promise.all(removeConsignments)
				if (this.checkout.consignments.length) {
					this.consignments = this.checkout.consignments
					if (this.consignments[0].selectedShippingOption) {
						this.shippingSelected = true
					}
				} else {
					this.consignments = [{ availableShippingOptions: [] }]
				}
			}
		},
		async submitShippingStep() {
			this.loading = true
			let customerMessageData = ''
			this.$refs.consignment.forEach(i => {
				let consignmentData = {
					message: i.customerMessage,
					ship_by: i.dateSelected,
					street: i.street
				}
				console.log(consignmentData)
				consignmentData = JSON.stringify(consignmentData)
				customerMessageData += consignmentData
			})
			const billingAddress = this.checkout.consignments[0].shippingAddress
	
			await this.service.updateBillingAddress(billingAddress)
			console.log(`update Billing`)
			await this.service.updateCheckout({ customerMessage: customerMessageData })
			if (this.billingSame) {
				this.$store.dispatch('setPanel', 3)
			} else {
				this.$store.dispatch('setPanel', 2)
			}
			this.loading = false
		}
	}
}
</script>

<style lang="scss">
.countryCode {
	width: 100%;
}
.firstName {
	width: 50%;
}
.lastName {
	width: 49%;
}
.address1 {
	width: 61%;
}
.company {
	width: 61%;
}
.stateOrProvince {
	width: 61%;
}
.phone {
	width: 100%;
}
</style>