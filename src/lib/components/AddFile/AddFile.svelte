<script lang="ts">
	import { slide } from 'svelte/transition';
	import NewFolderMenu from './NewFolderMenu.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import type { IDoc } from '$lib/types';
	import NewFile from './NewFile.svelte';

	export let docs: IDoc[];
	export let parentDoc: IDoc | null;

	let open = false;
	let folderMenuOpen = false;
	let fileMenuOpen = false;

	let uploading = false;
	let progress = 0;
	let uploadDone = false;
	let progressOfItems = { current: 1, total: 1 };

	const openMenu = (option: number) => {
		if (option === 0) {
			folderMenuOpen = true;
			fileMenuOpen = false;
		} else if (option === 1) {
			folderMenuOpen = false;
			fileMenuOpen = true;
		}
	};
</script>

{#if open}
	<div class="addFileContainer">
		{#if uploading}
			<ProgressBar bind:progress bind:uploading bind:uploadDone {progressOfItems} />
		{:else}
			<div transition:slide class="revealed">
				<h3>Current Folder: {parentDoc ? parentDoc.name : 'main'}</h3>
				<button class="field" on:click={() => openMenu(0)}>
					<span class="material-icons-outlined"> folder</span>
					Add Folder</button
				>
				<button class="field" on:click={() => openMenu(1)}>
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
</button>
{#if fileMenuOpen}
	<NewFile
		bind:fileMenuOpen
		bind:progress
		bind:uploadDone
		bind:uploading
		bind:docs
		bind:progressOfItems
		{parentDoc}
	/>
{/if}
{#if folderMenuOpen}
	<NewFolderMenu
		bind:folderMenuOpen
		bind:progress
		bind:uploadDone
		bind:uploading
		bind:docs
		{parentDoc}
	/>
{/if}

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
		padding: 0.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;

		background: var(--self-bg-color);
		border-radius: 5rem;
		font-size: 1rem;
		transition: 0.3s;
		cursor: pointer;

		z-index: 50;
	}

	.openBtn span {
		padding: 0.2rem;
		border-radius: 50%;
		color: white;
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

	@media (max-width: 450px) {
		.addFileContainer {
			left: 0;
			right: 0;
			bottom: 0;
			width: 100%;
			border-radius: 0;
			box-shadow: 0 -1px 3px 0 grey;
		}
	}
</style>
