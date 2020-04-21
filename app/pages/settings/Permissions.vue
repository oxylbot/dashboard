<template>
	<form>
		<div class="form-group">
			<label>Role</label>
			<roleselector :roles="guild.roles" v-model="role"></roleselector>
			<small class="form-text">The role you would like to edit permissions for.</small>
		</div>
		<div v-if="role">
			<div class="form-group custom-control custom-switch pl-0" v-for="(command, i) in Object.values(commands).flat()" v-scroll-reveal="{ distance: '25px', origin: 'top', scale: .8 }" :key="i">
				<input type="checkbox" class="custom-control-input" :id="command + 'Enabled'" :key="role" :checked="hasPermission(command)" @change="editPermission(command, $event.target.checked)">
				<label class="custom-control-label float-right" :for="command + 'Enabled'"></label>
				<label :for="command + 'Enabled'">{{command}}</label>
			</div>
		</div>
	</form>
</template>

<script>
import apiRequest from "../../apiRequest";
import { createNamespacedHelpers } from "vuex";

const { mapGetters } = createNamespacedHelpers("account");
const { mapState: mapGuildsState } = createNamespacedHelpers("guilds");
const { mapState: mapClientState } = createNamespacedHelpers("client");

export default {
	data() {
		return {
			role: null
		};
	},
	computed: {
		...mapGetters({
			authToken: "token"
		}),
		...mapGuildsState({
			guild(state) {
				return state[this.$route.params.id];
			}
		}),
		...mapClientState(["commands"])
	},
	methods: {
		hasPermission(command) {
			const rolePermissions = this.guild.settings.permissions[this.role] || {};
			return !rolePermissions.disabledCommands.includes(command) && rolePermissions.enabledCommands.includes(command);
		},
		async editPermission(command, value) {
			let method = "PUT";
			const rolePermissions = this.guild.settings.permissions[this.role] || {};

			if(!rolePermissions.hasOwnProperty("enabledCommands")) {
				method = "POST";
				rolePermissions.enabledCommands = [];
				rolePermissions.disabledCommands = [];
			}

			const toAdd = value ? "enabledCommands" : "disabledCommands";
			const toRemove = value ? "disabledCommands" : "enabledCommands";

			rolePermissions[toAdd].push(command);
			const removeIndex = rolePermissions[toRemove].indexOf(command);
			if(removeIndex > 1) rolePermissions[toRemove].splice(removeIndex, 1);

			this.$store.commit("guilds/updateSetting", {
				id: this.$route.params.id,
				path: `permissions.${this.role}`,
				value: rolePermissions
			});

			await apiRequest({
				path: `settings/${this.$route.params.id}/permissions/${this.role}`,
				method,
				headers: {
					Authorization: this.authToken
				},
				body: rolePermissions
			});
		}
	}
};
</script>
