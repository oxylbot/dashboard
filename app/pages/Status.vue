<template>
	<div class="container">
		<div class="container-fluid clearfix">
			<h2 class="float-left">Pods</h2>
			<button class="float-right btn">
				<font-awesome-icon icon="sync-alt"></font-awesome-icon>
			</button>
		</div>
		<table class="table table-sm table-responsive-sm rounded">
			<thead>
				<tr>
					<th scope="col"></th>
					<th scope="col">Name</th>
					<th scope="col">Node</th>
					<th scope="col">Restarts</th>
					<th scope="col">Age</th>
					<th scope="col">CPU</th>
					<th scope="col">Memory</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="pod of pods" :key="pod.name">
					<td style="width:25px">
						<div class="d-flex rounded-circle justify-content-center align-items-center" style="height:25px;width:25px" :style="{ 'background-color': colors[pod.status] }">
							<font-awesome-icon :icon="icons[pod.status]"></font-awesome-icon>
						</div>
					</td>
					<td>{{pod.name}}</td>
					<td>{{pod.node}}</td>
					<td>{{pod.restarts}}</td>
					<td>{{Math.floor(pod.age / 1440)}}d {{Math.floor(pod.age % 1440 / 60)}}h {{Math.floor(pod.age % 86400 % 60)}}m</td>
					<td>{{pod.cpu}}%</td>
					<td>{{(pod.memory / 1024 / 1024).toFixed(3)}}MiB</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			icons: { Pending: "sync-alt", Running: "check", Succeeded: "thumbs-up", Failed: "times", Unknown: "question" },
			colors: { Pending: "blue", Running: "green", Succeeded: "orange", Failed: "red", Unknown: "grey" },
			pods: [{
				name: "gateway-afku948f",
				status: "Running",
				node: "neptune",
				restarts: 1,
				age: 49135,
				cpu: 28.13,
				memory: 39814210
			}]
		};
	}
};
</script>

<style lang="scss" scoped>
@import "../variables";

table {
	background: $color-main;
	color: $color-text;
}

.btn {
	color: lighten($color-text, 20);
}
</style>
