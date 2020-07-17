<template>
	<form>
		<div class="form-group custom-control custom-switch">
			<input type="checkbox" class="custom-control-input" id="nowPlayingMessages" v-model="nowPlayingMessages">
			<label class="custom-control-label" for="nowPlayingMessages">Now Playing Messages</label>
			<small class="form-text">Whether or not to messages which say when a song is now playing.</small>
		</div>
		<div class="form-group custom-control custom-switch">
			<input type="checkbox" class="custom-control-input" id="voteSkip" v-model="voteSkip">
			<label class="custom-control-label" for="voteSkip">Vote Skip</label>
			<small class="form-text">Whether or not to enable vote-skip functionality. A third of the people in the channel would have to vote to skip a song, and the skip functionality would be replaced. You would have to use forceskip instead of skip to skip songs.</small>
		</div>
		<div class="form-group">
			<label for="maxLength">Maximum Song Length</label>
			<duration id="maxLength" v-model="maxLength"></duration>
			<small class="form-text">Maximum length that a song can be in order to be queued. 0 for no limit. Livestreams will still be playable.</small>
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
		nowPlayingMessages: {
			get() {
				return this.guild.settings.music.nowPlayingMessages;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "music.nowPlaying",
					value
				});

				await this.saveSettings();
			}
		},
		voteSkip: {
			get() {
				return this.guild.settings.music.voteSkip;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "music.voteSkip",
					value
				});

				await this.saveSettings();
			}
		},
		maxLength: {
			get() {
				return this.guild.settings.music.maxLength;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "music.maxLength",
					value
				});

				await this.saveSettings();
			}
		}
	},
	methods: {
		async saveSettings() {
			await apiRequest({
				path: `settings/${this.$route.params.id}/music`,
				method: "PUT",
				headers: {
					Authorization: this.authToken
				},
				body: {
					nowPlayingMessages: this.nowPlayingMessages,
					voteSkip: this.voteSkip,
					maxLength: this.maxLength
				}
			});
		}
	}
};
</script>
