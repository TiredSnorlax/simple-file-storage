<script lang="ts">
	import { onMount } from 'svelte';
	import { user, currentFolder, path } from '$lib/stores';
	import { Buffer } from 'buffer';
	import axios from 'axios';
	import { domain } from '$lib/utils';
	import type { IDoc, IFolder } from '$lib/types';

	export let fileMenuOpen: boolean;
	export let progress: number;
	export let uploadDone: boolean;
	export let uploading: boolean;
	export let docs: IDoc[];
	// export let checkFile: () => void;
	// export let selectedFiles: FileList;

	let selectedFiles: FileList;
	let canvasEle: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;

	const previewFile = (files: FileList) => {
		if (!files) return;
		const file = files[0];

		console.log('start preview');

		const url = URL.createObjectURL(file);
		const img = new Image();
		img.src = url;
		console.log(url);
		img.onload = () => {
			ctx = canvasEle.getContext('2d');
			if (!ctx) return;
			let aspectRatio = img.height / img.width;
			canvasEle.width = 300;
			canvasEle.height = 300 * aspectRatio;
			// canvas.style.width = resolution + "px";
			// canvas.style.height = resolution * aspectRatio + "px";
			ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvasEle.width, canvasEle.height);
			// ctx.drawImage(img, 0, 0);
			URL.revokeObjectURL(img.src);
		};
	};

	const addPreview = async (filename: string, fileId: string, folder: IDoc[]) => {
		let buffer = Buffer.from(ctx!.getImageData(0, 0, canvasEle.width, canvasEle.height).data);
		let data = {
			buffer,
			filename,
			userId: $user!._id,
			path: $path
		};

		await axios
			.post(domain + 'api/file/' + fileId + '/preview', data)
			.then((res) => {
				console.log(res.data);
				uploadDone = true;
				console.log('frontend preview added', new Date().getTime());
				docs = [...folder];
				// setTimeout(() => {}, 500);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const addFile = async () => {
		uploading = true;
		if (selectedFiles.length === 0) return;
		const file = selectedFiles[0];
		const fileSize = file.size;

		const stream = file.stream();
		const reader = stream.getReader();

		let result: Uint8Array = new Uint8Array();

		let charsReceived = 0;
		reader.read().then(function processFile({ done, value }): any {
			if (done) {
				console.log('finished preparing');
				const buffer = Buffer.from(result);
				let data = {
					buffer,
					filename: file.name,
					userId: $user!._id,
					path: $path,
					folderId: $currentFolder._id
				};

				axios
					.post(domain + 'api/file', data)
					.then(async (res) => {
						console.log(res.data);
						await addPreview(file.name, res.data.newFileId, res.data.folder);
					})
					.catch((err) => console.log(err));

				return;
			}
			charsReceived += value.length;

			const temp = result;
			result = new Uint8Array(temp.length + value.length);
			result.set(temp);
			result.set(value, temp.length);

			console.log(`Received ${Math.floor((charsReceived / fileSize) * 100)}%. `);
			progress = Math.floor((charsReceived / fileSize) * 100);
			return reader.read().then(processFile);
		});
	};

	const checkFile = () => {
		console.log(selectedFiles);
		if (selectedFiles.length > 0) addFile();
	};

	$: previewFile(selectedFiles);
</script>

<!-- svelte-ignore missing-declaration -->
<div class="bg" on:click|self={() => (fileMenuOpen = false)} on:keydown|self={null}>
	<div class="menu">
		{#if selectedFiles}
			<canvas width="300" height="300" bind:this={canvasEle} />
			<button on:click={checkFile}>Upload</button>
		{:else}
			<input bind:files={selectedFiles} type="file" id="upload" hidden />
			<label class="field" for="upload">
				<span class="material-icons-outlined">file_upload</span>
				Add File</label
			>
		{/if}
	</div>
</div>

<style>
	.bg {
		background: rgba(0, 0, 0, 0.2);
		position: fixed;
		inset: 0;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.bg .menu {
		background: white;
		border-radius: 0.5rem;
		padding: 1rem;

		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;
		align-items: stretch;
	}
</style>
