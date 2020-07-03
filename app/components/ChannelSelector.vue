<template>
	<div class="container-fluid main rounded p-1">
		<ul class="clearfix">
			<li class="channel" v-for="channel in chosenChannels" :key="channel.id">
				<button type="button" @click="removeChannel(channel.id)" v-if="multiple"><span>x</span></button>
				<font-awesome-icon :icon="{ 0: 'hashtag', 2: 'volume-up', 4: 'chevron-right'}[channel.type]"></font-awesome-icon>
				{{channel.name}}
			</li>

			<li class="float-right">
				<div class="dropdown">
					<button type="button" class="add-channel-button dropdown-toggle color-text" ref="channelDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<font-awesome-icon :icon="multiple ? 'plus-square' : 'chevron-down'"></font-awesome-icon>
					</button>
					<div class="dropdown-menu dropdown-menu-right">
						<button type="button" class="dropdown-item" v-for="channel in unchosenChannels" :key="channel.id" @click="addChannel(channel)">
							<font-awesome-icon :icon="{ 0: 'hashtag', 2: 'volume-up', 4: 'chevron-right'}[channel.type]"></font-awesome-icon>
							{{channel.name}}
						</button>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
@import "../variables";

div.main {
	background: $color-main;
	border: 1px solid $color-secondary;

	& ul {
		list-style: none;
		margin: 0;
		padding: 1px;
		& li {
			display: inline-block;
			margin: 1px 2px;
		}
	}
}

.channel {
	border-radius: 12px;
	border: 1px solid $color-secondary;
	background: darken($color-main, 5);
	padding: 2px 6px;
	font-size: 14px;

	& button {
		outline: none;
		border: none;
		background: $color-background;
		border-radius: 50%;
		width: 15px;
		height: 15px;
		margin-top: 2px;
		margin-right: 4px;
		float: left;
		cursor: pointer;
		position: relative;

		& span {
			opacity: 0;
			color: white;
			position: absolute;
			top: -3px;
			left: 4px;
			font-size: 14px;
		}

		&:hover span {
			opacity: 1;
		}
	}
}

.add-channel-button {
	color: $color-text;
	transition: 0.2s ease-in-out;
	cursor: pointer;
	border: none;
	outline: none;
	background: transparent;
	padding: 0;
	font-size: 20px;
	vertical-align: middle;
	min-height: 25px;

	&:hover {
		color: lighten($color-text, 30) !important;
		transform: scale(1.25);
	}

	&::after {
		content: none;
	}
}

.dropdown-menu {
	background: $color-secondary;
	border: 1px solid darken($color-secondary, 10);
}

.dropdown-item {
	color: $color-text;
	padding-left: 8px;
	padding-right: 8px;
	&:hover, &:focus, &:active {
		color: white;
		background: $color-secondary;
	}
}
</style>


<script>
import Dropdown from "bootstrap.native/dist/components/dropdown-native.esm";

export default {
	data() {
		return {
			dropdown: null,
			selected: this.value || (this.multiple ? [] : null),
			filteredChannels: this.channels.filter(channel => {
				if(this.filter === "category") return channel.type === 4;
				else if(this.filter === "voice") return channel.type === 2;
				else if(this.filter === "text") return channel.type === 0;
				else return true;
			})
		};
	},
	props: {
		channels: {
			type: Array,
			required: true
		},
		filter: {
			type: String,
			default() {
				return "text";
			},
			validator(value) {
				return ["category", "text", "voice"].includes(value);
			}
		},
		multiple: {
			type: Boolean,
			default() {
				return false;
			}
		},
		value: {
			type: [String, Array],
			default() {
				return null;
			}
		}
	},
	computed: {
		chosenChannels() {
			if(this.multiple) return this.filteredChannels.filter(channel => this.selected.includes(channel.id));
			else return this.selected ? [this.filteredChannels.find(channel => channel.id === this.selected)] : [];
		},
		unchosenChannels() {
			if(this.multiple) return this.filteredChannels.filter(channel => !this.selected.includes(channel.id));
			else return this.filteredChannels.filter(channel => channel.id !== this.selected);
		}
	},
	methods: {
		addChannel(channel) {
			if(!this.multiple) {
				this.selected = channel.id;
				this.dropdown.toggle();
			} else {
				this.selected.push(channel.id);
			}

			this.$emit("input", this.selected);
		},
		removeChannel(channelID) {
			this.selected.splice(this.selected.indexOf(channelID), 1);
			this.$emit("input", this.selected);
		}
	},
	watch: {
		value(newValue, oldValue) {
			if(this.multiple && !newValue) this.selected = [];
			else if(!this.multiple && !newValue) this.selected = null;
			else this.selected = newValue;
		}
	},
	async mounted() {
		await this.$nextTick();

		this.dropdown = new Dropdown(this.$refs.channelDropdown);
	}
};
</script>
