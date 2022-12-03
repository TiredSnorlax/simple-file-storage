<script lang="ts">
	import type { IDoc } from '$lib/types';
	import axios from 'axios';
	import { user, path } from '$lib/stores';
	import { domain } from '$lib/utils';

	export let doc: IDoc;
	export let deleteMenuOpen: boolean;

	export let hide: boolean;

	let result: string | null = null;

	const deleteFile = async () => {
		await axios
			.delete(`${domain}api/${doc.type}/${doc.childId}`, {
				data: { path: $path, userId: $user?._id, type: doc.type }
			})
			.then((res) => {
				console.log(res.data);
				result = 'success';
				hide = true;
			})
			.catch((err) => {
				console.log(err.response.data);
				result = 'error';
			});
	};
</script>

<div class="bg">
	<div class="menu">
		{#if result === null}
			<h3>Delete {doc.name}?</h3>
			{#if doc.type === 'folder'}
				<p>Note: All data stored in this folder will be deleted as well</p>
			{/if}

			<p>This action is irreversible!</p>
			<div class="btnContainer">
				<button on:click={() => (deleteMenuOpen = false)}>Cancel</button>
				<button on:click={deleteFile}>Delete</button>
			</div>
		{:else if result === 'success'}
			<p>Delete success!</p>
			<button on:click={() => (deleteMenuOpen = false)}>Close</button>
		{:else if result === 'error'}
			<p>Something went wrong... Try again later.</p>
			<button on:click={() => (deleteMenuOpen = false)}>Close</button>
		{/if}
	</div>
</div>

<style>
	button {
		background: none;
		outline: none;
		border: none;

		font-size: 1rem;
		cursor: pointer;
	}
	.bg {
		position: fixed;
		inset: 0;

		background-color: rgba(0, 0, 0, 0.2);

		display: flex;
		justify-content: center;
		align-items: center;

		z-index: 100;
	}

	.menu {
		padding: 2rem;
		padding-bottom: 1rem;
		background: white;
		border-radius: 0.5rem;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.menu > p {
		max-width: 300px;
		text-align: center;
	}

	.btnContainer {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;

		padding-top: 1rem;
	}
	.btnContainer button {
		color: grey;
		padding: 0.5rem 1rem;
	}

	.btnContainer button:last-child {
		background: red;
		color: white;
		border-radius: 5px;
	}
</style>
