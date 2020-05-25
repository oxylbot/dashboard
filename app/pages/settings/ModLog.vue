<template>
	<div class="col-lg-12 col-md-12 col-sm-12">
		<div class="row">
			<form class="col-lg-6 col-md-9 col-sm-12">
				<div class="form-group custom-control custom-switch">
					<input type="checkbox" class="custom-control-input" id="modlogEnabled" v-model="enabled">
					<label class="custom-control-label" for="modlogEnabled">Enable Mod Log</label>
					<small class="form-text">Whether or not to enable the mod log.</small>
				</div>
				<div class="form-group">
					<label>Mod Log Channel</label>
					<channelselector :channels="guild.channels" filter="text" v-model="channel"></channelselector>
					<small class="form-text">What channel to send the mod log messages in.</small>
				</div>
				<div class="form-group">
					<label for="warningDuration">Warning Duration</label>
					<duration id="warningDuration" v-model="warningDuration"></duration>
					<small class="form-text">How long a warning should last once given out before it expires. 0 to last forever.</small>
				</div>
			</form>
		</div>
		<div class="row">
			<div class="col-12 mb-4">
				<button type="button" class="btn" @click="addThreshold()">
					<font-awesome-icon icon="plus-square" class="mr-1"></font-awesome-icon>
					Add a warning threshold
				</button>
			</div>
			<div class="col-sm-12 col-lg-6 col-xl-4" v-for="(threshold, i) in thresholds" :key="i">
				<div class="card">
					<div class="card-body">
						<button type="button" class="btn float-right mb-1 ml-1" @click="editThreshold(threshold)">
							<font-awesome-icon icon="edit"></font-awesome-icon>
						</button>
						<h5 class="card-title">{{threshold.trigger}} warns</h5>
					</div>
					<ul class="list-group list-group-flush">
						<li class="list-group-item">Punishment: {{threshold.punishment}}</li>
						<li class="list-group-item" v-if="threshold.duration">Punishment Duration: {{Math.floor(threshold.duration / 1440)}}d {{Math.floor(threshold.duration % 1440 / 60)}}h {{Math.floor(threshold.duration % 86400 % 60)}}m</li>
						<li class="list-group-item">Whitelisted Roles: {{threshold.whitelistedRoles.length ? guild.roles.filter(role => threshold.whitelistedRoles.includes(role.id)).map(role => role.name).join(", ") : "none"}}</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="modal" tabindex="-1" role="dialog" ref="editThreshold" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-body">
						<form>
							<div class="form-group">
								<label for="thresholdTrigger">Trigger</label>
								<input class="form-control" type="number" min="1" max="999" v-model.number="edit.trigger" placeholder="1">
								<small class="form-text">How many warns needed in order to trigger this threshold.</small>
							</div>
							<div class="form-group">
								<label for="thresholdPunishment">Punishment</label>
								<select class="form-control" id="thresholdPunishment" v-model="edit.punishment" :value="edit.punishment || 'mute'">
									<option value="mute">Mute</option>
									<option value="kick">Kick</option>
									<option value="softban">Softban</option>
									<option value="ban">Ban</option>
								</select>
								<small class="form-text">What action is taken once the threshold is reached.</small>
							</div>
							<div class="form-group" v-if="['mute', 'ban'].includes(edit.punishment)">
								<label for="punishmentDuration">Punishment Duration</label>
								<duration id="punishmentDuration" :value="edit.duration" v-model.number="edit.duration"></duration>
								<small class="form-text">How long the punishment should last before being removed. 0 to last forever.</small>
							</div>
							<div class="form-group">
								<label>Whitelisted Roles</label>
								<roleselector :roles="guild.roles" multiple v-model="edit.whitelistedRoles" :value="edit.whitelistedRoles"></roleselector>
								<small class="form-text">Roles that are allowed to bypass the threshold.</small>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" @click="saveThreshold()">Save</button>
						<button type="button" class="btn btn-danger" @click="deleteThreshold()">Delete</button>
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
		enabled: {
			get() {
				return this.guild.settings.modlog.enabled;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "modlog.enabled",
					value
				});

				await this.saveSettings();
			}
		},
		channel: {
			get() {
				return this.guild.settings.modlog.channel;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "modlog.channel",
					value
				});

				await this.saveSettings();
			}
		},
		warningDuration: {
			get() {
				return this.guild.settings.modlog.warningDuration;
			},
			async set(value) {
				this.$store.commit("guilds/updateSetting", {
					id: this.$route.params.id,
					path: "modlog.warningDuration",
					value
				});

				await this.saveSettings();
			}
		},
		thresholds() {
			return this.guild.settings.modlog.thresholds;
		}
	},
	methods: {
		addThreshold() {
			this.edit = {
				id: -1,
				trigger: null,
				punishment: "mute",
				duration: 0,
				whitelistedRoles: []
			};

			this.editModal.show();
		},
		editThreshold(threshold) {
			this.edit = JSON.parse(JSON.stringify(threshold));
			this.editModal.show();
		},
		async saveThreshold() {
			if(this.edit.id === -1) {
				const { body } = await apiRequest({
					path: `settings/${this.$route.params.id}/mod-log/thresholds`,
					method: "POST",
					headers: {
						Authorization: this.authToken
					},
					body: {
						trigger: this.edit.trigger,
						punishment: this.edit.punishment,
						duration: this.edit.duration,
						whitelistedRoles: this.edit.whitelistedRoles
					}
				});

				this.edit.id = body.id;
				this.thresholds.push(this.edit);
			} else {
				await apiRequest({
					path: `settings/${this.$route.params.id}/mod-log/thresholds/${this.edit.id}`,
					method: "PATCH",
					headers: {
						Authorization: this.authToken
					},
					body: {
						trigger: this.edit.trigger,
						punishment: this.edit.punishment,
						duration: this.edit.duration,
						whitelistedRoles: this.edit.whitelistedRoles
					}
				});

				this.thresholds.splice(this.thresholds.findIndex(threshold => threshold.id === this.edit.id), 1, this.edit);
			}

			this.editModal.hide();
		},
		async deleteThreshold() {
			if(this.edit.id !== -1) {
				await apiRequest({
					path: `settings/${this.$route.params.id}/mod-log/thresholds/${this.edit.id}`,
					method: "DELETE",
					headers: {
						Authorization: this.authToken
					}
				});

				this.thresholds.splice(this.thresholds.findIndex(threshold => threshold.id === this.edit.id), 1);
			}
			this.editModal.hide();
		},
		async saveSettings() {
			await apiRequest({
				path: `settings/${this.$route.params.id}/mod-log/`,
				method: "PUT",
				headers: {
					Authorization: this.authToken
				},
				body: {
					enabled: this.enabled,
					channelId: this.channel,
					warningDuration: this.warningDuration
				}
			});
		}
	},
	async mounted() {
		await this.$nextTick();

		this.editModal = new Modal(this.$refs.editThreshold);
	}
};
</script>
