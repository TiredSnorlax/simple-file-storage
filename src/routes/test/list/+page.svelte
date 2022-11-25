<script lang="ts">
	import { domain } from '$lib/utils';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import type { IFile } from '$lib/types/index';

	let files: IFile[] = [];

	onMount(async () => {
		await axios
			.post(domain + 'api/test/list')
			.then((res) => {
				files = res.data;
			})
			.catch((err) => {
				console.log(err);
			});
	});

	const deleteFile = async (id: string) => {
		await axios.delete(domain + 'api/test/', { data: { id } });
	};
</script>

<div>
	{#each files as file}
		<div>
			<a href="./{file.filename}">{file.filename}</a>
			<button on:click={() => deleteFile(file._id)}>Delete</button>
		</div>
	{/each}
</div>
