export default Vue => []
	.forEach(file => Vue.component(file.toLowerCase(), () => import(`./${file}.vue`)));
