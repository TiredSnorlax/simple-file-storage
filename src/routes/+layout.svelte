<script lang="ts">
	import NavBar from '$lib/components/Navbar/NavBar.svelte';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores';
	import axios from 'axios';
	import { domain } from '$lib/utils';
	import { page } from '$app/stores';

	const userId = '6380b4ab7b233f99f3a405a3';

	const excluded = ['/login', '/logout', '/signup'];

	const getFiles = async () => {
		console.log('getting user');
		await axios.post(domain + 'api/me', { userId }).then((res) => {
			user.set(res.data);
		});
	};

	const checkShow = (_id: string) => {
		const id = $page.route.id;
		if (!id) return false;
		return !excluded.includes(id);
	};

	onMount(async () => {
		await getFiles();
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
</div>

<style>
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
</style>
