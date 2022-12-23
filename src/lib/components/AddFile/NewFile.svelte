<script lang="ts">
	import { user, path } from '$lib/stores';
	import { Buffer } from 'buffer';
	import axios from 'axios';
	import { domain } from '$lib/utils';
	import type { IDoc } from '$lib/types';
	import { slide } from 'svelte/transition';
	import { imgTypes, pdfTypes, vidTypes } from '$lib/utils/files';
	import * as pdfjsLib from 'pdfjs-dist';

	export let fileMenuOpen: boolean;
	export let progress: number;
	export let uploadDone: boolean;
	export let uploading: boolean;
	export let docs: IDoc[];
	export let parentDoc: IDoc | null;
	export let progressOfItems: {
		current: number;
		total: number;
	};

	let selectedFiles: FileList | null = null;
	let canvasList: (HTMLCanvasElement | null)[] = [];
	let canvasContainerEle: HTMLDivElement;
	let mediaContainerEle: HTMLDivElement;

	let draggedOver = false;

	const previewFiles = (files: FileList | null) => {
		if (!files) return;
		console.log('start preview');
		const fileArray = Array.from(files);
		fileArray.forEach((file) => {
			const container = document.createElement('div');
			const label = document.createElement('p');
			label.innerText = file.name;
			container.appendChild(label);
			const canvasEle = document.createElement('canvas');
			canvasEle.id = file.name;
			const url = URL.createObjectURL(file);

			canvasContainerEle.appendChild(container);

			const fileType = file.type.split('/')[0];
			console.log(file);
			if (fileType === 'image') previewImg(url, canvasEle);
			else if (fileType === 'video') previewVid(url, canvasEle);
			else if (file.type === 'application/pdf') previewPDF(url, canvasEle);
			else {
				const noPreviewImg = document.createElement('img');
				noPreviewImg.src = '/no-preview.png';
				container.appendChild(noPreviewImg);
				return;
			}
			canvasList.push(canvasEle);
			container.appendChild(canvasEle);
		});
	};

	const previewImg = (url: string, canvasEle: HTMLCanvasElement) => {
		const img = new Image();
		img.src = url;
		console.log(url);
		img.onload = () => {
			let ctx = canvasEle.getContext('2d');
			if (!ctx) return;
			let aspectRatio = img.height / img.width;
			canvasEle.width = 250;
			canvasEle.height = 250 * aspectRatio;
			ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvasEle.width, canvasEle.height);
			URL.revokeObjectURL(img.src);
		};
	};

	const previewVid = async (url: string, canvasEle: HTMLCanvasElement) => {
		const vid = document.createElement('video');
		vid.src = url;
		vid.muted = true;
		mediaContainerEle.appendChild(vid);

		vid.addEventListener('loadedmetadata', () => {
			let aspectRatio = vid.videoHeight / vid.videoWidth;
			console.log(aspectRatio);
			canvasEle.width = 250;
			canvasEle.height = 250 * aspectRatio;
			vid.currentTime = 0;
		});

		vid.addEventListener('timeupdate', () => {
			let ctx = canvasEle.getContext('2d');
			if (!ctx) return;
			ctx.drawImage(vid, 0, 0, canvasEle.width, canvasEle.height);
			URL.revokeObjectURL(vid.src);
			mediaContainerEle.removeChild(vid);
		});
	};

	const previewPDF = async (url: string, canvasEle: HTMLCanvasElement) => {
		// @ts-ignore
		const pdfjsWorker = (await import('pdfjs-dist/build/pdf.worker.entry')) as unknown as string;
		pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
		// pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
		const loadingTask = pdfjsLib.getDocument(url);
		const pdf = await loadingTask.promise;

		if (!pdf) return;
		const page = await pdf.getPage(1);
		console.log(page);

		let desiredWidth = 250;
		let viewport = page.getViewport({ scale: 1 });
		let scale = desiredWidth / viewport.width;
		canvasEle.height = (250 * viewport.height) / viewport.width;
		canvasEle.width = 250;
		let scaledViewport = page.getViewport({ scale: scale });

		const ctx = canvasEle.getContext('2d');
		if (!ctx) return;
		const renderContext = {
			canvasContext: ctx,
			viewport: scaledViewport
		};
		page.render(renderContext);
	};

	const addPreview = async (
		filename: string,
		fileId: string,
		folder: IDoc[],
		index: number,
		totalItems: number
	) => {
		const canvasEle = canvasList[index];
		if (!canvasEle) {
			uploadDone = true;
			docs = [...folder];
			fileMenuOpen = false;
			return;
		}
		const ctx = canvasEle.getContext('2d');
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
				if (index === totalItems - 1) {
					uploadDone = true;
					docs = [...folder];
					fileMenuOpen = false;
				}
				// setTimeout(() => {}, 500);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const resetPreivew = () => {
		selectedFiles = null;
		canvasContainerEle.innerHTML = '';
		draggedOver = false;
	};

	const addFile = async () => {
		uploading = true;
		if (!selectedFiles || selectedFiles.length === 0) return;
		const fileArray = Array.from(selectedFiles);
		fileArray.forEach((file, i) => {
			progressOfItems = { current: i + 1, total: fileArray.length };
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
						folderId: parentDoc ? parentDoc.childId : null,
						parentPermissions: parentDoc ? parentDoc.permissions : null
					};

					axios
						.post(domain + 'api/file', data)
						.then(async (res) => {
							console.log(res.data);
							await addPreview(file.name, res.data.newFileId, res.data.folder, i, fileArray.length);
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
		});
	};

	const checkFile = () => {
		console.log(selectedFiles);
		if (selectedFiles && selectedFiles.length > 0) addFile();
	};

	const dropHandler = (event: DragEvent) => {
		event.preventDefault();
		if (!event.dataTransfer) return;
		selectedFiles = event.dataTransfer.files;
	};

	const dragOverHandler = (event: DragEvent) => {
		event.preventDefault();
		draggedOver = true;
	};

	const dragEndHandler = (event: DragEvent) => {
		event.preventDefault();
		console.log('drag leave');
		draggedOver = false;
	};

	$: previewFiles(selectedFiles);
</script>

<!-- svelte-ignore missing-declaration -->
<div class="bg" on:click|self={() => (fileMenuOpen = false)} on:keydown|self={null}>
	<div class="menu" transition:slide>
		<h2>New File</h2>
		<div id="canvasContainer" bind:this={canvasContainerEle} />
		<div id="mediaContainer" bind:this={mediaContainerEle} />
		{#if selectedFiles}
			<!-- <canvas width="250" height="250" bind:this={canvasEle} /> -->
			<button on:click={resetPreivew}>Remove</button>
			<div class="btnContainer">
				<button on:click={checkFile} class="uploadBtn">Upload</button>
			</div>
		{:else}
			<input
				bind:files={selectedFiles}
				type="file"
				id="upload"
				accept={[...imgTypes, ...vidTypes, ...pdfTypes].map((type) => '.' + type).join(',')}
				multiple
				hidden
			/>
			<label class="uploadLabel" for="upload">
				<span class="material-icons-outlined">file_upload</span>
				Add</label
			>
			<p>or</p>
			<div
				class="dropzone"
				class:draggedOver
				on:dragover={dragOverHandler}
				on:drop={dropHandler}
				on:dragleave={dragEndHandler}
			>
				<p>Drag and drop file(s) here</p>
			</div>
		{/if}
	</div>
</div>

<style>
	button {
		border: none;
		outline: none;

		background: none;
	}

	:global(canvas) {
		background: black;
	}

	:global(img) {
		width: 100%;
	}

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

		max-width: 80%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;
		align-items: stretch;
	}

	.menu p {
		text-align: center;
	}

	.uploadLabel {
		padding: 0.5rem;
		background: blue;
		color: white;
		border-radius: 5px;

		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	.btnContainer {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.uploadBtn {
		background: blue;
		color: white;
		padding: 0.5rem;
		border-radius: 5px;
	}

	.dropzone {
		width: 300px;
		height: 300px;

		border: 2px dashed lightskyblue;
		border-radius: 0.5rem;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.dropzone.draggedOver {
		background: rgba(0, 0, 0, 0.2);
	}

	#canvasContainer {
		width: calc(250px + 1rem);
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5rem;
		overflow-x: auto;
	}

	#canvasContainer > :global(div) {
		flex-shrink: none;
		width: 250px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}
	#canvasContainer > :global(*):first-child {
		margin-left: 0.5rem;
	}
	#canvasContainer > :global(*):last-child {
		margin-right: 0.5rem;
	}

	#mediaContainer {
		width: 0;
		height: 0;
		overflow: hidden;
	}
</style>
