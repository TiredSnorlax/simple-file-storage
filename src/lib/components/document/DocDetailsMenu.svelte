<script lang="ts">
	import type { IDoc, IFile } from '$lib/types';
	import { domain } from '$lib/utils';
	import axios from 'axios';
	import { onMount } from 'svelte';

	export let detailsMenuOpen: boolean;
	export let doc: IDoc;

	let folderDetails: { totalSize: number; totalFiles: number; totalFolders: number };
	let fileDetails: IFile;

	const getDetails = async () => {
		await axios
			.post(domain + `api/${doc.type}/${doc.childId}/details`)
			.then((res) => {
				console.log(res.data);
				if (doc.type === 'file') fileDetails = res.data;
				else if (doc.type === 'folder') folderDetails = res.data;
			})
			.catch((err) => console.log(err));
	};

	onMount(() => {
		getDetails();
	});
</script>

<div class="bg">
	<div class="menu">
		{#if fileDetails}
			<h3>File details</h3>
			<div>
				<p>Name:</p>
				<p>{fileDetails.filename}</p>
			</div>
			<div>
				<p>Size:</p>
				<p>{fileDetails.length} bytes</p>
			</div>
			<div>
				<p>File type:</p>
				<p>{doc.fileType}</p>
			</div>
		{:else if folderDetails}
			<h3>Folder details</h3>
			<div>
				<p>Name:</p>
				<p>{doc.name}</p>
			</div>
			<div>
				<p>Total Size:</p>
				<p>{folderDetails.totalSize} bytes</p>
			</div>
			<div>
				<p>Children:</p>
				<p>
					{folderDetails.totalFiles + folderDetails.totalFolders} ({folderDetails.totalFiles}
					files, {folderDetails.totalFolders} folders)
				</p>
			</div>
		{/if}
		<button on:click={() => (detailsMenuOpen = false)}>Close</button>
	</div>
</div>

<style>
	button {
		background: none;
		outline: none;
		border: none;
		font-size: 1rem;
		color: grey;
		padding-top: 1rem;

		cursor: pointer;
	}
	.bg {
		position: fixed;
		inset: 0;

		background-color: rgba(0, 0, 0, 0.2);

		display: flex;
		justify-content: center;
		align-items: center;

		z-index: 100;
	}

	.menu {
		padding: 2rem;
		padding-bottom: 1rem;
		background: white;
		border-radius: 0.5rem;

		max-width: 100%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.menu > div {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		max-width: 300px;
	}

	.menu > div p:last-child {
		flex: 1 1 0;
		text-align: end;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
