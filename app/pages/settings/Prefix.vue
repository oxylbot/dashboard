<template>
	<form>
		<div class="form-group">
			<label for="prefix">Custom Prefix</label>
			<input type="text" class="form-control" id="prefix" maxlength="10" placeholder="Enter prefix" v-model="custom">
			<small class="form-text">Custom prefix for Oxyl to use. Leave blank for none.</small>
		</div>
		<div class="form-group custom-control custom-switch">
			<input type="checkbox" class="custom-control-input" id="prefixOverwrite" v-model="overwrite">
			<label class="custom-control-label" for="prefixOverwrite">Overwrite Prefix</label>
			<small class="form-text">Whether or not this prefix will overwrite the default o! prefix.</small>
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
		custom: {
			get() {
				return this.guild.settings.prefix.custom;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "prefix.custom",
					value
				});

				await this.saveSettings();
			}
		},
		overwrite: {
			get() {
				return this.guild.settings.prefix.overwrite;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "prefix.overwrite",
					value
				});

				await this.saveSettings();
			}
		}
	},
	methods: {
		async saveSettings() {
			await apiRequest({
				path: `settings/${this.$route.params.id}/prefix/`,
				method: "PUT",
				headers: {
					Authorization: this.authToken
				},
				body: {
					overwrite: this.overwrite,
					prefix: this.prefix
				}
			});
		}
	}
};
</script>
