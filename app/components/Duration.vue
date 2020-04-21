<template>
	<div>
		<div class="inline">
			<input class="form-control" type="number" v-model.number="days" min="0" max="730">
			<span>days</span>
		</div>
		<div class="inline">
			<input class="form-control" type="number" v-model.number="hours" min="0" max="24">
			<span>hours</span>
		</div>
		<div class="inline">
			<input class="form-control" type="number" v-model.number="minutes" min="0" max="60">
			<span>minutes</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "../variables";

span {
	color: $color-text;
}

.inline {
	display: inline-block;
}
</style>


<script>
export default {
	data() {
		const total = Math.max(this.value, 0);

		return {
			days: Math.floor(total / 1440),
			hours: Math.floor(total % 1440 / 60),
			minutes: total % 1440 % 60,
			total
		};
	},
	props: {
		value: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	methods: {
		calculateTotal() {
			this.total = (this.days * 1440) + (this.hours * 24) + this.minutes;
			this.$emit("input", this.total);
		}
	},
	watch: {
		days(days) {
			this.calculateTotal();
		},
		hours(hours) {
			if(hours === 24) {
				if(this.days < 730) {
					this.days++;
					this.hours = 0;
				} else {
					this.hours = 23;
				}
			}

			this.calculateTotal();
		},
		minutes(minutes) {
			if(minutes === 60) {
				this.minutes = 0;
				this.hours++;
			}

			this.calculateTotal();
		}
	}
};
</script>
