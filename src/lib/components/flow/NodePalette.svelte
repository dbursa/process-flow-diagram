<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { NODE_KIND_LABELS, NODE_KIND_DESCRIPTIONS, type NodeKind } from '$lib/types/diagram';

	const nodeKinds: NodeKind[] = ['startEnd', 'process', 'decision', 'note'];

	const nodeIcons: Record<NodeKind, string> = {
		process: '[ ]',
		decision: '<>',
		startEnd: '( )',
		note: '#'
	};

	const nodeColors: Record<NodeKind, string> = {
		process: 'border-l-slate-700',
		decision: 'border-l-amber-500',
		startEnd: 'border-l-green-600',
		note: 'border-l-violet-400'
	};

	function ondragstart(event: DragEvent, kind: NodeKind) {
		if (!event.dataTransfer) return;
		event.dataTransfer.setData('application/node-kind', kind);
		event.dataTransfer.effectAllowed = 'move';
	}
</script>

<aside class="node-palette flex flex-col border-r border-neutral-200 bg-neutral-50 w-52 p-3 gap-3">
	<h2 class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Nodes</h2>
	<Separator />
	<div class="flex flex-col gap-2">
		{#each nodeKinds as kind}
			<div
				role="button"
				tabindex="0"
				draggable="true"
				ondragstart={(e) => ondragstart(e, kind)}
				class="cursor-grab active:cursor-grabbing"
			>
				<Card
					class="p-3 hover:bg-neutral-100 transition-colors border-l-4 {nodeColors[kind]}"
				>
					<div class="flex items-center gap-2">
						<span class="font-mono text-xs text-neutral-400 w-6 text-center">{nodeIcons[kind]}</span>
						<div>
							<div class="text-sm font-medium text-neutral-800">{NODE_KIND_LABELS[kind]}</div>
							<div class="text-xs text-neutral-500">{NODE_KIND_DESCRIPTIONS[kind]}</div>
						</div>
					</div>
				</Card>
			</div>
		{/each}
	</div>
	<Separator />
	<p class="text-xs text-neutral-400 leading-relaxed">
		Drag a node onto the canvas. Double-click a node to edit its label.
	</p>
</aside>
