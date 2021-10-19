
<!-- <Page bind:this={page} color="green" link="/about"> -->
	<h1 style="background-color: red;">About ------ ipsum dolor, sit amet consectetur adipisicing elit. Officiis vero ducimus, eligendi laudantium qui tempore cumque, repellendus saepe, quisquam, sint libero delectus voluptatibus nemo! Aliquid eligendi vero quis corporis necessitatibus.</h1>
<!-- </Page> -->

<script>

	import { onMount } from "svelte";

	// rebuild every time
	export const keepFresh = true;

	onMount(() => {
		console.log('about mount');
	})	

</script>