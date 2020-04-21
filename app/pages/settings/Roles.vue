<template>
	<form>
		<div class="form-group">
			<label>Autorole</label>
			<roleselector :roles="guild.roles" v-model="autorole" multiple></roleselector>
			<small class="form-text">Roles that members will automatically receive when they join. Excludes bots (see below).</small>
		</div>
		<div class="form-group">
			<label>Autorole for bots</label>
			<roleselector :roles="guild.roles" v-model="autorolebot" multiple></roleselector>
			<small class="form-text">Roles that bots will automatically receive when being added.</small>
		</div>
		<div class="form-group">
			<label>Roleme</label>
			<roleselector :roles="guild.roles" v-model="roleme" multiple></roleselector>
			<small class="form-text">Roles that users can add or remove from themselves using the roleme command.</small>
		</div>
	</form>
</template>

<script>
import apiRequest from "../../apiRequest";
import { createNamespacedHelpers } from "vuex";

const { mapGetters } = createNamespacedHelpers("account");
const { mapState } = createNamespacedHelpers("guilds");

export default {
	computed: {
		...mapGetters({
			authToken: "token"
		}),
		...mapState({
			guild(state) {
				return state[this.$route.params.id];
			}
		}),
		autorole: {
			get() {
				return this.guild.settings.roles.autorole;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "roles.autorole",
					value
				});

				await apiRequest({
					path: `settings/${this.$route.params.id}/roles/autorole`,
					method: "PUT",
					headers: {
						Authorization: this.authToken
					},
					body: { roles: value }
				});
			}
		},
		autorolebot: {
			get() {
				return this.guild.settings.roles.autorolebot;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "roles.autoromebot",
					value
				});

				await apiRequest({
					path: `settings/${this.$route.params.id}/autorole/bots`,
					method: "PUT",
					headers: {
						Authorization: this.authToken
					},
					body: { roles: value }
				});
			}
		},
		roleme: {
			get() {
				return this.guild.settings.roles.roleme;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "roles.roleme",
					value
				});

				await apiRequest({
					path: `settings/${this.$route.params.id}/roleme`,
					method: "PUT",
					headers: {
						Authorization: this.authToken
					},
					body: { roles: value }
				});
			}
		}
	}
};
</script>
