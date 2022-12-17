<script lang="ts">
	import NavBar from '$lib/components/Navbar/NavBar.svelte';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { domain } from '$lib/utils';
	import { user, message, errorMessage } from '$lib/stores';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';

	const userId = '6380b4ab7b233f99f3a405a3';

	const excluded = ['/login', '/logout', '/signup'];

	$: pageId = $page.route.id;

	const getFiles = async () => {
		console.log('getting user');
		await axios.post(domain + 'api/me', { userId }).then((res) => {
			user.set(res.data);
		});
	};

	const checkShow = (_id: string) => {
		if (!pageId) return false;
		return !excluded.includes(pageId);
	};

	onMount(async () => {
		if (pageId && !excluded.includes(pageId)) await getFiles();
	});

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
		</button>
	{/if}
	{#if $message}
		<button class="message" transition:fly={{ y: -30 }} on:click={() => message.set(null)}>
			{$message}
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
		top: 1rem;
		left: 0;
		right: 0;
		margin: 0 auto;
		padding: 0.5rem 1rem;
		background: red;
		border-radius: 0.5rem;

		font-size: 1.1rem;

		width: fit-content;
	}

	.message {
		position: fixed;
		top: 1rem;
		left: 0;
		right: 0;
		margin: 0 auto;
		padding: 0.5rem 1rem;
		background: green;
		border-radius: 0.5rem;

		font-size: 1.1rem;

		width: fit-content;
	}

	.errorMsg:hover {
		background: rgb(255, 160, 160);
	}

	.message:hover {
		background: rgb(160, 255, 160);
	}
</style>
