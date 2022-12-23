<script lang="ts">
	import { domain } from '$lib/utils';
	import { imgTypes, pdfTypes, vidTypes } from '$lib/utils/files';
	import type { ObjectId } from 'mongodb';
	import { onMount } from 'svelte';
	import { Buffer } from 'buffer';

	export let id: string | ObjectId | undefined;
	export let fileType: string;
	export let width: number = 100;
	export let height: number = 100;

	let containerEle: HTMLDivElement;

	let loading = true;

	const handleVid = (container: HTMLDivElement, url: string) => {
		if (!container) return;
		const vid = document.createElement('video');
		const src = document.createElement('source');
		vid.controls = true;
		src.src = url;
		src.type = 'video/mp4';
		vid.appendChild(src);
		if (!container) return;
		container.appendChild(vid);
	};

	const handleImg = (container: HTMLDivElement, url: string) => {
		if (!container) return;
		const img = document.createElement('img');
		img.src = url;
		container.appendChild(img);
	};

	const handlePdf = (container: HTMLDivElement, url: string) => {
		if (!container) return;
		const ele = document.createElement('object');
		ele.data = url;
		container.appendChild(ele);
	};

	const handleCanvas = (container: HTMLDivElement, chunks: Uint8Array[]) => {
		const buffer = Buffer.concat(chunks);
		if (buffer.length === 0) return;

		const canvasEle = document.createElement('canvas');
		canvasEle.width = width;
		canvasEle.height = height;
		const ctx = canvasEle.getContext('2d');
		ctx?.clearRect(0, 0, canvasEle.width, canvasEle.height);
		ctx?.putImageData(new ImageData(new Uint8ClampedArray(buffer), width), 0, 0);
		container.appendChild(canvasEle);
	};

	const getFile = async () => {
		const chunks = [];
		const response = await fetch(domain + 'api/file/' + id);
		console.log(response);
		const reader = response.body?.getReader();
		while (true) {
			const { value, done } = await reader!.read();
			if (done) break;
			chunks.push(value);
		}
		console.log('Response fully received');
		return chunks;
	};

	onMount(async () => {
		if (!id) return;
		console.log(id);
		const chunks = await getFile();
		if (chunks.length === 0) return;
		const url = processFile(chunks);

		if (!fileType) return;
		if (imgTypes.includes(fileType)) {
			handleImg(containerEle, url);
		} else if (vidTypes.includes(fileType)) {
			handleVid(containerEle, url);
		} else if (pdfTypes.includes(fileType)) {
			handlePdf(containerEle, url);
		} else if (fileType === 'canvas') {
			handleCanvas(containerEle, chunks);
		} else {
			loading = true;
		}
	});

	const processFile = (chunks: any) => {
		const buffer = Buffer.concat(chunks);
		const blob = new Blob([buffer], { type: fileType });
		const url = URL.createObjectURL(blob);
		loading = false;
		return url;
	};
</script>

<div bind:this={containerEle} class="fileContainer">
	{#if loading}
		<img src="/no-preview.png" alt="" />
	{/if}
</div>

<style>
	.fileContainer {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.fileContainer :global(img),
	.fileContainer :global(video),
	.fileContainer :global(canvas),
	.fileContainer :global(object) {
		object-fit: contain;
		width: 100%;
		max-height: 80vh;
		height: 100%;
	}
</style>
