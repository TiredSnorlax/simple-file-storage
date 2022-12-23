<script>
	import ProfileMenu from './ProfileMenu.svelte';
	import SearchBar from './SearchBar.svelte';
</script>

<div class="navbar">
	<a href="/me" class="logo"><span class="material-icons-outlined"> wb_cloudy </span></a>
	<SearchBar />
	<ProfileMenu />
</div>

<style>
	a {
		color: initial;
		text-decoration: none;
		/* color: white; */
	}

	.navbar {
		padding: 0.7rem 1rem;
		/* background: rgb(170, 170, 253); */
		border-bottom: 1px solid grey;

		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;

		position: relative;
	}

	.logo span {
		font-size: 2rem;
		display: flex;
		color: rgb(109, 109, 255);
	}
</style>
