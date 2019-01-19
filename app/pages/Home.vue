<template>
	<div class="container my-4">
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
