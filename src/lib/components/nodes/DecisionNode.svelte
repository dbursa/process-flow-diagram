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
	class="decision-node"
	class:selected
	ondblclick={startEdit}
>
	<Handle type="target" position={Position.Top} />
	<div class="diamond">
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
	</div>
	<Handle type="source" position={Position.Bottom} id="bottom" />
	<Handle type="source" position={Position.Right} id="right" />
</div>

<style>
	.decision-node {
		position: relative;
		width: 140px;
		height: 140px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.diamond {
		width: 100px;
		height: 100px;
		background: #fef3c7;
		border: 2px solid #d97706;
		transform: rotate(45deg);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.decision-node :global(.svelte-flow__handle) {
		z-index: 10;
	}
	.decision-node.selected .diamond {
		border-color: #2563eb;
		box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
	}
	.node-label, .node-edit-input {
		transform: rotate(-45deg);
		font-size: 12px;
		text-align: center;
		max-width: 80px;
		word-wrap: break-word;
	}
	.node-label {
		pointer-events: none;
		user-select: none;
	}
	.node-edit-input {
		width: 80px;
		border: 1px solid #93c5fd;
		border-radius: 3px;
		padding: 2px 4px;
		outline: none;
		background: white;
	}
</style>
