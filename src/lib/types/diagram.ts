import type { Node, Edge } from '@xyflow/svelte';

export type NodeKind = 'process' | 'decision' | 'startEnd' | 'note';

export interface NodeData {
	label: string;
	kind: NodeKind;
	[key: string]: unknown;
}

export interface DiagramMeta {
	id: string;
	name: string;
	updatedAt: number;
	createdAt: number;
}

export interface Diagram {
	meta: DiagramMeta;
	nodes: Node[];
	edges: Edge[];
}

export const NODE_KIND_LABELS: Record<NodeKind, string> = {
	process: 'Process',
	decision: 'Decision',
	startEnd: 'Start / End',
	note: 'Note'
};

export const NODE_KIND_DESCRIPTIONS: Record<NodeKind, string> = {
	process: 'A rectangular process step',
	decision: 'A diamond decision branch',
	startEnd: 'A rounded terminal node',
	note: 'An annotation sticky note'
};
