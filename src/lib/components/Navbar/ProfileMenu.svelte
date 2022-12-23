<script lang="ts">
	import { user } from '$lib/stores';
	import FileViewer from '../FileViewer.svelte';
	let profileOpen = false;
</script>

<button class="profile" on:click={() => (profileOpen = !profileOpen)}>
	{#if $user && $user.picture}
		<div class="imgContainer">
			<FileViewer id={$user.picture} fileType={'canvas'} width={100} height={100} />
		</div>
	{:else}
		<span class="material-icons-outlined"> person </span>
	{/if}
</button>
{#if profileOpen}
	<div class="menu">
		{#if $user}
			<div class="imgContainer">
				<FileViewer id={$user.picture} fileType={'canvas'} width={100} height={100} />
			</div>
			<h3>Hello, <strong>{$user.username}</strong></h3>
			<p>{$user.email}</p>
			<a href="./logout">Logout</a>
		{/if}
	</div>
{/if}

<style>
	button {
		background: none;
		outline: none;
		border: none;
	}

	h3 {
		font-weight: normal;
	}

	.menu {
		position: absolute;
		top: 100%;
		right: 2rem;

		background: white;
		padding: 1rem;
		border-radius: 5px;

		gap: 0.5rem;

		display: flex;
		flex-direction: column;
		align-items: center;

		z-index: 50;

		box-shadow: 0 1px 3px 0 grey;
	}

	a {
		text-decoration: none;
		border: 1px solid grey;
		outline: none;
		border-radius: 3px;
		background: none;
		color: grey;

		padding: 0.5rem 0.75rem;
	}

	.imgContainer {
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		overflow: hidden;
	}

	.menu .imgContainer {
		width: 100px;
		height: 100px;
		margin: 0.5rem;
	}
</style>
