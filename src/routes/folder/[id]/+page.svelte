<script lang="ts">
	import { page } from '$app/stores';
	import { domain } from '$lib/utils';
	import type { IDoc, IFolder, IFolderFilled } from '$lib/types';
	import DocsList from '$lib/components/document/DocsList.svelte';
	import { currentFolder, path } from '$lib/stores';
	import PathDisplay from '$lib/components/PathDisplay.svelte';
	import type { PageData } from './$types';
	import PermissionsList from '$lib/components/PermissionsList.svelte';

	$: id = $page.params.id;

	export let data: PageData;

	let doc: IDoc = data.doc;
	let folder: IFolderFilled = data.folder;

	const setup = async (id: string) => {
		if (!id) return;
		console.log('setup');
		if (!doc) return;
		path.set(doc.path + folder._id + '/');
	};

	$: setup(id);
</script>

<div class="container">
	<div class="top">
		<PathDisplay current={doc ? doc.name : ''} type={'folder'} />
		{#if data.userPermission === 'owner'}
			<PermissionsList permissions={doc.permissions} bind:isPublic={doc.public} />
		{/if}
	</div>
	{#if folder}
		<DocsList bind:docs={folder.children} userPermission={data.userPermission} />
	{/if}
</div>

<style>
	.container {
		padding: 1rem 0;
		width: 100%;
		height: 100%;
		position: relative;

		display: flex;
		flex-direction: column;
	}

	.top {
		display: flex;
		padding: 0 1rem;
	}
</style>
