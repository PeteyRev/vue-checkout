<template>
	<div>
		<AddressForm
			v-if="checkout.customer.isGuest"
			:checkout="checkout"
			:service="service"
			v-on:getShippingOptions="getShippingOptions"
		/>
		<CustomerAddresses
			v-else
			:checkout="checkout"
			:service="service"
			:consignment_data="consignment_data"
		/>

		<div style="position:relative;min-height:150px">
			<v-overlay v-if="!this.checkout.consignments.length" absolute opacity="0.4" color="#F5F5F5">
				<div
					v-if="!isLoading"
					class="text-center px-5 black--text"
					absolute
				>Please enter a shipping address in order to see shipping quotes</div>
				<v-progress-circular v-if="isLoading" indeterminate size="64" color="primary"></v-progress-circular>
			</v-overlay>

			<v-radio-group
				v-if="checkout.consignments.length"
				v-model="shippingOption"
				:loading="isLoading"
				@change="selectShippingOption"
				required
			>
				<v-list elevation="2" rounded>
					<v-list-item-group color="primary">
						<div v-for="(option, index) of consignment_data.availableShippingOptions" :key="option.id">
							<v-list-item ripple="{ center: true }" :input-value="option.id">
								<v-list-item-content>
									<v-radio :label="option.description" :value="option.id"></v-radio>
								</v-list-item-content>
								<span v-if="option.cost === 0">Free</span>
								<span v-else>{{option.cost | currency}}</span>
							</v-list-item>

							<v-divider v-if="index !== consignment_data.availableShippingOptions.length - 1"></v-divider>
						</div>
					</v-list-item-group>
				</v-list>
			</v-radio-group>
		</div>
		<v-textarea
			v-if="store_config.checkoutSettings.enableOrderComments"
			v-model="customerMessage"
			name="comments"
			label="Order Comments"
			placeholder="Enter message here..."
			outlined
			class="mt-7"
			height="100"
		></v-textarea>
		<Calendar v-if="checkout.consignments.length" v-on:dateSelected="dateSelected = $event" />
	</div>
</template>
<script>
import { mapState } from 'vuex'
import Calendar from './Calendar.vue'
import AddressForm from './AddressForm.vue'
import CustomerAddresses from './CustomerAddresses.vue'

export default {
	name: 'Consignment',
	props: ['service', 'checkout', 'store_config', 'consignment_data'],
	components: {
		Calendar,
		AddressForm,
		CustomerAddresses
	},
	data: () => ({
		isLoading: false,
		shippingOption: false,
		selectedShippingOption: '',
		customerMessage: '',
		dateSelected: '',
		street: ''
	}),
	computed: {
		...mapState(['cartItemTotal', 'multiShipOrder'])
	},
	created() {
		// if (this.checkout.customer.isGuest) {
		// 	//TODO: Update with exising customer message if available

		// 	this.customerMessage = this.checkout.customerMessage
		// 	//TODO: Hightlight selected shipping opton if available

		// 	if (this.selectedShippingOption) {
		// 		this.shippingOption = this.checkout.consignments[0].selectedShippingOption.id
		// 	}
		// }
	},
	methods: {
		async selectShippingOption() {
			console.log('Selected shoipping option')
			this.isLoading = true
			try {
				if (this.multiShipOrder) {
					const consignmentId = this.consignment_data.id
					const shippingOptionId = this.shippingOption
					console.log(consignmentId)
					const test = await this.service.selectConsignmentShippingOption({consignmentId, shippingOptionId})
					console.log(test.data.getBillingAddress());
				} else {
					await this.service.selectShippingOption(this.shippingOption)
				}
				this.street = this.consignment_data.shippingAddress.address1
				

			} catch (err) {
				console.log(err)
			}
			this.isLoading = false
		}
	}
}
</script>