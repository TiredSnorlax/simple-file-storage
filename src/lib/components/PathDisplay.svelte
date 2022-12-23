<script lang="ts">
	import type { IFolder } from '$lib/types';
	import { domain } from '$lib/utils';
	import axios from 'axios';
	import type { ObjectId } from 'mongodb';
	import { onDestroy } from 'svelte';
	import { path } from '$lib/stores';

	export let current: string | ObjectId = '';
	export let type: string;

	let pathArray: IFolder[] = [];

	$: backUrl = getBackUrl(pathArray);

	const getBackUrl = (pathArray: IFolder[]) => {
		const offset = type === 'file' ? -1 : -2;
		let id = pathArray.at(offset)?._id;
		if (!id) return domain + 'me';
		return domain + 'folder/' + id;
	};

	const getPath = async (path: string) => {
		await axios
			.post(domain + 'api/document/path', { path })
			.then((res) => {
				pathArray = res.data;
			})
			.catch((err) => console.log(err));
	};

	const unsubscribe = path.subscribe((value) => {
		if (!value) return;
		getPath(value);
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div class="pathContainer">
	<a href={backUrl} class="backBtn">
		<span class="material-icons-outlined"> arrow_back_ios </span></a
	>
	<div class="pathDisplay">
		{#each pathArray as path}
			<p class="slash">/</p>
			<p><a href="/view/folder/{path._id}">{path.foldername}</a></p>
		{/each}
		{#if type === 'file'}
			<p class="slash">/</p>
			<p>{current}</p>
		{/if}
	</div>
</div>

<style>
	a {
		text-decoration: none;
		color: initial;
	}

	a,
	p {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	p.slash {
		flex-shrink: 0;
	}

	a span {
		display: flex;
		color: grey;
	}

	a:hover {
		text-decoration: underline;
	}

	.backBtn:hover {
		text-decoration: none;
	}

	.pathContainer {
		flex: 1 1 auto;
		min-width: 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 1rem;
	}

	.pathDisplay {
		flex: 1 1 auto;
		min-width: 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 5px;

		font-size: 1.2rem;
	}

	.pathDisplay p:last-child {
		text-decoration: underline;
		text-decoration-thickness: 2px;
	}

	@media (max-width: 600px) {
		.pathDisplay {
			font-size: 14px;
		}
		p {
			max-width: 120px;
		}
	}
</style>
