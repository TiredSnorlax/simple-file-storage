<script lang="ts">
	import { onMount } from 'svelte';
	import DocsList from '$lib/components/document/DocsList.svelte';
	import { path, resetCurrentFolder } from '$lib/stores';
	import { user } from '$lib/stores';
	import type { IDoc } from '$lib/types';

	// $: docs = $user?.mainFolder! ?? [];

	onMount(() => {
		path.set('/');
		resetCurrentFolder();
	});
</script>

<div class="container">
	{#if $user}
		<div class="info">
			<h2>{$user.username}'s folder</h2>
		</div>
		<DocsList bind:docs={$user.mainFolder} />
	{/if}
</div>

<style>
	.container {
		padding: 1rem;
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
	}

	h2 {
		font-size: 1.2rem;
		font-weight: normal;
	}

	.info {
		padding-bottom: 0.5rem;
		margin-bottom: 0.5rem;
		border-bottom: 1px solid grey;
	}
</style>
