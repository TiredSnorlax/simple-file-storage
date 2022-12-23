<script lang="ts">
	import NavBar from '$lib/components/Navbar/NavBar.svelte';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { domain } from '$lib/utils';
	import { user, message, errorMessage } from '$lib/stores';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';

	const excluded = ['/login', '/logout', '/signup', '/'];

	$: route = $page.route;

	const getFiles = async () => {
		console.log('getting user');
		await axios.post(domain + 'api/me').then((res) => {
			user.set(res.data);
		});
	};

	const checkShow = (_id: string) => {
		if (!route.id) return false;
		if (!excluded.includes(route.id!) && typeof document !== 'undefined') getFiles();
		return !excluded.includes(route.id);
	};

	$: show = checkShow($page.params.id);
</script>

<div class="container">
	{#if show}
		<NavBar />
	{/if}
	<div class="slot">
		<slot />
	</div>
	{#if $errorMessage}
		<button class="errorMsg" transition:fly={{ y: -30 }} on:click={() => errorMessage.set(null)}>
			{$errorMessage}
			<span class="material-icons-outlined"> clear </span>
		</button>
	{/if}
	{#if $message}
		<button class="message" transition:fly={{ y: -30 }} on:click={() => message.set(null)}>
			{$message}
			<span class="material-icons-outlined"> clear </span>
		</button>
	{/if}
</div>

<style>
	button {
		outline: none;
		border: none;
		background: blue;
		color: white;
		font-size: 1.1rem;
		border-radius: 4rem;
		padding: 0.5rem;

		cursor: pointer;
	}

	span {
		display: flex;
		font-size: 18px;
		color: rgba(255, 255, 255, 0.7);
	}

	.container {
		width: 100vw;
		height: 100vh;
		overflow-y: auto;

		display: flex;
		flex-direction: column;

		position: relative;
	}

	.slot {
		flex: 1 1 auto;
	}

	.errorMsg {
		position: fixed;
		top: 2rem;
		left: 0;
		right: 0;
		margin: 0 auto;
		padding: 1rem 1.5rem;
		background: red;
		border-radius: 0.5rem;

		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;

		font-size: 1.1rem;

		width: fit-content;
	}

	.message {
		position: fixed;
		top: 2rem;
		left: 0;
		right: 0;
		margin: 0 auto;
		padding: 1rem 1.5rem;
		background: rgb(0, 189, 0);
		border-radius: 0.5rem;

		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;

		font-size: 1.1rem;

		width: fit-content;
	}

	.errorMsg:hover {
		background: rgb(255, 100, 100);
	}

	.message:hover {
		background: rgb(60, 200, 60);
	}
</style>
