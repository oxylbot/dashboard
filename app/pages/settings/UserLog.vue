<template>
	<form>
		<div class="form-group custom-control custom-switch">
			<input type="checkbox" class="custom-control-input" id="userLog" v-model="enabled">
			<label class="custom-control-label" for="userLog">Enable User Log</label>
			<small class="form-text">Whether or not enable the user log.</small>
		</div>
		<div class="form-group">
			<label>User Log Channel</label>
			<channelselector :channels="guild.channels" filter="text" v-model="channel"></channelselector>
			<small class="form-text">What channel to send the messages in.</small>
		</div>
		<div class="form-group">
			<label for="prefix">Join Message</label>
			<input v-pre type="text" class="form-control" id="prefix" maxlength="2000" placeholder="Welcome {{mention}} to the server" v-model="joinMessage">
			<small class="form-text" v-pre>The join message that should be sent, leave blank to disable. Placeholders: {{name}}, {{discrim}}, {{id}}, {{mention}}</small>
		</div>
		<div class="form-group">
			<label for="prefix">Leave Message</label>
			<input v-pre type="text" class="form-control" id="prefix" maxlength="2000" placeholder="Goodbye {{name}}#{{discrim}} :wave:" v-model="leaveMessage">
			<small class="form-text" v-pre>The leave message that should be sent, leave blank to disable. Placeholders: {{name}}, {{discrim}}, {{id}}, {{mention}}</small>
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
		enabled: {
			get() {
				return this.guild.settings.userlog.enabled;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "userlog.enabled",
					value
				});

				await this.saveSettings();
			}
		},
		channel: {
			get() {
				return this.guild.settings.userlog.channel;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "userlog.channel",
					value
				});

				await this.saveSettings();
			}
		},
		joinMessage: {
			get() {
				return this.guild.settings.userlog.joinMessage;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "userlog.joinMessage",
					value
				});

				await this.saveSettings();
			}
		},
		leaveMessage: {
			get() {
				return this.guild.settings.userlog.leaveMessage;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "userlog.leaveMessage",
					value
				});

				await this.saveSettings();
			}
		}
	},
	methods: {
		async saveSettings() {
			await apiRequest({
				path: `settings/${this.$route.params.id}/user-log`,
				method: "PUT",
				headers: {
					Authorization: this.authToken
				},
				body: {
					enabled: this.enabled,
					channelId: this.channel,
					joinMessage: this.joinMessage,
					leaveMessage: this.leaveMessage
				}
			});
		}
	}
};
</script>
