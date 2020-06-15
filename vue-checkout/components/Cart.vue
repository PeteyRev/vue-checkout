<template>
	<v-card>
		<v-card-title class="pb-0 justify-space-between">
			Order Summary
			<a :href="store_config.links.cartLink" class="subtitle-1">Edit Cart</a>
		</v-card-title>
		<v-divider></v-divider>
		<v-list-item>
			<v-list-item-content>
				<v-list-item-subtitle>{{cartItems}} Item</v-list-item-subtitle>
			</v-list-item-content>
		</v-list-item>

		<v-list v-for="(itemType, typeIndex) of checkout.cart.lineItems" :key="typeIndex">
			<v-list-item v-for="(item, index) of itemType" :key="index">
				<v-img v-if="item.imageUrl" max-width="100" contain :src="item.imageUrl"></v-img>
				<v-img v-else max-width="100" contain src="/assets/img/GiftCertificate.png"></v-img>
				<v-list-item-subtitle class="text-center ml-10">{{item.quantity}}x {{item.name}}</v-list-item-subtitle>
				<v-list-item-subtitle class="text-right">{{item.salePrice | currency}}</v-list-item-subtitle>
			</v-list-item>
		</v-list>

		<v-divider></v-divider>
		<v-list-item dense>
			<v-list-item-subtitle>Subtotal</v-list-item-subtitle>
			<v-list-item-subtitle class="text-right">{{checkout.subtotal | currency}}</v-list-item-subtitle>
		</v-list-item>
		<v-list-item v-for="(coupon) of this.checkout.coupons" :key="coupon.code" two-line dense>
			<v-list-item-content>
				<v-list-item-title>
					{{coupon.displayName}}
					<v-chip
						@click="removeCoupon(coupon.code)"
						link
						close
						small
						class="primary ml-3 text--white"
					>Remove</v-chip>
				</v-list-item-title>
				<v-list-item-title class="text--secondary">{{coupon.code}}</v-list-item-title>
			</v-list-item-content>
		</v-list-item>
		<v-list-item dense>
			<v-list-item-subtitle>Shipping</v-list-item-subtitle>
			<v-list-item-subtitle class="text-right">{{checkout.shippingCostTotal | currency}}</v-list-item-subtitle>
		</v-list-item>
		<v-list-item dense>
			<v-list-item-subtitle>Tax</v-list-item-subtitle>
			<v-list-item-subtitle class="text-right">{{checkout.taxTotal | currency}}</v-list-item-subtitle>
		</v-list-item>
		<v-list-item dense>
			<v-list-item-content>
				<v-list-item-subtitle>
					<a href="#" @click.prevent="collapseCoupon = !collapseCoupon">Coupon/Gift Certificate</a>
				</v-list-item-subtitle>
				<v-form v-if="collapseCoupon" @submit.prevent="applyCoupon()" class="d-flex align-center">
					<v-text-field v-model="couponCode" required></v-text-field>
					<v-btn class="ml-4" :loading="loading" type="submit">Apply</v-btn>
				</v-form>
			</v-list-item-content>
		</v-list-item>
		<v-divider></v-divider>
		<v-list-item class="pb-4">
			<v-list-item-subtitle>Total ({{code}})</v-list-item-subtitle>
			<v-list-item-subtitle
				class="text-right headline font-weight-bold"
			>{{checkout.grandTotal | currency}}</v-list-item-subtitle>
		</v-list-item>
	</v-card>
</template>

<script>
export default {
	name: 'Cart',
	props: ['service', 'checkout', 'store_config'],
	data: () => ({
		loading: false,
		cartItems: 0,
		symbol: '$',
		code: 'USD',
		collapseCoupon: false,
		couponCode: ''
	}),
	created() {
		this.symbol = this.checkout.cart.currency.symbol
		this.code = this.checkout.cart.currency.code
		Object.keys(this.checkout.cart.lineItems).forEach(i => {
			this.cartItems += this.checkout.cart.lineItems[i].length
		})
		this.collapseCoupon = this.store_config.checkoutSettings.isCouponCodeCollapsed
	},
	methods: {
		async applyCoupon() {
			this.loading = true
			try {
				await this.service.applyCoupon(this.couponCode)
			} catch (err) {
				console.log(err)
			}
			this.loading = false
		},
		async removeCoupon(couponCode) {
			this.loading = true
			try {
				await this.service.removeCoupon(couponCode)
			} catch (err) {
				console.log(err)
			}
			this.loading = false
		}
	}
}
</script>