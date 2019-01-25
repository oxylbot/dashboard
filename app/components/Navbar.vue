<template>
	<nav class="navbar navbar-dark navbar-expand-md" v-scroll-reveal="{ origin: 'left', distance: '25%', duration: 500 }">
		<router-link class="navbar-brand" :to="{ name: 'home' }">
			<img src="../assets/nav-brand.png" height="25px" alt="" />
		</router-link>
		<button class="navbar-toggler" type="button" id="collapse-toggler" data-toggle="collapse" data-target="#navbarCollapse" aria-expanded="false" aria-controls="navbarCollapse">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarCollapse">
			<ul class="navbar-nav">
				<li class="nav-item" :class="{ active: $route.name === 'home' }">
					<router-link class="nav-link" :to="{ name: 'home' }">
						<font-awesome-icon icon="home" />
						Home
					</router-link>
				</li>
				<li class="nav-item" :class="{ active: $route.name === 'invite' }">
					<router-link class="nav-link" :to="{ name: 'invite' }">
						<font-awesome-icon icon="user-plus" />
						Invite
					</router-link>
				</li>
				<li class="nav-item" :class="{ active: $route.name === 'support' }">
					<router-link class="nav-link" :to="{ name: 'support' }">
						<font-awesome-icon icon="question-circle" />
						Support
					</router-link>
				</li>
				<li class="nav-item" :class="{ active: $route.name === 'commands' }">
					<router-link class="nav-link" :to="{ name: 'commands' }">
						<font-awesome-icon icon="exclamation-circle" />
						Commands
					</router-link>
				</li>
				<li class="nav-item" :class="{ active: $route.name === 'dashboard' }">
					<router-link class="nav-link" :to="{ name: 'dashboard' }">
						<font-awesome-icon icon="cogs" />
						Dashboard
					</router-link>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script>
import { Collapse } from "bootstrap.native/dist/bootstrap-native-v4";

export default {
	data() {
		return {
			collapse: null
		};
	},
	async mounted() {
		await this.$nextTick();

		this.collapse = new Collapse(this.$el.querySelector("#collapse-toggler"));
	}
};
</script>


<style lang="scss" scoped>
@import "../variables";

nav {
	margin: 2px 20px;
	border-bottom: 4px solid white;
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
</style>
