<template>
	<div class="col-lg-12 col-md-12 col-sm-12">
		<div class="row">
			<div class="col-12 mb-4">
				<button type="button" class="btn" @click="addSubreddit()">
					<font-awesome-icon icon="plus-square" class="mr-1"></font-awesome-icon>
					Add a Reddit feed
				</button>
			</div>
			<div class="col-sm-12 col-lg-6 col-xl-4" v-for="subreddit in subreddits" :key="subreddit.id">
				<div class="card">
					<div class="card-body">
						<button type="button" class="btn float-right mb-1 ml-1" @click="editSubreddit(subreddit)">
							<font-awesome-icon icon="edit"></font-awesome-icon>
						</button>
						<h5 class="card-title">{{subreddit.subreddit}}</h5>
					</div>
					<ul class="list-group list-group-flush">
						<li class="list-group-item">Type: {{subreddit.type}}</li>
						<li class="list-group-item">
							Posts to:
							<font-awesome-icon icon="hashtag"></font-awesome-icon>
							{{guild.channels.find(channel => channel.id === subreddit.channel).name}}
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="modal" tabindex="-1" role="dialog" ref="editSubreddit" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" :key="edit.id">{{edit.name}}</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form>
							<div class="form-group">
								<label for="subreddit">Subreddit</label>
								<input type="text" class="form-control" id="subreddit" maxlength="20" placeholder="Enter subreddit" v-model.trim="edit.subreddit">
								<small class="form-text">The subreddit you want to get posts from. /r/ is optional.</small>
							</div>
							<div class="custom-control custom-radio">
								<input type="radio" id="hotPosts" name="subredditType" class="custom-control-input" value="hot" v-model="edit.type">
								<label class="custom-control-label" for="hotPosts">Hot posts</label>
							</div>
							<div class="form-group custom-control custom-radio">
								<input type="radio" id="newPosts" name="subredditType" class="custom-control-input" value="new" v-model="edit.type">
								<label class="custom-control-label" for="newPosts">New posts</label>
								<small class="form-text">The type of posts that should be sent in the channel.</small>
							</div>
							<div class="form-group">
								<label>Channel</label>
								<channelselector :channels="guild.channels" v-model="edit.channel"></channelselector>
								<small class="form-text">The channel to post the subreddit posts to.</small>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" @click="saveSubreddit()">Save</button>
						<button type="button" class="btn btn-danger" @click="deleteSubreddit()">Delete</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import apiRequest from "../../apiRequest";
import { createNamespacedHelpers } from "vuex";
import Modal from "bootstrap.native/dist/components/modal-native.esm";

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
		subreddits() {
			return this.guild.settings.reddit;
		}
	},
	methods: {
		addSubreddit() {
			this.edit = {
				id: -1,
				subreddit: null,
				type: null,
				channelId: null
			};

			this.editModal.show();
		},
		editSubreddit(reddit) {
			this.edit = JSON.parse(JSON.stringify(reddit));
			this.editModal.show();
		},
		async saveSubreddit() {
			if(this.edit.id === -1) {
				const { body } = await apiRequest({
					path: `settings/${this.$route.params.id}/reddit`,
					method: "POST",
					headers: {
						Authorization: this.authToken
					},
					body: {
						subreddit: this.edit.subreddit,
						feedType: this.edit.type,
						channelId: this.edit.channelId
					}
				});

				this.edit.id = body.id;
				this.$store.commit("guilds/updateSettingArray", {
					id: this.$route.params.id,
					action: "add",
					path: "reddit",
					value: this.edit
				});
			} else {
				this.$store.commit("guilds/updateSettingArray", {
					id: this.$route.params.id,
					action: "update",
					path: "reddit",
					value: this.edit
				});

				await apiRequest({
					path: `settings/${this.$route.params.id}/reddit/${this.edit.id}`,
					method: "PATCH",
					headers: {
						Authorization: this.authToken
					},
					body: {
						subreddit: this.edit.subreddit,
						feedType: this.edit.type,
						channelId: this.edit.channelId
					}
				});
			}

			this.editModal.hide();
		},
		async deleteSubeddit() {
			this.$store.commit("guilds/updateSettingArray", {
				id: this.$route.params.id,
				action: "delete",
				path: "reddit",
				value: this.edit
			});

			await apiRequest({
				path: `settings/${this.$route.params.id}/reddit/${this.edit.id}`,
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

		this.editModal = new Modal(this.$refs.editSubreddit);
	}
};
</script>

