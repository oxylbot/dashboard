<template>
	<div class="col-lg-12 col-md-12 col-sm-12">
		<div class="row">
			<div class="col-12 mb-4">
				<button type="button" class="btn" @click="addChannel()">
					<font-awesome-icon icon="plus-square" class="mr-1"></font-awesome-icon>
					Add a Twitch feed
				</button>
			</div>
			<div class="col-sm-12 col-lg-6 col-xl-4" v-for="channel in channels" :key="channel.id">
				<div class="card">
					<div class="card-body">
						<button type="button" class="btn float-right mb-1 ml-1" @click="editChannel(channel)">
							<font-awesome-icon icon="edit"></font-awesome-icon>
						</button>
						<h5 class="card-title">{{channel.channelName}}</h5>
					</div>
					<ul class="list-group list-group-flush">
						<li class="list-group-item">
							Posts to:
							<font-awesome-icon icon="hashtag"></font-awesome-icon>
							{{guild.channels.find(dChannel => dChannel.id === channel.discordChannel).name}}
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="modal" tabindex="-1" role="dialog" ref="editChannel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" :key="edit.id">{{edit.channelName}}</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form>
							<div class="form-group">
								<label for="channel">Channel</label>
								<input type="text" class="form-control" id="channel" maxlength="20" placeholder="Enter channel" v-model.trim="edit.channelName">
								<small class="form-text">The channel you want to get updates about.</small>
							</div>
							<div class="form-group">
								<label>Channel</label>
								<channelselector :channels="guild.channels" v-model="edit.discordChannel"></channelselector>
								<small class="form-text">The channel to post the channel updates to.</small>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" @click="saveChannel()">Save</button>
						<button type="button" class="btn btn-danger" @click="deleteChannel()">Delete</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import apiRequest from "../../apiRequest";
import { createNamespacedHelpers } from "vuex";
import { Modal } from "bootstrap.native/dist/bootstrap-native-v4";

const { mapState: mapAccountState } = createNamespacedHelpers("account");
const { mapState: mapGuildsState } = createNamespacedHelpers("guilds");

export default {
	data() {
		return {
			edit: {},
			editModal: null
		};
	},
	computed: {
		...mapAccountState({
			authToken: "token"
		}),
		...mapGuildsState({
			guild(state) {
				return state[this.$route.params.id];
			}
		}),
		channels() {
			return this.guild.settings.twitch;
		}
	},
	methods: {
		addChannel() {
			this.edit = {
				id: -1,
				channelName: null,
				discordChannel: null
			};

			this.editModal.show();
		},
		editChannel(channel) {
			this.edit = JSON.parse(JSON.stringify(channel));
			this.editModal.show();
		},
		async saveChannel() {
			if(this.edit.id === -1) {
				const { body } = await apiRequest({
					path: `settings/${this.$route.params.id}/twitch`,
					method: "POST",
					headers: {
						Authorization: this.authToken
					},
					body: {
						channelName: this.edit.channelName,
						channelId: this.edit.discordChannel
					}
				});

				this.edit.id = body.id;
				this.$store.commit("guilds/updateSettingArray", {
					id: this.$route.params.id,
					action: "add",
					path: "twitch",
					value: this.edit
				});
			} else {
				this.$store.commit("guilds/updateSettingArray", {
					id: this.$route.params.id,
					action: "update",
					path: "twitch",
					value: this.edit
				});

				await apiRequest({
					path: `settings/${this.$route.params.id}/twitch/${this.edit.id}`,
					method: "PATCH",
					headers: {
						Authorization: this.authToken
					},
					body: {
						channelName: this.edit.channelName,
						channelId: this.edit.discordChannel
					}
				});
			}

			this.editModal.hide();
		},
		async deleteChannel() {
			this.$store.commit("guilds/updateSettingArray", {
				id: this.$route.params.id,
				action: "delete",
				path: "twitch",
				value: this.edit
			});

			await apiRequest({
				path: `settings/${this.$route.params.id}/twitch/${this.edit.id}`,
				method: "DELETE",
				headers: {
					Authorization: this.authToken
				}
			});

			this.editModal.hide();
		}
	},
	async mounted() {
		await this.$nextTick();

		this.editModal = new Modal(this.$refs.editChannel);
	}
};
</script>

