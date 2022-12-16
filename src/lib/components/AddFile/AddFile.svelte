<script lang="ts">
	import { domain } from '$lib/utils';
	import axios from 'axios';
	import { currentFolder, path, user } from '$lib/stores';
	import { slide } from 'svelte/transition';
	import NewFolderMenu from './NewFolderMenu.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import type { IDoc } from '$lib/types';
	import NewFile from './NewFile.svelte';

	export let docs: IDoc[];

	let newFoldername = '';

	let open = false;
	let folderMenuOpen = false;
	let fileMenuOpen = false;

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
				<button class="field" on:click={() => (fileMenuOpen = true)}>
					<span class="material-icons-outlined"> file_upload</span>
					Add File</button
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
{#if fileMenuOpen}
	<NewFile bind:fileMenuOpen bind:progress bind:uploadDone bind:uploading bind:docs />
{/if}
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
