<script lang="ts">
	import { domain } from '$lib/utils';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import axios from 'axios';
	import type { IDoc } from '$lib/types';
	import PathDisplay from '$lib/components/PathDisplay.svelte';
	import { path } from '$lib/stores';
	import FileViewer from '$lib/components/FileViewer.svelte';

	let srcEle: HTMLDivElement;
	let doc: IDoc;

	let { id } = $page.params;

	const getDoc = async () => {
		await axios
			.post(domain + 'api/document/child', { childId: id, type: 'file' })
			.then((res) => {
				doc = res.data;
			})
			.catch((err) => {
				console.log(err);
			});
	};

	onMount(async () => {
		await getDoc();
		path.set(doc.path);
	});
</script>

<div class="pageContainer">
	{#if doc}
		<PathDisplay current={doc.name} type={'file'} />
		<div class="viewerContainer">
			<FileViewer id={doc.childId} fileType={doc.fileType} />
		</div>
		<a href={domain + 'api/file/' + doc.childId} download={doc.name}>Download this file</a>
	{/if}
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
</style>
