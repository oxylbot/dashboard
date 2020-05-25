<template>
	<form>
		<div class="form-group custom-control custom-switch">
			<input type="checkbox" class="custom-control-input" id="suggestionsEnabled" v-model="enabled">
			<label class="custom-control-label" for="suggestionsEnabled">Enable Suggestions</label>
			<small class="form-text">Whether or not to enable suggestions.</small>
		</div>
		<div class="form-group">
			<label>Suggestions Channel</label>
			<channelselector :channels="guild.channels" filter="text" v-model="channel"></channelselector>
			<small class="form-text">What channel to send the suggestions in.</small>
		</div>
	</form>
</template>

<script>
import apiRequest from "../../apiRequest";
import { createNamespacedHelpers } from "vuex";

const { mapState: mapAccountState } = createNamespacedHelpers("account");
const { mapState: mapGuildsState } = createNamespacedHelpers("guilds");

export default {
	computed: {
		...mapAccountState({
			authToken: "token"
		}),
		...mapGuildsState({
			guild(state) {
				return state[this.$route.params.id];
			}
		}),
		enabled: {
			get() {
				return this.guild.settings.suggestions.enabled;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "suggestions.enabled",
					value
				});

				await this.saveSettings();
			}
		},
		channel: {
			get() {
				return this.guild.settings.suggestions.channel;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "suggestions.channel",
					value
				});

				await this.saveSettings();
			}
		}
	},
	methods: {
		async saveSettings() {
			await apiRequest({
				path: `settings/${this.$route.params.id}/suggestions`,
				method: "PUT",
				headers: {
					Authorization: this.authToken
				},
				body: {
					enabled: this.enabled,
					channelId: this.channel
				}
			});
		}
	}
};
</script>
