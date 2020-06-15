<template>
	<v-expansion-panel-header class="headline" hide-actions>
		<div>
			<v-avatar color="grey darken-3" size="30" style="position:absolute;left:-25px">
				<v-icon v-if="panel > panelInfo.step" color="white">mdi-check</v-icon>
				<span v-else class="white--text subtitle-1">{{panelInfo.step + 1}}</span>
			</v-avatar>
			{{panelInfo.title}}
		</div>
		<div v-if="panel > panelInfo.step" style="width:70%">
			<div class="d-flex justify-end">
				<v-list-item v-if="panelInfo.step === 0" class="mr-8">
					<v-list-item-subtitle>{{checkout.cart.email}}</v-list-item-subtitle>
				</v-list-item>
				<v-list-item three-line v-if="panelInfo.step === 1 || panelInfo.step === 2">
					<v-list-item-content>
						<v-list-item-subtitle>{{checkout.consignments[0].shippingAddress.firstName}} {{checkout.consignments[0].shippingAddress.lastName}}</v-list-item-subtitle>
						<v-list-item-subtitle>{{checkout.consignments[0].shippingAddress.company}}</v-list-item-subtitle>
						<v-list-item-subtitle>{{checkout.consignments[0].shippingAddress.phone}}</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
				<v-btn
					v-if="checkout.customer.isGuest || panelInfo.step !== 0"
					depressed
					small
					@click="$store.dispatch('setPanel', panelInfo.step)"
				>Edit</v-btn>
				<v-btn v-else depressed small @click="signOut">Sign Out</v-btn>
			</div>
		</div>
	</v-expansion-panel-header>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'PanelHeader',
	props: ['panelInfo'],
	computed: {
		...mapState(['panel', 'checkout'])
	},
	methods: {
		signOut() {
			this.$emit('signOut')
			this.$store.dispatch('setPanel', 0)
		}
	}
}
</script>