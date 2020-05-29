<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-12 col-md-10 col-lg-8 mx-auto rounded-lg pt-2 pb-3" id="settings-view">
				<div class="container-fluid px-0" v-if="loaded">
					<div class="row">
						<div class="col-sm-12 col-md-3">
							<button class="navbar-toggler" @click="navHidden = !navHidden">
								<font-awesome-icon :icon="navHidden ? 'chevron-down' : 'chevron-up'"></font-awesome-icon>
							</button>
							<ul class="nav flex-column nav-pills flex-nowrap" id="settings-nav" :class="{ hidden: navHidden }">
								<li class="nav-item text-center" style="color:white;font-size:1.125rem">
									<img v-if="guild.icon" class="rounded-circle mr-2" :src="`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`" style="height:40px;border:1px solid black">
									{{guild.name}}
								</li>
								<div class="container p-0 border-bottom mt-2 mb-3"></div>
								<li class="nav-item">
									<router-link class="nav-link" :class="{ active: $route.name === 'settings.censors' }" :to="{ name: 'settings.censors', params: { id: $route.params.id } }">
										<font-awesome-icon icon="asterisk"></font-awesome-icon>
										Censors
									</router-link>
								</li>
								<li class="nav-item">
									<router-link class="nav-link" :class="{ active: $route.name === 'settings.channels' }" :to="{ name: 'settings.channels', params: { id: $route.params.id } }">
										<font-awesome-icon icon="microphone-alt"></font-awesome-icon>
										Channels
									</router-link>
								</li>
								<li class="nav-item">
									<router-link class="nav-link" :class="{ active: $route.name === 'settings.modlog' }" :to="{ name: 'settings.modlog', params: { id: $route.params.id } }">
										<font-awesome-icon icon="address-card"></font-awesome-icon>
										Mod Log
									</router-link>
								</li>
								<li class="nav-item">
									<router-link class="nav-link" :class="{ active: $route.name === 'settings.music' }" :to="{ name: 'settings.music', params: { id: $route.params.id } }">
										<font-awesome-icon icon="headphones-alt"></font-awesome-icon>
										Music
									</router-link>
								</li>
								<li class="nav-item">
									<router-link class="nav-link" :class="{ active: $route.name === 'settings.permissions' }" :to="{ name: 'settings.permissions', params: { id: $route.params.id } }">
										<font-awesome-icon icon="tasks"></font-awesome-icon>
										Permissions
									</router-link>
								</li>
								<li class="nav-item">
									<router-link class="nav-link" :class="{ active: $route.name === 'settings.prefix' }" :to="{ name: 'settings.prefix', params: { id: $route.params.id } }">
										<font-awesome-icon icon="question"></font-awesome-icon>
										Prefix
									</router-link>
								</li>
								<li class="nav-item">
									<router-link class="nav-link" :class="{ active: $route.name === 'settings.reddit' }" :to="{ name: 'settings.reddit', params: { id: $route.params.id } }">
										<font-awesome-icon :icon="['fab', 'reddit-alien']"></font-awesome-icon>
										Reddit
									</router-link>
								</li>
								<li class="nav-item">
									<router-link class="nav-link" :class="{ active: $route.name === 'settings.roles' }" :to="{ name: 'settings.roles', params: { id: $route.params.id } }">
										<font-awesome-icon icon="user-tag"></font-awesome-icon>
										Roles
									</router-link>
								</li>
								<li class="nav-item">
									<router-link class="nav-link" :class="{ active: $route.name === 'settings.suggestions' }" :to="{ name: 'settings.suggestions', params: { id: $route.params.id } }">
										<font-awesome-icon icon="user-edit"></font-awesome-icon>
										Suggestions
									</router-link>
								</li>
								<li class="nav-item">
									<router-link class="nav-link" :class="{ active: $route.name === 'settings.twitch' }" :to="{ name: 'settings.twitch', params: { id: $route.params.id } }">
										<font-awesome-icon :icon="['fab', 'twitch']"></font-awesome-icon>
										Twitch
									</router-link>
								</li>
							</ul>
						</div>
						<div class="col-md-9 col-sm-12 py-3">
							<div class="row">
								<router-view class="col-lg-6 col-md-9 col-sm-12" id="form-view"></router-view>
							</div>
						</div>
					</div>
				</div>
				<div class="text-center my-5" style="font-size:60px;color:blue" v-else>
					<font-awesome-icon icon="sync-alt" spin></font-awesome-icon>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
const routeHandler = (to, from, next) => {
	if(to.name === "settings") {
		return next({ name: "settings.censors", params: { id: to.params.id } });
	} else {
		return next();
	}
};

export default {
	data() {
		return {
			loaded: false,
			navHidden: true,
			guild: null
		};
	},
	created() {
		this.syncGuild();
	},
	beforeRouteEnter(to, from, next) {
		return routeHandler(to, from, next);
	},
	beforeRouteUpdate(to, from, next) {
		if(to.params.id !== from.params.id) this.syncGuild(to.params.id);
		this.navHidden = true;

		return routeHandler(to, from, next);
	},
	methods: {
		async syncGuild(id = this.$route.params.id) {
			this.loaded = false;
			this.guild = await this.$store.dispatch("guilds/sync", id);
			this.loaded = true;
		}
	}
};
</script>

<style lang="scss" scoped>
@import "node_modules/bootstrap/scss/functions";
@import "node_modules/bootstrap/scss/variables";
@import "node_modules/bootstrap/scss/mixins/_breakpoints";
@import "../variables";

@include media-breakpoint-up(md) {
	.navbar-toggler {
		display: none;
	}
}

@include media-breakpoint-down(sm) {
	.navbar-toggler {
		width: 100%;
		border: 1.5px solid darken($color-secondary, 30);
		color: lighten($color-text, 15);
	}

	#settings-nav {
		&:not(.hidden) {
			margin-top: .75rem;
			max-height: 500px;
			transition: 0.3s ease-out;
		}

		&.hidden {
			margin-top: 0;
			transition: 0.2s ease-in;
			max-height: 0;
			overflow: hidden;
		}
	}
}

#settings-view {
	background: $color-background;
	border: 2px solid darken($color-main, 10);
}

#settings-nav {
	.nav-link {
		color: $color-text;
		transition: .25s ease-in-out;

		&:hover, &.active {
			color: white;
		}

		&.active {
			background: $color-secondary;
		}
	}
}

#form-view {
	/deep/ label {
		color: ligten($color-text, 20);
	}

	/deep/ .form-check {
		padding-left: 0;
	}

	/deep/ small {
		color: darken($color-text, 30);
	}

	/deep/ input, /deep/ textarea, /deep/ select {
		background: $color-main;
		border-color: $color-secondary;
		color: $color-text;
		transition: .5s;
		resize: none;

		&:focus {
			background: $color-secondary;
			border-color: darken($color-secondary, 10);
		}
	}

	/deep/ .card {
		background: darken($color-background, 3);
		border: 1px solid $color-secondary;
		border-radius: .25rem;

		.card-title {
			color: ligten($color-text, 40);
		}

		.card-subtitle {
			color: ligten($color-text, 20);
		}

		.list-group, .card-text {
			color: $color-text;
		}

		.list-group-item {
			background: darken($color-background, 3);
			border-color: $color-secondary;
		}
	}

	/deep/ .btn {
		border: 1px solid darken($color-secondary, 5);
		color: lighten($color-text, 20);

		&:hover {
			background: $color-background;
			color: lighten($color-text, 40);
		}
	}

	/deep/ .modal {
		.modal-content {
			background: $color-background;
			border-color: $color-main;
		}

		.modal-header {
			.close {
				color: lighten($color-text, 20);
				outline: none;
			}
		}

		.modal-header, .modal-footer {
			border-color: $color-secondary;
		}
	}
}
</style>
