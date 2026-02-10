<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import DiagramList from './DiagramList.svelte';
	import { diagramState } from '$lib/stores/diagram.svelte';
	import { getNodesBounds, getViewportForBounds, useSvelteFlow } from '@xyflow/svelte';
	import { toPng } from 'html-to-image';
	import { downloadJson, pickAndImportJson } from '$lib/utils/persistence';

	const { getNodes } = useSvelteFlow();

	let diagramList: ReturnType<typeof DiagramList>;
	let exportOpen = $state(false);

	function save() {
		diagramState.save();
	}

	function newDiagram() {
		if (diagramState.isDirty) {
			const confirmed = window.confirm(
				'You have unsaved changes. Create a new diagram anyway?'
			);
			if (!confirmed) return;
		}
		diagramState.newDiagram();
	}

	function exportJson() {
		diagramState.save();
		downloadJson(diagramState.toDiagram());
		exportOpen = false;
	}

	function exportImage() {
		diagramState.save();
		exportOpen = false;

		const viewport = document.querySelector('.svelte-flow__viewport') as HTMLElement | null;
		if (!viewport) return;

		const nodes = getNodes();
		if (nodes.length === 0) return;

		// html-to-image doesn't reliably capture CSS-applied SVG styles,
		// so inline the computed stroke styles on edge paths before capture.
		const edgePaths = viewport.querySelectorAll('.svelte-flow__edge-path');
		const savedStyles: string[] = [];
		edgePaths.forEach((path, i) => {
			const el = path as SVGElement;
			savedStyles[i] = el.style.cssText;
			const computed = getComputedStyle(el);
			el.style.stroke = computed.stroke;
			el.style.strokeWidth = computed.strokeWidth;
		});

		const padding = 50;
		const bounds = getNodesBounds(nodes);
		const imageWidth = bounds.width + padding * 2;
		const imageHeight = bounds.height + padding * 2;
		const vp = getViewportForBounds(bounds, imageWidth, imageHeight, 0.5, 2, padding);

		function restoreStyles() {
			edgePaths.forEach((path, i) => {
				(path as SVGElement).style.cssText = savedStyles[i];
			});
		}

		toPng(viewport, {
			backgroundColor: '#ffffff',
			width: imageWidth,
			height: imageHeight,
			style: {
				width: `${imageWidth}px`,
				height: `${imageHeight}px`,
				transform: `translate(${vp.x}px, ${vp.y}px) scale(${vp.zoom})`
			},
			filter: (node) => {
				if (node instanceof Element) {
					const cls = node.classList;
					if (
						cls?.contains('svelte-flow__minimap') ||
						cls?.contains('svelte-flow__controls') ||
						cls?.contains('svelte-flow__background')
					)
						return false;
				}
				return true;
			}
		})
			.then((dataUrl) => {
				restoreStyles();
				const a = document.createElement('a');
				a.href = dataUrl;
				a.download = `${diagramState.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
				a.click();
			})
			.catch(() => {
				restoreStyles();
			});
	}

	function handleWindowClick(e: MouseEvent) {
		if (!exportOpen) return;
		const target = e.target as HTMLElement;
		if (!target.closest('.export-menu')) {
			exportOpen = false;
		}
	}

	async function importJson() {
		try {
			const diagram = await pickAndImportJson();
			diagramState.importDiagram(diagram);
		} catch (e) {
			if (e instanceof Error && e.message !== 'No file selected') {
				alert(`Import failed: ${e.message}`);
			}
		}
	}

	function onNameInput(e: Event) {
		const target = e.target as HTMLInputElement;
		diagramState.setName(target.value);
	}
</script>

<header class="toolbar flex items-center gap-2 px-4 py-2 border-b border-neutral-200 bg-white">
	<div class="flex items-center gap-2 mr-auto">
		<h1 class="text-sm font-semibold text-neutral-700 whitespace-nowrap">Process Flow</h1>
		<Separator orientation="vertical" class="h-6" />
		<Input
			value={diagramState.name}
			oninput={onNameInput}
			class="w-56 h-8 text-sm"
			placeholder="Diagram name..."
		/>
		{#if diagramState.isDirty}
			<span class="text-xs text-amber-600 font-medium whitespace-nowrap">Unsaved changes</span>
		{/if}
	</div>

	<div class="flex items-center gap-1.5">
		<Button variant="outline" size="sm" onclick={save}>Save</Button>
		<Button variant="outline" size="sm" onclick={() => diagramList.show()}>Open</Button>
		<Button variant="outline" size="sm" onclick={newDiagram}>New</Button>

		<Separator orientation="vertical" class="h-6" />

		<div class="export-menu relative">
			<Button variant="ghost" size="sm" onclick={() => (exportOpen = !exportOpen)}>Export</Button>
			{#if exportOpen}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-md shadow-lg py-1 z-50 min-w-36"
				>
					<button class="export-option" onclick={exportJson}>Export as JSON</button>
					<button class="export-option" onclick={exportImage}>Export as Image</button>
				</div>
			{/if}
		</div>
		<Button variant="ghost" size="sm" onclick={importJson}>Import JSON</Button>
	</div>
</header>

<svelte:window onclick={handleWindowClick} />

<DiagramList bind:this={diagramList} />

<style>
	.export-option {
		display: block;
		width: 100%;
		padding: 6px 12px;
		text-align: left;
		font-size: 13px;
		color: #374151;
		background: none;
		border: none;
		cursor: pointer;
		white-space: nowrap;
	}
	.export-option:hover {
		background: #f3f4f6;
	}
</style>
