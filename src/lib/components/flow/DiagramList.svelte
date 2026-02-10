<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { listDiagrams, deleteDiagram } from '$lib/utils/persistence';
	import { diagramState } from '$lib/stores/diagram.svelte';

	let open = $state(false);
	let diagrams = $state(listDiagrams());

	export function show() {
		diagrams = listDiagrams();
		open = true;
	}

	function openDiagram(id: string) {
		diagramState.load(id);
		open = false;
	}

	function removeDiagram(id: string, event: MouseEvent) {
		event.stopPropagation();
		deleteDiagram(id);
		diagrams = listDiagrams();
	}

	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleString();
	}
</script>

<DialogPrimitive.Root bind:open>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Saved Diagrams</DialogTitle>
		</DialogHeader>
		<Separator />
		{#if diagrams.length === 0}
			<p class="text-sm text-neutral-500 py-4 text-center">No saved diagrams yet.</p>
		{:else}
			<div class="max-h-80 overflow-y-auto flex flex-col gap-1">
				{#each diagrams as diagram}
					<button
						class="flex items-center justify-between p-3 rounded-md hover:bg-neutral-100 transition-colors text-left w-full"
						onclick={() => openDiagram(diagram.id)}
					>
						<div>
							<div class="text-sm font-medium text-neutral-800">{diagram.name}</div>
							<div class="text-xs text-neutral-500">{formatDate(diagram.updatedAt)}</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							class="text-red-500 hover:text-red-700 hover:bg-red-50"
							onclick={(e) => removeDiagram(diagram.id, e)}
						>
							Delete
						</Button>
					</button>
				{/each}
			</div>
		{/if}
	</DialogContent>
</DialogPrimitive.Root>
