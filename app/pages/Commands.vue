<template>
	<div class="row">
		<div class="col-lg-6 col-md-8 col-sm-12 mx-auto">
			<div v-for="(commands, category) in commands" :key="category" class="my-2">
				<h2>{{category.charAt(0).toUpperCase() + category.substring(1)}}</h2>
				<div class="accordion" :id="`${category}-commands`">
					<div class="card" v-for="(command, i) in commands" :key="i">
						<div class="card-header">
							<h2 class="mb-0">
								<button class="btn btn-link" type="button" data-toggle="collapse" :data-target="`#collapse-${command}`" :data-parent="`#${category}-commands`" @click="getCommand(category, command)">
									{{command}}
								</button>
							</h2>
						</div>

						<div :id="`collapse-${command}`" class="collapse">
							<div class="card-body markdown-area">
								<div v-if="commandMarkdown.hasOwnProperty(command)" v-html="commandMarkdown[command]">
								</div>
								<div class="text-center my-3" style="font-size:60px;color:blue" v-else>
									<font-awesome-icon icon="sync-alt" spin></font-awesome-icon>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
import apiRequest from "../apiRequest";
import { Collapse } from "bootstrap.native/dist/bootstrap-native-v4";
import { createNamespacedHelpers } from "vuex";

const { mapState } = createNamespacedHelpers("client");

export default {
	data() {
		return {
			commandMarkdown: {}
		};
	},
	async mounted() {
		await this.$nextTick();

		this.$el.querySelectorAll(`[data-toggle="collapse"]`).forEach(collapse => new Collapse(collapse));
	},
	computed: {
		...mapState(["commands"])
	},
	methods: {
		async getCommand(category, command) {
			if(this.commandMarkdown.hasOwnProperty(command)) return;

			const { body: { file: markdown } } = await apiRequest({
				path: `commands/${category}/${command}`
			});

			this.$set(this.commandMarkdown, command, this.markdownToHTML(markdown));
		},
		markdownToHTML(markdown) {
			markdown = markdown.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#039;");

			const boldReplacer = str => str.replace(
				/(\*\*)(.*?)\1/g,
				(fullMatch, prefix, content) => `<strong class="md-bold">${content}</strong>`
			);

			const italicReplacer = str => str.replace(
				/(\*|_)(.*?)\1/g,
				(fullMatch, prefix, content) => `<em class="md-italic">${content}</em>`
			);

			const quoteReplacer = str => str.replace(
				/(^|\n)(\>|&gt;)(.*)/gm,
				(fullMatch, prefix, arrow, quote) => `<div class="md-quote">${quote}</div>`
			);

			const inlineCodeReplacer = str => str.replace(
				/`(.*?)`/g,
				(fullMatch, code) => `<code class="md-code">${code}</code>`
			);

			const linkReplacer = str => str.replace(
				/(\<|&lt;)?(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s\>]{2,}(?=&gt;)|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s\>]{2,}(?=&gt;)|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s\>]{2,}(?=&gt;)|www\.[a-zA-Z0-9]+\.[^\s\>]{2,}(?=&gt;))(\>|&gt;)?/gm,
				(fullMatch, prefix, link, suffix) => `<a target="_blank" class="md-link" href="${link}">${link}</a>`
			);

			const paragraphReplacer = str => str.replace(
				/\n+(?!<pre>)(?!<h)(?!<ul>)(?!<div class="md-quote")(?!<hr)(?!\t)([^\n]+)\n/g,
				(fullMatch, content) => `<p class="md-paragraph">${content}</p>`
			);

			return paragraphReplacer(quoteReplacer(italicReplacer(boldReplacer(linkReplacer(inlineCodeReplacer(markdown))))));
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../variables";

h2 {
	color: lighten($color-text, 20);
}

.card {
	background: $color-main;
	border: 1px solid darken($color-secondary, 15);

	button {
		color: $color-text;
		transition: .2s ease-in-out;

		&:hover {
			color: lighten($color-text, 15);
		}
	}
}

.card-body {
	background: lighten($color-main, 2);
}

.markdown-area {
	/deep/ .md-bold {
		font-weight: 800;
	}

	/deep/ .md-quote {
		padding-left: .75rem;
		border-left: 4px solid lighten($color-background, 7.5);
	}

	/deep/ .md-code {
		padding: 3px;
		border-radius: 4px;
		color: darken($color-text, 5);
		background: $color-secondary;
	}
}
</style>
