<template>
	<div class="col-lg-12 col-md-12 col-sm-12">
		<div class="row">
			<div class="col-12 mb-4">
				<button type="button" class="btn" @click="addCensor()">
					<font-awesome-icon icon="plus-square" class="mr-1"></font-awesome-icon> Add a censor
				</button>
			</div>
			<div class="col-sm-12 col-lg-6 col-xl-4" v-for="(censor, i) in censors" :key="i">
				<div class="card">
					<div class="card-body">
						<button type="button" class="btn float-right mb-1 ml-1" @click="editCensor(censor)">
							<font-awesome-icon icon="edit"></font-awesome-icon>
						</button>
						<h5 class="card-title">{{censor.name}}</h5>
						<h6 class="card-subtitle mb-2 text-muted">{{censor.description}}</h6>
					</div>
					<ul class="list-group list-group-flush">
						<li class="list-group-item">Regex: {{censor.regex}}</li>
						<li class="list-group-item">Punishment: {{censor.punishment}}</li>
						<li class="list-group-item" v-if="censor.duration">Punishment Duration: {{Math.floor(censor.duration / 1440)}}d {{Math.floor(censor.duration % 1440 / 60)}}h {{Math.floor(censor.duration % 86400 % 60)}}m</li>
						<li class="list-group-item">Whitelisted Roles: {{censor.whitelistedRoles.length ? guild.roles.filter(role => censor.whitelistedRoles.includes(role.id)).map(role => role.name).join(", ") : "none"}}</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="modal fade" tabindex="-1" role="dialog" ref="editCensor" aria-hidden="true">
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
								<label for="censorName">Name</label>
								<input type="text" class="form-control" id="censorName" maxlength="50" placeholder="Censor name" v-model.trim="edit.name">
								<small class="form-text">Name of the censor, used for keeping track of censors.</small>
							</div>
							<div class="form-group">
								<label for="censorDescription">Description</label>
								<textarea class="form-control" id="censorDescription" rows="3" maxlength="250" v-model.trim="edit.description"></textarea>
								<small class="form-text">Description of the censor. Useful to keep notes about how the censor works and what exactly it does.</small>
							</div>
							<div class="form-group">
								<label for="censorPunishment">Punishment</label>
								<select class="form-control" id="censorPunishment" v-model="edit.punishment" :value="edit.punishment || 'delete'">
									<option value="delete">Delete Message</option>
									<option value="warn">Warn</option>
									<option value="mute">Mute</option>
									<option value="kick">Kick</option>
									<option value="softban">Softban</option>
									<option value="ban">Ban</option>
								</select>
								<small class="form-text">What action is taken when the censor is triggered.</small>
							</div>
							<div class="form-group" v-if="['mute', 'ban'].includes(edit.punishment)">
								<label for="punishmentDuration">Punishment Duration</label>
								<duration id="punishmentDuration" :value="edit.duration" v-model.number="edit.duration"></duration>
								<small class="form-text">How long the punishment should last before being removed. 0 to last forever.</small>
							</div>
							<div class="form-group">
								<label for="censorRegex">Regex</label>
								<input type="text" class="form-control" id="censorRegex" maxlength="5000" placeholder="Censor regex" v-model.trim="edit.regex">
								<small class="form-text">Regular expresson for the censor. If you do not know what a regular expression is, you should look it up.</small>
							</div>
							<div class="form-group">
								<label>Whitelisted Roles</label>
								<roleselector :roles="guild.roles" multiple v-model="edit.whitelistedRoles" :value="edit.whitelistedRoles"></roleselector>
								<small class="form-text">What roles should be allowed to bypass the censor.</small>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" @click="saveCensor()">Save</button>
						<button type="button" class="btn btn-danger" @click="deleteCensor()">Delete</button>
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
		censors() {
			return this.guild.settings.censors;
		}
	},
	methods: {
		addCensor() {
			this.edit = {
				id: -1,
				name: "New Censor",
				description: "",
				punishment: "delete",
				duration: null,
				regex: "",
				whitelistedRoles: []
			};

			this.editModal.show();
		},
		editCensor(censor) {
			this.edit = JSON.parse(JSON.stringify(censor));
			this.editModal.show();
		},
		async saveCensor() {
			if(this.edit.id === -1) {
				const { body } = await apiRequest({
					path: `settings/${this.$route.params.id}/censors`,
					method: "POST",
					headers: {
						Authorization: this.authToken
					},
					body: {
						name: this.edit.name,
						description: this.edit.description,
						punishment: this.edit.punishment,
						duration: this.edit.duration,
						regex: this.edit.regex,
						whitelistedRoles: this.edit.whitelistedRoles
					}
				});

				this.edit.id = body.id;
				this.$store.commit("guilds/updateSettingArray", {
					id: this.$route.params.id,
					action: "add",
					path: "censors",
					value: this.edit
				});
			} else {
				this.$store.commit("guilds/updateSettingArray", {
					id: this.$route.params.id,
					action: "update",
					path: "censors",
					value: this.edit
				});

				await apiRequest({
					path: `settings/${this.$route.params.id}/censors/${this.edit.id}`,
					method: "PATCH",
					headers: {
						Authorization: this.authToken
					},
					body: {
						name: this.edit.name,
						description: this.edit.description,
						punishment: this.edit.punishment,
						duration: this.edit.duration,
						regex: this.edit.regex,
						whitelistedRoles: this.edit.whitelistedRoles
					}
				});
			}

			this.editModal.hide();
		},
		async deleteCensor() {
			this.$store.commit("guilds/updateSettingArray", {
				id: this.$route.params.id,
				action: "delete",
				path: "censors",
				value: this.edit
			});

			await apiRequest({
				path: `settings/${this.$route.params.id}/censors/${this.edit.id}`,
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

		this.editModal = new Modal(this.$refs.editCensor);
	}
};
</script>

