<template>
	<v-expansion-panel>
		<PanelHeader :panelInfo="panelInfo" />
		<v-expansion-panel-content>
			<v-radio-group
				v-if="paymentOptions.length"
				v-model="paymentMethod"
				:loading="isLoading"
				label="Payment Method"
				required
			>
				<v-list elevation="2" rounded>

					<v-list-item-group color="primary">
						<div v-for="(option, index) of paymentOptions" :key="option.id">
							<v-list-item ripple="{ center: true }" :input-value="option.id">
								<v-list-item-content>
									<div class="d-flex">
										<v-radio :label="option.config.displayName" :value="option.id"></v-radio>
										<!-- <v-img v-if="option.logoUrl" :src="option.logoUrl" contain width="105" height="25"></v-img> -->
									</div>
								</v-list-item-content>

								<div class="d-flex">
									<component
										v-for="(card, cardIndex) of option.supportedCards"
										class="card-icon"
										:key="cardIndex"
										:is="card"
									/>
								</div>
							</v-list-item>
							<CreditCard
								v-if="option.method === 'credit-card' || option.method === 'zzzblackhole'"
								v-show="paymentMethod === option.id"
							/>
							<v-divider v-if="index !== paymentOptions.length - 1"></v-divider>
						</div>
					</v-list-item-group>
				</v-list>
			</v-radio-group>

			<v-checkbox
				v-if="store_config.checkoutSettings.enableTermsAndConditions"
				v-model="termsAndConditions"
				label="Terms and Conditions"
			></v-checkbox>

			<v-btn color="primary" block large :disabled="paymentMethod === null || !termsAndConditions" @click="submitOrder" isLoading="isLoading">Place Order</v-btn>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script>
import CreditCard from './CreditCard.vue'
import PanelHeader from './PanelHeader.vue'
import VISA from '../icons/VISA.svg'
import MC from '../icons/MC.svg'
import AMEX from '../icons/AMEX.svg'
import DISCOVER from '../icons/DISCOVER.svg'
import JCB from '../icons/JCB.svg'
import DINERS from '../icons/DINERS.svg'

export default {
	name: 'PaymentPanel',
	props: ['service', 'checkout', 'store_config'],
	components: {
		CreditCard,
		PanelHeader,
		VISA,
		AMEX,
		DISCOVER,
		JCB,
		DINERS
	},
	data: () => ({
		isLoading: false,
		panelInfo: {
			title: 'Payment',
			step: 3
		},
		termsAndConditions: true,
		paymentMethod: null,
		paymentOptions: [],
		paymentData: {
			ccExpiry: { month: 10, year: 2022 },
			ccName: 'BigCommerce',
			ccNumber: '4111111111111111',
			ccType: 'visa',
			ccCvv: 123
		}
	}),
	async mounted() {
		this.isLoading = true
		const state = await this.service.loadPaymentMethods()
		this.paymentOptions = state.data.getPaymentMethods()
		if (this.store_config.checkoutSettings.enableTermsAndConditions) {
			this.termsAndConditions = false
		}
	},
	methods: {
		async submitOrder() {
			this.isLoading = true
			await this.service.initializePayment({ methodId: this.paymentMethod })
			const payment = {
				methodId: this.paymentMethod,
				paymentData: this.paymentData
			}
			const state = await this.service.submitOrder({ payment })
			await this.service.deinitializePayment({
				methodId: this.paymentMethod
			})
			console.log(state.data.getOrder())

			window.location.assign('/checkout/order-confirmation')
		}
	}
}
</script>



<style lang="scss">
svg {
	width: 50px;
	height: 38px;
}
</style>