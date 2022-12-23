<script lang="ts">
	import { page } from '$app/stores';
	import type { IDoc, IFolderFilled } from '$lib/types';
	import DocsList from '$lib/components/document/DocsList.svelte';
	import { path } from '$lib/stores';
	import PathDisplay from '$lib/components/PathDisplay.svelte';
	import type { PageData } from './$types';
	import PermissionsList from '$lib/components/Permissions/PermissionsList.svelte';

	$: id = $page.params.id;

	export let data: PageData;

	$: doc = data.doc;
	$: folder = data.folder;

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
			<PermissionsList bind:doc />
		{/if}
	</div>
	{#if folder}
		<DocsList parentDoc={doc} bind:docs={folder.children} userPermission={data.userPermission} />
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

	.top {
		display: flex;
	}
</style>
