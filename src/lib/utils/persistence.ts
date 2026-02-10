import type { Diagram, DiagramMeta } from '$lib/types/diagram';

const PREFIX = 'pfd:diagram:';
const INDEX_KEY = 'pfd:index';

function getIndex(): DiagramMeta[] {
	try {
		const raw = localStorage.getItem(INDEX_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function setIndex(index: DiagramMeta[]): void {
	localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

export function listDiagrams(): DiagramMeta[] {
	return getIndex().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveDiagram(diagram: Diagram): void {
	diagram.meta.updatedAt = Date.now();
	localStorage.setItem(PREFIX + diagram.meta.id, JSON.stringify(diagram));

	const index = getIndex();
	const existing = index.findIndex((m) => m.id === diagram.meta.id);
	if (existing >= 0) {
		index[existing] = diagram.meta;
	} else {
		index.push(diagram.meta);
	}
	setIndex(index);
}

export function loadDiagram(id: string): Diagram | null {
	try {
		const raw = localStorage.getItem(PREFIX + id);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export function deleteDiagram(id: string): void {
	localStorage.removeItem(PREFIX + id);
	const index = getIndex().filter((m) => m.id !== id);
	setIndex(index);
}

export function exportDiagramToJson(diagram: Diagram): string {
	return JSON.stringify(diagram, null, 2);
}

export function importDiagramFromJson(json: string): Diagram {
	const parsed = JSON.parse(json);
	if (!parsed.meta || !parsed.nodes || !parsed.edges) {
		throw new Error('Invalid diagram format');
	}
	return parsed as Diagram;
}

export function downloadJson(diagram: Diagram): void {
	const json = exportDiagramToJson(diagram);
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `${diagram.meta.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
	a.click();
	URL.revokeObjectURL(url);
}

export function pickAndImportJson(): Promise<Diagram> {
	return new Promise((resolve, reject) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return reject(new Error('No file selected'));
			try {
				const text = await file.text();
				resolve(importDiagramFromJson(text));
			} catch (e) {
				reject(e);
			}
		};
		input.click();
	});
}
