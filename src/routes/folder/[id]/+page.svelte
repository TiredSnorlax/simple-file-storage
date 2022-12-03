<script lang="ts">
	import { page } from '$app/stores';
	import axios from 'axios';
	import { domain } from '$lib/utils';
	import type { IDoc, IFolder } from '$lib/types';
	import DocsList from '$lib/components/document/DocsList.svelte';
	import { currentFolder, path } from '$lib/stores';
	import PathDisplay from '$lib/components/PathDisplay.svelte';

	$: id = $page.params.id;
	let doc: IDoc;
	let folder: IFolder;

	const getFolder = async () => {
		await axios
			.get(domain + 'api/folder/' + id)
			.then((res) => {
				folder = res.data;
				if (folder) currentFolder.set(folder);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getDocument = async () => {
		await axios
			.post(domain + 'api/document/child', { childId: id, type: 'folder' })
			.then((res) => {
				doc = res.data;
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const setup = async (id: string) => {
		if (!id) return;
		console.log('setup');
		await getDocument();
		await getFolder();
		if (!doc) return;
		path.set(doc.path + folder._id + '/');
	};

	$: setup(id);
</script>

<div class="container">
	<PathDisplay current={doc ? doc.name : ''} type={'folder'} />
	{#if folder}
		<DocsList bind:docs={folder.children} />
	{/if}
</div>

<style>
	.container {
		padding: 1rem;
		width: 100%;
		height: 100%;
		position: relative;

		display: flex;
		flex-direction: column;
	}
</style>
