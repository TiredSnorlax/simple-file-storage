<script lang="ts">
	import { domain } from '$lib/utils';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import axios from 'axios';
	import type { IDoc } from '$lib/types';
	import { imgTypes, pdfTypes, vidTypes } from '$lib/utils/files';
	import { Buffer } from 'buffer';
	import PathDisplay from '$lib/components/PathDisplay.svelte';
	import { path } from '$lib/stores';

	let srcEle: HTMLDivElement;
	let doc: IDoc;

	let { id } = $page.params;

	const handleVid = (container: HTMLDivElement, url: string) => {
		const vid = document.createElement('video');
		const src = document.createElement('source');
		vid.controls = true;
		src.src = url;
		src.type = 'video/mp4';
		vid.appendChild(src);
		container.appendChild(vid);
	};

	const handleImg = (container: HTMLDivElement, url: string) => {
		const img = document.createElement('img');
		img.src = url;
		container.appendChild(img);
	};

	const handlePdf = (container: HTMLDivElement, url: string) => {
		const ele = document.createElement('object');
		ele.data = url;
		container.appendChild(ele);
	};

	const getDoc = async () => {
		await axios
			.post(domain + 'api/document/child', { childId: id, type: 'file' })
			.then((res) => {
				doc = res.data;
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getFile = async () => {
		const chunks = [];
		const response = await fetch(domain + 'api/file/' + id);
		const reader = response.body?.getReader();
		while (true) {
			const { value, done } = await reader!.read();
			if (done) break;
			chunks.push(value);
		}
		console.log('Response fully received');

		return chunks;
	};

	const processFile = (chunks: any) => {
		const buffer = Buffer.concat(chunks);
		const fileType = doc.name.split('.').pop()?.toLowerCase();
		const blob = new Blob([buffer], { type: fileType });
		const url = URL.createObjectURL(blob);
		console.log(fileType);
		return { fileType, url };
	};

	onMount(async () => {
		await getDoc();
		path.set(doc.path);
		const chunks = await getFile();
		const { fileType, url } = processFile(chunks);

		if (!fileType) return;
		if (imgTypes.includes(fileType)) {
			handleImg(srcEle, url);
		} else if (vidTypes.includes(fileType)) {
			handleVid(srcEle, url);
		} else if (pdfTypes.includes(fileType)) {
			handlePdf(srcEle, url);
		}
	});
</script>

<div>
	{#if doc}
		<PathDisplay current={doc.name} type={'file'} />
	{/if}
	<div class="container" bind:this={srcEle} />
</div>

<style>
	.container {
		width: 100vw;
		height: 100vh;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.container > :global(*) {
		width: 100%;
		height: auto;
	}

	.container > :global(object) {
		height: 100%;
	}
</style>
