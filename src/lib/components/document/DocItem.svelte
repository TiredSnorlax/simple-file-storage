<script lang="ts">
	import type { IDoc } from '$lib/types';
	import { domain } from '$lib/utils';
	import { Buffer } from 'buffer';
	import { onMount } from 'svelte';
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

	let hasPreview = true;

	let canvasEle: HTMLCanvasElement;

	const loadPreview = async (format: number, doc: IDoc, canvasEle: HTMLCanvasElement) => {
		if (!doc || doc.type === 'folder') return;
		if (format !== 0 || !canvasEle) return;
		const chunks = [];
		const response = await fetch(domain + 'api/file/' + doc.childId + '/preview');
		if (response.status === 400) {
			canvasEle.style.display = 'none';
			hasPreview = false;
			return;
		}
		const reader = response.body?.getReader();
		while (true) {
			const { value, done } = await reader!.read();
			if (done) break;
			chunks.push(value);
		}

		const buffer = Buffer.concat(chunks);

		if (buffer.length === 0) return;

		const ctx = canvasEle.getContext('2d');
		ctx?.clearRect(0, 0, canvasEle.width, canvasEle.height);
		const imgData = new ImageData(new Uint8ClampedArray(buffer), 250);
		canvasEle.width = imgData.width;
		canvasEle.height = imgData.height;
		ctx?.putImageData(imgData, 0, 0);
	};

	$: loadPreview(format, doc, canvasEle);

	// onMount(() => {
	// 	loadPreview(format, doc);
	// });
</script>

<div class="item" class:listItem={format === 1}>
	{#if format === 0 && doc.fileType !== 'folder'}
		<canvas width="250" bind:this={canvasEle} />
		{#if !hasPreview}
			<img src="/no-preview.png" alt="" />
		{/if}
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

	img,
	canvas {
		width: 100%;
		height: 100%;
		object-fit: cover;

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
		max-height: 250px;
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
