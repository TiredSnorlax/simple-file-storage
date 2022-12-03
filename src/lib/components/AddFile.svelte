<script lang="ts">
	import { domain } from '$lib/utils';
	import axios from 'axios';
	import { Buffer } from 'buffer';
	import { currentFolder, path, user } from '$lib/stores';
	import { slide } from 'svelte/transition';
	import NewFolderMenu from './me/NewFolderMenu.svelte';
	import ProgressBar from './me/ProgressBar.svelte';
	import type { IDoc } from '$lib/types';

	export let docs: IDoc[];

	let selectedFiles: FileList;
	let newFoldername = '';

	let open = false;
	let folderMenuOpen = false;

	let uploading = false;
	let progress = 0;
	let uploadDone = false;

	const addFolder = async () => {
		folderMenuOpen = false;
		uploading = true;
		// ensure that foldername does not container weird characters
		if (newFoldername.length === 0 || !user) return;
		await axios
			.post(domain + 'api/folder', {
				userId: $user?._id,
				path: $path,
				foldername: newFoldername,
				folderId: $currentFolder._id
			})
			.then((res) => {
				console.log(res.data);
				docs = res.data;
				progress = 100;
				uploadDone = true;
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
					.then((res) => {
						console.log(res.data);
						docs = res.data;
						uploadDone = true;
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
</script>

{#if open}
	<div class="addFileContainer">
		{#if uploading}
			<ProgressBar bind:progress bind:uploading bind:uploadDone />
		{:else}
			<div transition:slide class="revealed">
				<h3>Current Folder: {$currentFolder.foldername}</h3>
				<button class="field" on:click={() => (folderMenuOpen = true)}>
					<span class="material-icons-outlined"> folder</span>
					Add Folder</button
				>
				<input bind:files={selectedFiles} on:change={checkFile} type="file" id="upload" hidden />
				<label class="field" for="upload">
					<span class="material-icons-outlined">file_upload</span>
					Add File</label
				>
				<button class="closeBtn" on:click={() => (open = false)}>Close</button>
			</div>
		{/if}
	</div>
{/if}
<button on:click={() => (open = true)} class="openBtn">
	<span class="material-icons-outlined"> add </span>
	Add</button
>

<NewFolderMenu {folderMenuOpen} bind:newFoldername {addFolder} />

<style>
	button {
		border: none;
		outline: none;
		background: none;
	}

	.addFileContainer,
	.openBtn {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
	}

	.addFileContainer {
		background: white;
		box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.4);
		border-radius: 0.5rem;

		padding: 2rem;
		padding-bottom: 1rem;

		z-index: 100;
	}

	.openBtn {
		--self-bg-color: rgb(110, 110, 255);
		padding: 0.4rem 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;

		background: var(--self-bg-color);
		border-radius: 5rem;
		color: white;
		font-size: 1rem;
		transition: 0.3s;
		cursor: pointer;

		z-index: 50;
	}

	.openBtn span {
		padding: 0.2rem;
		border-radius: 50%;
		background: white;
		color: var(--self-bg-color);
		font-size: 32px;
		transition: 0.3s;
	}

	.openBtn:hover {
		--self-bg-color: blue;
	}

	.revealed {
		background: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		border-radius: 0.5rem;
	}

	.revealed .field {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		width: 120px;
		font-size: 0.9rem;

		cursor: pointer;
	}

	.closeBtn {
		width: fit-content;
		align-self: center;
		color: grey;
	}

	.closeBtn:hover {
		color: red;
	}
</style>
