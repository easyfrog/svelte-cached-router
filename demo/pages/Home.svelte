	<div style="height: 100%;background-color: green;">
		<h1>Home ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
		tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
		quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
		consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
		cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
		proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h1>

		<button on:click={() => cnt ++}>pick</button>

		{cnt}
	</div>

<style>
	:global(html), :global(body) {
		margin: 0;
		padding: 0;
		max-width: 100%;
		overflow-x: hidden;
	}
	:global(.om-container) {
		width: 100%;
		height: 100%;
	}
</style>

<script>
	var cnt = 0;

	export function preHide() {
		console.log('home preHide');
	}

	export function preShow() {
		console.log('home preShow');
	}

	export function hidden() {
		console.log('home hidden');
	}

	export function shown() {
		console.log('home shown');
	}

</script>