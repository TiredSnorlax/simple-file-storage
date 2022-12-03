<script lang="ts">
	import type { IDoc } from '$lib/types';
	import { domain } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import DocDeleteMenu from './DocDeleteMenu.svelte';

	import DocDetailsMenu from './DocDetailsMenu.svelte';
	import DocIcon from './DocIcon.svelte';
	import DocRenameMenu from './DocRenameMenu.svelte';

	export let doc: IDoc;

	let open = false;

	// * Just a visual effect for item disappearing after delete
	let hide = false;

	let renameMenuOpen = false;
	let detailsMenuOpen = false;
	let deleteMenuOpen = false;
</script>

{#if !hide}
	<div class="item">
		<a href={`${domain}${doc.type}/${doc.childId}`} class="info">
			<!-- {#if doc.type === 'file'}
				<span class="material-icons-outlined"> insert_drive_file </span>
			{:else}
				<span class="material-icons-outlined"> folder </span>
			{/if} -->
			<DocIcon fileType={doc.fileType} />
			<p>{doc.name}</p>
		</a>
		<button on:click={() => (open = !open)}
			><span class="material-icons-outlined"> more_vert </span></button
		>

		{#if open}
			<div class="popup" transition:slide>
				<button on:click={() => (deleteMenuOpen = true)}>Delete</button>
				<button on:click={() => (detailsMenuOpen = true)}>Details</button>
				<button on:click={() => (renameMenuOpen = true)}>Rename</button>
			</div>
		{/if}
	</div>
{/if}

{#if renameMenuOpen}
	<DocRenameMenu {doc} bind:renameMenuOpen />
{/if}

{#if detailsMenuOpen}
	<DocDetailsMenu {doc} bind:detailsMenuOpen />
{/if}

{#if deleteMenuOpen}
	<DocDeleteMenu {doc} bind:deleteMenuOpen bind:hide />
{/if}

<style>
	a {
		color: initial;
		text-decoration: none;
		display: block;
		min-width: 0;
	}

	button {
		background: none;
		border: none;
		outline: none;

		display: block;
	}

	.item {
		border: 1px solid grey;
		border-radius: 0.5rem;
		padding: 0.5rem;

		/* flex: 1 1 230px;
		max-width: 300px; */
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;

		position: relative;
	}

	.info {
		flex: 1 1 0;
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5rem;
	}

	.info > p {
		flex: 1 1 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.popup {
		position: absolute;
		top: 0;
		right: 2rem;
		z-index: 50;

		width: 120px;

		background: white;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
		padding: 0.5rem 0;
		border-radius: 5px;

		display: flex;
		flex-direction: column;
	}

	.popup button {
		text-align: center;
		font-size: 0.9rem;
		padding: 0.5rem;
		color: rgb(70, 70, 70);
	}

	.popup button:hover {
		background: rgba(0, 0, 0, 0.1);
	}
</style>
