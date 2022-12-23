<script lang="ts">
	import { domain } from '$lib/utils';
	import { onMount } from 'svelte';
	import type { IDoc } from '$lib/types';
	import PathDisplay from '$lib/components/PathDisplay.svelte';
	import { path } from '$lib/stores';
	import FileViewer from '$lib/components/FileViewer.svelte';
	import type { PageData } from './$types';
	import PermissionsList from '$lib/components/Permissions/PermissionsList.svelte';

	export let data: PageData;

	$: doc = data.doc;

	onMount(async () => {
		path.set(doc.path);
	});
</script>

<div class="pageContainer">
	<div class="top">
		<PathDisplay current={doc.name} type={'file'} />
		<a href={domain + 'api/file/' + doc.childId} download={doc.name} class="download"
			><span class="material-icons-outlined"> file_download </span></a
		>
		{#if data.userPermission === 'owner'}
			<PermissionsList bind:doc />
		{/if}
	</div>
	<div class="viewerContainer">
		<FileViewer id={doc.childId} fileType={doc.fileType} />
	</div>
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
		align-items: center;
		padding: 0 1rem;
	}

	.download {
		color: blue;
		border: 2px solid blue;
		padding: calc(0.5rem - 2px);
		border-radius: 5px;
		text-decoration: none;
		margin: 0 1rem;
		height: fit-content;
	}

	.download span {
		display: flex;
	}

	@media (max-width: 600px) {
		.download {
			margin: 0 0.5rem;
		}
		.download span {
			font-size: 20px;
		}
	}
</style>
