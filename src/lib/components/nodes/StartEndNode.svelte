<script lang="ts">
	import { Handle, Position, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
	import type { NodeData } from '$lib/types/diagram';
	import { diagramState } from '$lib/stores/diagram.svelte';

	let { id, data, selected }: NodeProps = $props();

	const { updateNodeData } = useSvelteFlow();

	let editing = $state(false);
	let editValue = $state('');

	function startEdit() {
		editValue = (data as NodeData).label;
		editing = true;
	}

	function commitEdit() {
		if (editValue.trim()) {
			updateNodeData(id, { label: editValue.trim() });
			diagramState.markDirty();
		}
		editing = false;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') commitEdit();
		if (e.key === 'Escape') editing = false;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="start-end-node"
	class:selected
	ondblclick={startEdit}
>
	<Handle type="target" position={Position.Top} />
	{#if editing}
		<!-- svelte-ignore a11y_autofocus -->
		<input
			class="node-edit-input"
			bind:value={editValue}
			onblur={commitEdit}
			onkeydown={onKeydown}
			autofocus
		/>
	{:else}
		<div class="node-label">{(data as NodeData).label}</div>
	{/if}
	<Handle type="source" position={Position.Bottom} />
</div>

<style>
	.start-end-node {
		padding: 10px 24px;
		border: 2px solid #16a34a;
		border-radius: 9999px;
		background: #f0fdf4;
		min-width: 100px;
		text-align: center;
		font-size: 13px;
	}
	.start-end-node.selected {
		border-color: #2563eb;
		box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
	}
	.node-label {
		pointer-events: none;
		user-select: none;
	}
	.node-edit-input {
		width: 100%;
		border: 1px solid #93c5fd;
		border-radius: 3px;
		padding: 2px 4px;
		font-size: 13px;
		text-align: center;
		outline: none;
		background: white;
	}
</style>
