<script lang="ts">
	import type { IDoc } from '$lib/types';
	import DocItem from './DocItem.svelte';
	import AddFile from '$lib/components/AddFile.svelte';

	export let docs: IDoc[];

	let files: IDoc[] = [];
	let folders: IDoc[] = [];

	const separateDocs = (docs: IDoc[]) => {
		//* this runs twice for some reason
		if (docs.length === 0) return;
		files = docs.filter((doc) => doc.type === 'file');
		folders = docs.filter((doc) => doc.type === 'folder');
	};

	$: separateDocs(docs);
</script>

{#if docs.length > 0}
	<div class="list">
		<div class="sublist">
			<p>Folders</p>
			<div class="items">
				{#each folders as doc, i}
					<DocItem {doc} />
				{/each}
			</div>
		</div>
		<div class="sublist">
			<p>Files</p>
			<div class="items">
				{#each files as doc, i}
					<DocItem {doc} />
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div class="noFileMessage">
		<p>No files in this folder</p>
	</div>
{/if}
<AddFile bind:docs />

<style>
	.sublist {
		padding: 1rem 0;

		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.items {
		width: 100%;
		gap: 0.5rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
	}

	.noFileMessage {
		flex: 1 1 auto;

		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
