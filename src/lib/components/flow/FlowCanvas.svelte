<script lang="ts">
	import {
		SvelteFlow,
		Controls,
		MiniMap,
		Background,
		BackgroundVariant,
		MarkerType,
		useSvelteFlow,
		type Node,
		type Edge,
		type Connection
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import '../../../styles/flow.css';

	import ProcessNode from '$lib/components/nodes/ProcessNode.svelte';
	import DecisionNode from '$lib/components/nodes/DecisionNode.svelte';
	import StartEndNode from '$lib/components/nodes/StartEndNode.svelte';
	import NoteNode from '$lib/components/nodes/NoteNode.svelte';
	import { diagramState } from '$lib/stores/diagram.svelte';
	import { generateId } from '$lib/utils/id';
	import type { NodeKind, NodeData } from '$lib/types/diagram';

	const nodeTypes = {
		process: ProcessNode,
		decision: DecisionNode,
		startEnd: StartEndNode,
		note: NoteNode
	};

	const { screenToFlowPosition } = useSvelteFlow();

	const defaultLabels: Record<NodeKind, string> = {
		process: 'Process',
		decision: 'Decision?',
		startEnd: 'Start',
		note: 'Note...'
	};

	function onconnect(connection: Connection) {
		const edge: Edge = {
			id: `e-${generateId()}`,
			source: connection.source,
			target: connection.target,
			sourceHandle: connection.sourceHandle,
			targetHandle: connection.targetHandle,
			type: 'smoothstep'
		};
		diagramState.edges = [...diagramState.edges, edge];
		diagramState.markDirty();
	}

	function ondelete({ nodes: deletedNodes, edges: deletedEdges }: { nodes: Node[]; edges: Edge[] }) {
		const deletedNodeIds = new Set(deletedNodes.map((n) => n.id));
		const deletedEdgeIds = new Set(deletedEdges.map((e) => e.id));

		diagramState.nodes = diagramState.nodes.filter((n) => !deletedNodeIds.has(n.id));
		diagramState.edges = diagramState.edges.filter((e) => !deletedEdgeIds.has(e.id));
		diagramState.markDirty();
	}

	function ondragover(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}

	function ondrop(event: DragEvent) {
		event.preventDefault();
		const kind = event.dataTransfer?.getData('application/node-kind') as NodeKind | undefined;
		if (!kind) return;

		const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

		const newNode: Node = {
			id: `n-${generateId()}`,
			type: kind,
			position,
			data: { label: defaultLabels[kind], kind } satisfies NodeData
		};

		diagramState.nodes = [...diagramState.nodes, newNode];
		diagramState.markDirty();
	}

	// Mark dirty on any node drag
	function onnodedragstop() {
		diagramState.markDirty();
	}

</script>

<div class="flow-canvas" role="application" ondragover={ondragover} ondrop={ondrop}>
	<SvelteFlow
		bind:nodes={diagramState.nodes}
		bind:edges={diagramState.edges}
		{nodeTypes}
		{onconnect}
		{ondelete}
		{onnodedragstop}
		fitView
		defaultEdgeOptions={{ type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' } }}
		class="flow-container"
	>
		<Controls />
		<MiniMap />
		<Background variant={BackgroundVariant.Dots} />
	</SvelteFlow>
</div>

<style>
	.flow-canvas {
		flex: 1;
		height: 100%;
	}
	.flow-canvas :global(.flow-container) {
		width: 100%;
		height: 100%;
	}
</style>
