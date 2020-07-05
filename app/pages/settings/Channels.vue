<template>
	<form>
		<div class="form-group custom-control custom-switch">
			<input type="checkbox" class="custom-control-input" id="channelsEnabled" v-model="enabled" />
			<label class="custom-control-label" for="channelsEnabled">Enable Channels</label>
			<small class="form-text">Whether or not to enable channels, a feature where users can create their own voice channels that last temporarily.</small>
		</div>
		<div class="form-group">
			<label>Channel Category</label>
			<channelselector :channels="guild.channels" filter="category" v-model="categoryId"></channelselector>
			<small class="form-text">What category to make the voice channels in.</small>
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
				return this.guild.settings.channels.enabled;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "channels.enabled",
					value
				});

				if(this.categoryId) await this.saveSettings();
			}
		},
		categoryId: {
			get() {
				return this.guild.settings.channels.categoryId;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "channels.categoryId",
					value
				});

				await this.saveSettings();
			}
		}
	},
	methods: {
		async saveSettings() {
			await apiRequest({
				path: `settings/${this.$route.params.id}/channels`,
				method: "PUT",
				headers: {
					Authorization: this.authToken
				},
				body: {
					enabled: this.enabled,
					categoryId: this.categoryId
				}
			});
		}
	}
};
</script>
