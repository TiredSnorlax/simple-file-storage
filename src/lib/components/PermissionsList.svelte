<script lang="ts">
	import type { ID, Permission } from '$lib/types';

	export let permissions: Permission[];
	export let isPublic: boolean;
	let open = false;
</script>

<div class="icons">
	<button on:click={() => (open = true)}
		><span class="material-icons-outlined"> group </span></button
	>
	<button on:click={() => (isPublic = !isPublic)}>
		{#if isPublic}
			<span class="material-icons-outlined"> lock_open </span>
		{:else}
			<span class="material-icons-outlined"> lock </span>
		{/if}
	</button>
</div>

{#if open}
	<div class="bg" on:click|self={() => (open = false)} on:keypress>
		<div class="menu">
			<h3>Permissions</h3>
		</div>
	</div>
{/if}

<style>
	button {
		background: none;
		outline: none;
		border: none;
	}

	.icons {
		display: flex;
		gap: 1rem;
	}

	.bg {
		position: fixed;

		inset: 0;
		background: rgba(0, 0, 0, 0.2);

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.menu {
		background: white;
		border-radius: 0.5rem;
		padding: 2rem;

		display: flex;
		flex-direction: column;
	}
</style>
