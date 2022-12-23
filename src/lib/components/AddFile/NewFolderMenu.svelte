<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { domain } from '$lib/utils';
	import axios from 'axios';
	import { currentFolder, path, user } from '$lib/stores';
	import type { IDoc } from '$lib/types';

	export let folderMenuOpen: boolean;
	export let parentDoc: IDoc | null;
	export let docs: IDoc[];

	export let progress: number;
	export let uploadDone: boolean;
	export let uploading: boolean;

	let newFoldername = '';

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
				folderId: parentDoc ? parentDoc.childId : null,
				parentPermissions: parentDoc ? parentDoc.permissions : null
			})
			.then((res) => {
				console.log(res.data);
				docs = res.data;
				progress = 100;
				uploadDone = true;
				folderMenuOpen = false;
			})
			.catch((err) => {
				console.log(err);
			});
	};
</script>

<div class="bg" transition:fade>
	<div class="menu" transition:slide>
		<h2>New Folder</h2>
		<input type="text" bind:value={newFoldername} />
		<div class="btnContainer">
			<button on:click={() => (folderMenuOpen = false)}>Cancel</button>
			<button on:click={addFolder}>Create</button>
		</div>
	</div>
</div>

<style>
	button {
		background: none;
		outline: none;
		border: none;
	}
	/* Add folder menu */
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

	.menu h2 {
		padding-top: 1rem;
		font-weight: normal;
	}

	.menu input {
		width: 250px;
		outline: none;
		border: 1px solid rgb(200, 200, 200);
		border-radius: 5px;
		padding: 0.5rem;
		font-size: 1rem;

		transition: 0.3s;
	}

	.menu input:hover {
		border-color: grey;
	}

	.menu input:focus {
		border-color: blue;
	}

	.menu .btnContainer {
		display: flex;
		justify-content: flex-end;
		gap: 0.25rem;
	}

	.menu .btnContainer button {
		padding: 0.5rem;
		border-radius: 5px;
		font-size: 0.9rem;
	}

	.menu .btnContainer button:last-child {
		color: blue;
	}

	.menu .btnContainer button:hover {
		background: rgba(0, 0, 0, 0.1);
	}
</style>
