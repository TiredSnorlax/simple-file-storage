<script lang="ts">
	import type { IDoc } from '$lib/types';
	import { domain } from '$lib/utils';
	import axios from 'axios';
	import { user, path } from '$lib/stores';

	export let doc: IDoc;
	export let renameMenuOpen: boolean;

	let newName = '';

	const save = async () => {
		if (!$user) return;
		await axios
			.post(domain + 'api/folder/' + doc.childId + '/rename', {
				userId: $user._id,
				path: $path,
				newName
			})
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};
</script>

<div class="bg">
	<div class="menu">
		<h2>Rename {doc.type}</h2>
		<input bind:value={newName} />
		<div class="btnContainer">
			<button on:click={() => (renameMenuOpen = false)}>Cancel</button>
			<button on:click={save}>Save</button>
		</div>
	</div>
</div>

<style>
	button {
		background: none;
		outline: none;
		border: none;
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

	.btnContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.btnContainer button {
		color: grey;
	}

	.btnContainer button:last-child {
		color: blue;
	}
</style>
