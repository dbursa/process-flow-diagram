<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Process Flow Diagram</title>
</svelte:head>

<div class="h-screen w-screen overflow-hidden flex flex-col">
	{@render children()}
</div>
