<template>
	<nav class="navbar navbar-dark navbar-expand-md" v-scroll-reveal="{ origin: 'left', distance: '25%', duration: 500 }">
		<router-link class="navbar-brand" :to="{ name: 'home' }">
			<img src="../assets/nav-brand.png" height="25px" alt="" />
		</router-link>
		<button class="navbar-toggler" type="button" ref="navbarToggle" data-toggle="collapse" data-target="#navbarCollapse" aria-expanded="false" aria-controls="navbarCollapse">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarCollapse">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item" :class="{ active: $route.name === 'home' }">
					<router-link class="nav-link" :to="{ name: 'home' }">
						<font-awesome-icon icon="home"></font-awesome-icon>
						Home
					</router-link>
				</li>
				<li class="nav-item" :class="{ active: $route.name === 'invite' }">
					<router-link class="nav-link" :to="{ name: 'invite' }">
						<font-awesome-icon icon="user-plus"></font-awesome-icon>
						Invite
					</router-link>
				</li>
				<li class="nav-item" :class="{ active: $route.name === 'support' }">
					<router-link class="nav-link" :to="{ name: 'support' }">
						<font-awesome-icon icon="question-circle"></font-awesome-icon>
						Support
					</router-link>
				</li>
				<li class="nav-item" :class="{ active: $route.name === 'commands' }">
					<router-link class="nav-link" :to="{ name: 'commands' }">
						<font-awesome-icon icon="exclamation-circle"></font-awesome-icon>
						Commands
					</router-link>
				</li>
				<li class="nav-item" :class="{ active: $route.name === 'status' }">
					<router-link class="nav-link" :to="{ name: 'status' }">
						<font-awesome-icon icon="chart-line"></font-awesome-icon>
						Status
					</router-link>
				</li>
			</ul>
			<div class="nav-item" id="account-info">
				<router-link class="btn rounded-lg" role="button" v-if="!loggedIn" :to="{ name: 'login' }">
					<font-awesome-icon icon="sign-in-alt"></font-awesome-icon>
					Login with Discord
				</router-link>
				<div class="dropdown" v-else>
					<button class="btn dropdown-toggle rounded-lg text-small" role="button" ref="accountDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<img :src="accountAvatar" class="rounded-circle mr-1" style="height:30px">
						{{ accountUsername }}
					</button>

					<div class="dropdown-menu dropdown-menu-right">
						<router-link class="dropdown-item" v-for="guild in guilds" :key="guild.id" :to="{ name: 'settings', params: { id: guild.id } }">{{guild.name}}</router-link>
						<div class="dropdown-divider"></div>
						<router-link class="dropdown-item" :to="{ name: 'logout' }">Logout</router-link>
					</div>
				</div>
			</div>
		</div>
	</nav>
</template>

<script>
import Collapse from "bootstrap.native/dist/components/collapse-native.esm";
import { createNamespacedHelpers } from "vuex";
import Dropdown from "bootstrap.native/dist/components/dropdown-native.esm";

const { mapGetters, mapState } = createNamespacedHelpers("account");

export default {
	data() {
		return {
			collapse: null,
			dropdown: null
		};
	},
	async mounted() {
		await this.$nextTick();

		this.collapse = new Collapse(this.$refs.navbarToggle);
		this.dropdown = new Dropdown(this.$refs.accountDropdown);
	},
	computed: {
		...mapGetters({
			accountAvatar: "avatar"
		}),
		...mapState({
			accountUsername: "username",
			loggedIn: state => state.token !== null && state.synced,
			guilds: state => state.guilds.filter(guild => guild.owner || guild.permissions & 32)
		})
	}
};
</script>


<style lang="scss" scoped>
@import "../variables";

nav {
	margin: 2px 20px;
	border-bottom: 4px solid white;
	z-index: 10;
}

nav #navbarCollapse .nav-item {
	& a {
		color: $color-text;

		&:hover {
			color: lighten($color-text, 20);
		}
	}

	&.active a {
		color: lighten($color-text, 30);
	}
}

#account-info {
	.btn {
		background: $color-main;
		color: $color-text;
	}

	.dropdown-menu {
		background: $color-secondary;

		.dropdown-divider {
			border-color: darken($color-text, 15);
		}

		& .dropdown-item {
			color: $color-text;
			transition: 0.1s ease-in-out;

			&:hover {
				background: darken($color-secondary, 5);
			}
		}
	}
}
</style>
