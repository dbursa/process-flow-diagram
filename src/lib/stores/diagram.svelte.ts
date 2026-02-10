import type { Node, Edge } from '@xyflow/svelte';
import type { Diagram } from '$lib/types/diagram';
import { generateId } from '$lib/utils/id';
import { saveDiagram, loadDiagram } from '$lib/utils/persistence';

function createNewDiagram(): Diagram {
	const now = Date.now();
	return {
		meta: {
			id: generateId(),
			name: 'Untitled Diagram',
			createdAt: now,
			updatedAt: now
		},
		nodes: [],
		edges: []
	};
}

class DiagramState {
	id = $state<string>('');
	name = $state<string>('Untitled Diagram');
	nodes = $state<Node[]>([]);
	edges = $state<Edge[]>([]);
	createdAt = $state<number>(Date.now());
	updatedAt = $state<number>(Date.now());
	isDirty = $state<boolean>(false);

	// Incremented on load/new/import to signal FlowCanvas to reset
	version = $state<number>(0);

	constructor() {
		const diagram = createNewDiagram();
		this.applyDiagram(diagram);
	}

	private applyDiagram(diagram: Diagram) {
		this.id = diagram.meta.id;
		this.name = diagram.meta.name;
		this.nodes = diagram.nodes;
		this.edges = diagram.edges;
		this.createdAt = diagram.meta.createdAt;
		this.updatedAt = diagram.meta.updatedAt;
		this.isDirty = false;
		this.version++;
	}

	toDiagram(): Diagram {
		return {
			meta: {
				id: this.id,
				name: this.name,
				createdAt: this.createdAt,
				updatedAt: this.updatedAt
			},
			nodes: this.nodes,
			edges: this.edges
		};
	}

	markDirty() {
		this.isDirty = true;
	}

	setName(name: string) {
		this.name = name;
		this.isDirty = true;
	}

	save() {
		saveDiagram(this.toDiagram());
		this.isDirty = false;
	}

	load(id: string): boolean {
		const diagram = loadDiagram(id);
		if (!diagram) return false;
		this.applyDiagram(diagram);
		return true;
	}

	newDiagram() {
		this.applyDiagram(createNewDiagram());
	}

	importDiagram(diagram: Diagram) {
		diagram.meta.id = generateId();
		diagram.meta.createdAt = Date.now();
		diagram.meta.updatedAt = Date.now();
		this.applyDiagram(diagram);
		this.isDirty = true;
	}
}

export const diagramState = new DiagramState();
