<template>
	<div>
		<v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
			<template v-slot:activator="{ on }">
				<v-text-field v-model="date" label="WOULD YOU LIKE TO DELIVER TO A FUTURE DATE?" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
			</template>
			<v-date-picker v-model="date" :min="min" scrollable @change="$emit('dateSelected', $event)">
				<v-spacer></v-spacer>
				<v-btn text color="primary" @click="modal = false">Cancel</v-btn>
				<v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
			</v-date-picker>
		</v-dialog>
		<p class="subtitle-2">*We highly recommend you include a gift message, or your name for the recipient’s awareness.*</p>
	</div>
</template>

<script>
export default {
	data: () => ({
		date: new Date().toISOString().substr(0, 10),
		min: new Date().toISOString().substr(0, 10),
		modal: false
	}),
	methods: {

	}
}
</script>