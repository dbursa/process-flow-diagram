<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import Toolbar from '$lib/components/flow/Toolbar.svelte';
	import NodePalette from '$lib/components/flow/NodePalette.svelte';
	import FlowCanvas from '$lib/components/flow/FlowCanvas.svelte';
</script>

<SvelteFlowProvider>
	<Toolbar />
	<div class="flex flex-1 overflow-hidden">
		<NodePalette />
		<FlowCanvas />
	</div>
</SvelteFlowProvider>
