<script lang="ts">
	import { page } from '$app/stores';
	import { domain } from '$lib/utils';
	import { onMount } from 'svelte';
	import { Buffer } from 'buffer';

	const { filename } = $page.params;

	let srcEle: HTMLDivElement;

	let imgTypes = ['jpg', 'jpeg', 'png'];
	let vidTypes = ['mp4', 'mov'];
	let pdfTypes = ['pdf'];

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

	onMount(async () => {
		const chunks: any = [];
		const response = await fetch(domain + 'api/test/' + filename);
		const reader = response.body?.getReader();
		while (true) {
			const { value, done } = await reader!.read();
			if (done) break;
			chunks.push(value);
			console.log('Received', value);
		}
		console.log('Response fully received');

		const buffer = Buffer.concat(chunks);
		const fileType = filename.split('.').pop();
		const blob = new Blob([buffer], { type: fileType });
		const url = URL.createObjectURL(blob);

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

<div class="container" bind:this={srcEle} />

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
