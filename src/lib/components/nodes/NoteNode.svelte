<script lang="ts">
	import { useSvelteFlow, type NodeProps } from '@xyflow/svelte';
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
		if (e.key === 'Enter' && !e.shiftKey) commitEdit();
		if (e.key === 'Escape') editing = false;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="note-node"
	class:selected
	ondblclick={startEdit}
>
	{#if editing}
		<!-- svelte-ignore a11y_autofocus -->
		<textarea
			class="node-edit-textarea"
			bind:value={editValue}
			onblur={commitEdit}
			onkeydown={onKeydown}
			autofocus
			rows="3"
		></textarea>
	{:else}
		<div class="node-label">{(data as NodeData).label}</div>
	{/if}
</div>

<style>
	.note-node {
		padding: 10px 14px;
		border: 1px solid #e5e7eb;
		border-left: 4px solid #a78bfa;
		border-radius: 4px;
		background: #fefce8;
		min-width: 100px;
		max-width: 200px;
		font-size: 12px;
		box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.08);
	}
	.note-node.selected {
		border-color: #2563eb;
		border-left-color: #2563eb;
		box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
	}
	.node-label {
		pointer-events: none;
		user-select: none;
		white-space: pre-wrap;
	}
	.node-edit-textarea {
		width: 100%;
		border: 1px solid #93c5fd;
		border-radius: 3px;
		padding: 4px;
		font-size: 12px;
		outline: none;
		resize: vertical;
		background: white;
		font-family: inherit;
	}
</style>
