<script lang="ts">
	import type { IDoc } from '$lib/types';
	import { domain } from '$lib/utils';
	import { Buffer } from 'buffer';
	import { slide } from 'svelte/transition';

	import DocDetailsMenu from './DocDetailsMenu.svelte';
	import DocIcon from './DocIcon.svelte';
	import DocRenameMenu from './DocRenameMenu.svelte';

	export let doc: IDoc;
	export let format: number;
	export let setToDelete: (doc: IDoc) => void;

	let open = false;

	let renameMenuOpen = false;
	let detailsMenuOpen = false;

	let canvasEle: HTMLCanvasElement;

	const loadPreview = async (format: number) => {
		if (!doc || doc.type === 'folder') return;
		if (format !== 0) return;
		const chunks = [];
		const response = await fetch(domain + 'api/file/' + doc.childId + '/preview');
		const reader = response.body?.getReader();
		while (true) {
			const { value, done } = await reader!.read();
			if (done) break;
			chunks.push(value);
		}

		const buffer = Buffer.concat(chunks);

		if (buffer.length === 0) return;

		canvasEle
			.getContext('2d')
			?.putImageData(new ImageData(new Uint8ClampedArray(buffer), 300), 0, 0);
	};

	$: loadPreview(format);
</script>

<div class="item" class:listItem={format === 1}>
	{#if format === 0 && doc.fileType !== 'folder'}
		<canvas bind:this={canvasEle} />
	{/if}
	<div>
		<a href={`${domain}${doc.type}/${doc.childId}`} class="info">
			<DocIcon fileType={doc.fileType} />
			<p>{doc.name}</p>
		</a>
		<button on:click={() => (open = !open)}
			><span class="material-icons-outlined"> more_vert </span></button
		>
		{#if open}
			<div class="popup" transition:slide>
				<button on:click={() => setToDelete(doc)}>Delete</button>
				<button on:click={() => (detailsMenuOpen = true)}>Details</button>
				<button on:click={() => (renameMenuOpen = true)}>Rename</button>
			</div>
		{/if}
	</div>
</div>

{#if renameMenuOpen}
	<DocRenameMenu {doc} bind:renameMenuOpen />
{/if}

{#if detailsMenuOpen}
	<DocDetailsMenu {doc} bind:detailsMenuOpen />
{/if}

<style>
	a {
		color: initial;
		text-decoration: none;
		display: block;
		min-width: 0;
	}

	canvas {
		width: 100%;
		object-fit: contain;

		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
	}

	button {
		background: none;
		border: none;
		outline: none;

		display: block;
	}

	.item {
		border: 1px solid grey;
		border-radius: 0.5rem;

		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;

		position: relative;
	}

	.item.listItem {
		border: none;
		border-top: 1px solid grey;
		border-radius: 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;

		position: relative;
	}

	.item > div {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;

		position: relative;
	}

	.info {
		flex: 1 1 0;
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5rem;
	}

	.info > p {
		flex: 1 1 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.popup {
		position: absolute;
		top: 0;
		right: 2rem;
		z-index: 50;

		width: 120px;

		background: white;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
		padding: 0.5rem 0;
		border-radius: 5px;

		display: flex;
		flex-direction: column;
	}

	.popup button {
		text-align: center;
		font-size: 0.9rem;
		padding: 0.5rem;
		color: rgb(70, 70, 70);
	}

	.popup button:hover {
		background: rgba(0, 0, 0, 0.1);
	}
</style>
