<template>
	<div v-if="selectedAddress.firstName">
		<v-menu offset-y>
			<template v-slot:activator="{ on }">
				<v-card class="d-flex align-center" outlined v-on="on">
					<v-list-item three-line>
						<v-list-item-content>
							<v-list-item-subtitle>{{selectedAddress.firstName}} {{selectedAddress.lastName}}</v-list-item-subtitle>
							<v-list-item-subtitle>{{selectedAddress.company}} {{selectedAddress.phone}}</v-list-item-subtitle>
							<v-list-item-subtitle>{{selectedAddress.city}}, {{selectedAddress.stateOrProvince}}, {{selectedAddress.postalCode}}</v-list-item-subtitle>
							<v-list-item-subtitle>{{selectedAddress.country}}</v-list-item-subtitle>
						</v-list-item-content>
						<v-list-item-action class="align-self-center">
							<v-btn icon>
								<v-icon color="primary lighten-1">mdi-arrow-down-drop-circle</v-icon>
							</v-btn>
						</v-list-item-action>
					</v-list-item>
				</v-card>
			</template>
			<v-list>
				<v-list-item>
					<v-list-item-action class="align-self-center">
						<v-btn outlined color="primary lighten-1" @click="dialog = true">
							Enter new address
							<v-icon right color="primary lighten-1">mdi-home-plus</v-icon>
						</v-btn>
					</v-list-item-action>
				</v-list-item>

				<v-divider></v-divider>
				<v-list-item-group mandatory @change="updateConsignment">
					<template v-for="(address,index) of addresses">
						<v-list-item :key="address.id" three-line>
							<v-list-item-content>
								<v-list-item-subtitle>{{address.firstName}} {{address.lastName}}</v-list-item-subtitle>
								<v-list-item-subtitle>{{address.company}} {{address.phone}}</v-list-item-subtitle>
								<v-list-item-subtitle>{{address.city}}, {{address.stateOrProvince}}, {{address.postalCode}}</v-list-item-subtitle>
								<v-list-item-subtitle>{{address.country}}</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
						<v-divider v-if="index + 1 < addresses.length" :key="index"></v-divider>
					</template>
				</v-list-item-group>
			</v-list>
		</v-menu>
		<v-dialog v-model="dialog" max-width="600px">
			<v-card>
				<v-card-title>
					<span class="headline">Add Address</span>
				</v-card-title>
				<v-card-text>
					<AddressForm :checkout="checkout" :service="service" :fields="fields" />
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import AddressForm from './AddressForm.vue'

export default {
	name: 'CustomerAddresses',
	props: ['checkout', 'service', 'consignment_data'],
	components: {
		AddressForm
	},
	data: () => ({
		dialog: false,
		addresses: [],
		selectedAddress: {},
		consignment: {
			shippingAddress: {},
			lineItems: []
		}
	}),
	computed: {
		...mapState(['cartItemTotal', 'multiShipOrder'])
	},
	mounted() {
		this.addresses = this.checkout.customer.addresses
		this.selectedAddress = this.checkout.customer.addresses[0]
		if (!this.multiShipOrder && !this.consignment_data.availableShippingOptions) {
			this.createConsignments(this.consignment_data.shippingAddress)
		}
	},
	methods: {
		async createConsignments(address) {
			console.log(address)
			this.selectedAddress = this.addresses[address]
			if (this.multiShipOrder) {
				const shippingAddress = this.addresses[address]
				const lineItems = [
					{
						itemId: this.consignment_data.cartItems[0].productId,
						quantity: 1
					}
				]
				const state = await this.service.createConsignments({ lineItems, shippingAddress })
			
				console.log(state.data.getConsignments())
			} else {
				await this.service.updateShippingAddress(this.selectedAddress)
			}
		},
		async updateConsignment(address) {
			this.selectedAddress = this.addresses[address]
			if (this.multiShipOrder) {
				console.log(this.addresses[address])
				const shippingAddress = this.addresses[address]
				const id = this.consignment_data.id
				const lineItems = [
					{
						itemId: this.consignment_data.cartItems[0].productId,
						quantity: 1
					}
				]
				const state = await this.service.updateConsignment({ id, lineItems, shippingAddress })
				console.log(state.data.getConsignments())

			} else {
				await this.service.updateShippingAddress(this.selectedAddress)

			}
		}
	}
}
</script>

