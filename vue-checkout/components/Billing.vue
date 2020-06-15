<template>
	<v-expansion-panel>
		<PanelHeader :panelInfo="panelInfo" />
		<v-expansion-panel-content>
			<v-form
				ref="form"
				class="d-flex flex-wrap justify-space-between"
				@submit.prevent="submitBilling()"
			>
				<div v-for="(field, index) of fields" :key="index" :class="field.name">
					<v-text-field
						v-if="field.name !== 'countryCode' && field.name !== 'stateOrProvince' "
						v-model="address[field.name]"
						:label="field.label"
						:required="field.required"
						outlined
						:rules="field.required ? [v => !!v || `${field.label} is required`] : false"
						@input="validateForm"
					></v-text-field>
					<v-select
						v-if="field.name === 'countryCode' || field.name === 'stateOrProvince'"
						:items="field.name === 'countryCode' ? countries : states"
						item-text="name"
						item-value="code"
						outlined
						:label="field.label"
						:required="field.required"
						:rules="field.required ? [v => !!v || `${field.label} is required`] : false"
						:disabled="states.length === 0 && field.name === 'stateOrProvince'"
						v-model="address[field.name]"
						@change="field.name === 'countryCode' ? loadStates : false"
						@input="validateForm"
					></v-select>
				</div>
				<v-btn :loading="loading" :disabled="!valid" type="submit">Submit</v-btn>
			</v-form>
		</v-expansion-panel-content>
		<v-divider></v-divider>
	</v-expansion-panel>
</template>

<script>
import { email, required } from 'vuelidate/lib/validators'
import PanelHeader from './PanelHeader.vue'

export default {
	name: 'BillingPanel',
	props: ['service', 'checkout', 'store_config'],
	components: {
		PanelHeader
	},
	data: () => ({
		valid: false,
		panelInfo: {
			title: 'Billing',
			step: 2
		},
		fields: [],
		countries: [],
		states: [],
		address: {},
		loading: false
	}),
	async created() {
		await this.getFormData()
		this.checkout.billingAddress = this.address 
	},
	methods: {
		async getFormData() {
			this.fields = this.store_config.formFields.billingAddressFields
			this.fields.forEach(i => (this.address[i.name] = ''))
			const state = await this.service.loadBillingCountries()
			this.countries = state.data.getBillingCountries()
			this.loadStates('US')
			this.address.countryCode = 'US'
			this.address.stateOrProvince = 'TX'
		},
		loadStates(e) {
			this.states = this.countries.filter(i => i.code === e)[0].subdivisions
		},
		async submitBilling() {
			this.isLoading = true
			try {
				await this.service.updateBillingAddress(this.address)
				this.$store.dispatch('setPanel', 3)
			} catch (err) {
				console.log(err)
			}
			this.isLoading = false
		},
		validateForm() {
			if (this.$refs.form.validate()) {
				this.valid = true
			}
		}
	}
}
</script>