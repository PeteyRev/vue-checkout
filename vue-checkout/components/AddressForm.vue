<template>
	<v-form ref="form" class="d-flex mt-5 flex-wrap justify-space-between">
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
				@change="loadStates"
				@input="validateForm"
			></v-select>
		</div>
		<v-card-actions v-if="!checkout.customer.isGuest">
			<v-spacer></v-spacer>
			<v-btn color="blue darken-1" text @click="$emit('closeModal')">Close</v-btn>
			<v-btn color="primary" @click="dialog = false">Save</v-btn>
		</v-card-actions>
	</v-form>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'AddressForm',
	props: ['service', 'checkout'],
	data: () => ({
		address: {},
		fields: [],
		countries: [],
		states: [],
	}),
	async created() {
		const state = await this.service.loadShippingCountries()
		this.countries = state.data.getShippingCountries()
		this.fields = state.data.getShippingAddressFields()
		this.fields.forEach(i => (this.address[i.name] = ''))
		this.loadStates('US')
		this.address.countryCode = 'US'
		this.address.stateOrProvince = 'TX'
		if (this.checkout.customer.isGuest) {
			this.address = state.data.getShippingAddress()
		}

	},
	computed: {
		...mapState(['storeConfig'])
	},
	methods: {
		async validateForm() {
			if (this.$refs.form.validate()) {
				if (this.checkout.customer.isGuest) {
					await this.service.updateShippingAddress(this.address)
					await this.service.updateBillingAddress(this.address)
					// await this.service.loadShippingOptions()
				}
			}
		},
		loadStates(e) {
			const match = this.countries.filter(i => i.code === e)
			if (match.length) {
				this.states = match[0].subdivisions
			}
		}
	}
}
</script>