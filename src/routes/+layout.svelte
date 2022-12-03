<script>
	import AddFile from '$lib/components/AddFile.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores';
	import axios from 'axios';
	import { domain } from '$lib/utils';

	const userId = '6380b4ab7b233f99f3a405a3';

	const getFiles = async () => {
		console.log('getting user');
		await axios.post(domain + 'api/me', { userId }).then((res) => {
			user.set(res.data);
		});
	};

	onMount(async () => {
		await getFiles();
	});
</script>

<div class="container">
	<NavBar />
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
