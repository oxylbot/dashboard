<template>
	<div class="container">
		<div class="container" style="margin: 5rem 0rem">
			<div class="row my-4">
				<div class="col text-center mb-4" v-scroll-reveal="{ origin: 'top', distance: '50%', duration: 1500, delay: 500 }">
					<img src="../assets/avatar.png" alt="Oxyl Avatar" height="350rem" />
				</div>
			</div>
			<div class="row justify-content-center my-4">
				<div class="col-sm-12 col-md-6 col-lg-3 rounded main py-2 text-center" v-scroll-reveal="{ origin: 'top', distance: '100%', delay: 400 }">
					<p class="lead">Oxyl is a multi-purpose Discord bot with many features spanning from music to moderation.</p>
					<button type="button" class="btn secondary">Add to server</button>
				</div>
			</div>
		</div>
		<div class="container" style="margin: 5rem 0rem" v-scroll-reveal="{ origin: 'left', distance: '25%', duration: 500, delay: 1000 }">
			<div class="row my-4">
				<div class="col text-center mb-4">
					<img src="../assets/avatar.png" alt="Oxyl Avatar" height="350rem" />
				</div>
			</div>
			<div class="row justify-content-center my-4">
				<div class="col-sm-12 col-md-6 col-lg-3 rounded main py-2 text-center">
					<p class="lead">Oxyl is a multi-purpose Discord bot with many features spanning from music to moderation.</p>
					<button type="button" class="btn secondary">Add to server</button>
				</div>
			</div>
		</div>
		<div class="container" style="margin: 5rem 0rem" v-scroll-reveal="{ origin: 'right', distance: '25%', duration: 500, delay: 1000 }">
			<div class="row my-4">
				<div class="col text-center mb-4">
					<img src="../assets/avatar.png" alt="Oxyl Avatar" height="350rem" />
				</div>
			</div>
			<div class="row justify-content-center my-4">
				<div class="col-sm-12 col-md-6 col-lg-3 rounded main py-2 text-center">
					<p class="lead">Oxyl is a multi-purpose Discord bot with many features spanning from music to moderation.</p>
					<button type="button" class="btn secondary">Add to server</button>
				</div>
			</div>
		</div>
		<div class="container" style="margin: 5rem 0rem" v-scroll-reveal="{ origin: 'left', distance: '25%', duration: 500, delay: 1000 }">
			<div class="row my-4">
				<div class="col text-center mb-4">
					<img src="../assets/avatar.png" alt="Oxyl Avatar" height="350rem" />
				</div>
			</div>
			<div class="row justify-content-center my-4">
				<div class="col-sm-12 col-md-6 col-lg-3 rounded main py-2 text-center">
					<p class="lead">Oxyl is a multi-purpose Discord bot with many features spanning from music to moderation.</p>
					<button type="button" class="btn secondary">Add to server</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "../variables";

.main {
	background-color: rgba($color-main, .9);
}

.secondary {
	background-color: $color-secondary;
	color: $color-text;

	&:hover {
		background-color: lighten($color-secondary, 10);
	}
}
</style>
