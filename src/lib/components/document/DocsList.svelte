<script lang="ts">
	import type { IDoc } from '$lib/types';
	import DocItem from './DocItem.svelte';
	import AddFile from '$lib/components/AddFile/AddFile.svelte';
	import FolderSlideshow from './FolderSlideshow.svelte';
	import DeleteMenu from './DeleteMenu.svelte';

	export let docs: IDoc[];

	let files: IDoc[] = [];
	let folders: IDoc[] = [];

	let toDelete: IDoc | null = null;

	// 0 - grid, 1 - list
	let format = 0;

	let slideshowOpen = false;

	const separateDocs = (docs: IDoc[]) => {
		//* this runs twice for some reason
		if (docs.length === 0) return;
		files = docs.filter((doc) => doc.type === 'file');
		folders = docs.filter((doc) => doc.type === 'folder');
	};

	const setToDelete = (doc: IDoc) => {
		toDelete = doc;
	};

	$: separateDocs(docs);
</script>

{#if docs.length > 0}
	<div class="list">
		<div class="formatSelector">
			{#if format === 0}
				<button on:click={() => (format = 1)}>
					<span class="material-icons-outlined"> grid_view </span>
				</button>
			{:else}
				<button on:click={() => (format = 0)}>
					<span class="material-icons-outlined"> format_list_bulleted </span>
				</button>
			{/if}
		</div>
		<div class="sublist">
			<p>Folders</p>
			<div class="items" class:list={format === 1}>
				{#each folders as doc, i}
					<DocItem {doc} {format} {setToDelete} />
				{/each}
			</div>
		</div>
		<div class="sublist">
			<p>
				Files <button on:click={() => (slideshowOpen = true)} class="slideshowBtn"
					><span class="material-icons-outlined"> slideshow </span></button
				>
			</p>
			<div class="items" class:list={format === 1}>
				{#each files as doc, i}
					<DocItem {doc} {format} { setToDelete} />
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
<DeleteMenu bind:toDelete bind:docs />
<FolderSlideshow {files} bind:slideshowOpen />

<style>
	.list {
		position: relative;
	}

	button {
		background: none;
		outline: none;
		border: none;
	}
	.formatSelector {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
	.sublist {
		padding: 1rem 0;

		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.sublist p {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.items {
		width: 100%;
		gap: 0.5rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
	}
	.items.list {
		display: flex;
		flex-direction: column;
	}

	.noFileMessage {
		flex: 1 1 auto;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.slideshowBtn {
		display: flex;
		background: none;
		outline: none;
		border: none;
		cursor: pointer;
	}
</style>
