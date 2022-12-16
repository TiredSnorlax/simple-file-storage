<script lang="ts">
	import { goto } from '$app/navigation';
	import InputField from '$lib/components/InputField.svelte';
	import { errorMessage, message, user } from '$lib/stores';
	import { domain } from '$lib/utils';
	import axios from 'axios';

	let username = '';
	let password = '';

	const login = async () => {
		console.log('username: ' + username);
		console.log('password: ' + password);

		if (!username || !password) return;

		await axios
			.post(domain + 'api/login', { username, password })
			.then((res) => {
				message.set(res.data.message);
				console.log(res.data);
				user.set(res.data.found);
				goto('./me');
			})
			.catch((err) => {
				console.log(err.response.data.message);
				errorMessage.set(err.response.data.message);
			});
	};
</script>

<div class="page">
	<div class="menu">
		<h1>Welcome back!</h1>
		<InputField bind:value={username} label="Username" icon="person" />
		<InputField bind:value={password} label="Password" icon="password" type="password" />
		<p class="signup">No account? Sign up <a href="./signup">here</a></p>
		<button on:click={login}>Login</button>
	</div>
</div>

<style>
	h1 {
		padding: 1rem 0;
	}

	.signup {
		margin-top: 1rem;
		font-size: 0.9rem;
	}

	button {
		width: 100%;
		outline: none;
		border: none;
		background: blue;
		color: white;
		font-size: 1.1rem;
		border-radius: 4rem;
		padding: 0.5rem;

		cursor: pointer;
	}

	button:hover {
		background: rgb(160, 160, 255);
	}
	.page {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		background: lightskyblue;
	}

	.menu {
		background: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;

		border-radius: 1rem;
		padding: 2rem;
	}
</style>
