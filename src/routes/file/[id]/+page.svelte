<script lang="ts">
	import { domain } from '$lib/utils';
	import { onMount } from 'svelte';
	import type { IDoc } from '$lib/types';
	import PathDisplay from '$lib/components/PathDisplay.svelte';
	import { path } from '$lib/stores';
	import FileViewer from '$lib/components/FileViewer.svelte';
	import type { PageData } from './$types';
	import PermissionsList from '$lib/components/PermissionsList.svelte';

	export let data: PageData;

	let doc: IDoc = data.doc;

	onMount(async () => {
		path.set(doc.path);
	});
</script>

<div class="pageContainer">
	<div class="top">
		<PathDisplay current={doc.name} type={'file'} />
		{#if data.userPermission === 'owner'}
			<PermissionsList permissions={doc.permissions} isPublic={doc.public} />
		{/if}
	</div>
	<div class="viewerContainer">
		<FileViewer id={doc.childId} fileType={doc.fileType} />
	</div>
	<a href={domain + 'api/file/' + doc.childId} download={doc.name}>Download this file</a>
</div>

<style>
	.pageContainer {
		height: 100%;
		width: 100%;
		padding: 1rem 0;

		display: flex;
		flex-direction: column;
	}

	.viewerContainer {
		flex: 1 1 0;
	}

	.top {
		display: flex;
		padding: 0 1rem;
	}
</style>
