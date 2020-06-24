<template>
	<div class="container-fluid main rounded p-1">
		<ul class="clearfix">
			<li class="role" v-for="role in chosenRoles" :key="role.id">
				<button type="button" @click="removeRole(role.id)" v-if="multiple"><span>x</span></button>
				<span :style="{ color: '#' + (role.color ? role.color.toString(16) : '99AAB5') }">{{role.name}}</span>
			</li>

			<li class="float-right">
				<div class="dropdown">
					<button type="button" class="add-role-button dropdown-toggle color-text" ref="roleDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<font-awesome-icon :icon="multiple ? 'plus-square' : 'chevron-down'"></font-awesome-icon>
					</button>
					<div class="dropdown-menu dropdown-menu-right">
						<button type="button" class="dropdown-item" v-for="role in filteredRoles" :key="role.id" @click="addRole(role)">
							<span :style="{ color: '#' + (role.color ? role.color.toString(16) : '99AAB5') }">{{role.name}}</span>
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

.role {
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

.add-role-button {
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
			realValue: this.value || (this.multiple ? [] : null)
		};
	},
	props: {
		roles: {
			type: Array,
			required: true
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
		chosenRoles() {
			if(this.multiple) return this.roles.filter(role => this.realValue.includes(role.id));
			else return this.realValue ? [this.roles.find(role => role.id === this.realValue)] : [];
		},
		filteredRoles() {
			if(this.multiple) return this.roles.filter(role => !this.realValue.includes(role.id));
			else return this.roles.filter(role => role.id !== this.realValue);
		}
	},
	methods: {
		addRole(role) {
			if(!this.multiple) {
				this.realValue = role.id;
				this.dropdown.toggle();
			} else {
				this.realValue.push(role.id);
			}

			this.$emit("input", this.realValue);
		},
		removeRole(roleID) {
			this.realValue.splice(this.realValue.indexOf(roleID), 1);
			this.$emit("input", this.realValue);
		}
	},
	watch: {
		value(newValue, oldValue) {
			if(this.multiple && !newValue) this.realValue = [];
			else if(!this.multiple && !newValue) this.realValue = null;
			else this.realValue = newValue;
		}
	},
	async mounted() {
		await this.$nextTick();

		this.dropdown = new Dropdown(this.$refs.roleDropdown);
	}
};
</script>
