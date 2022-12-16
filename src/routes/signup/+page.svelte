<script lang="ts">
	import InputField from '$lib/components/InputField.svelte';
	import { domain } from '$lib/utils';
	import axios from 'axios';
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';

	let username = '';
	let password = '';
	let repeatPassword = '';

	let usernameTimeout: ReturnType<typeof setTimeout>;

	let errorMsg: string | null = null;
	let message: string | null = null;

	const validArray = [false, false, false];

	const usernameChanged = (username: string) => {
		if (usernameTimeout) clearTimeout(usernameTimeout);
		usernameTimeout = setTimeout(() => {
			checkUsername(username);
		}, 1000);
	};

	const checkUsername = async (username: string) => {
		// check if username is taken
		if (username.length === 0) return;
		console.log('check username');
		await axios.post(domain + 'api/signup/check', { username }).then((res) => {
			console.log(res.data);
			const exists = res.data;
			if (exists) errorMsg = 'Username already exists';
			else {
				validArray[0] = true;
				errorMsg = null;
			}
		});
	};

	const checkPassword = (password: string) => {
		return password.length > 8;
	};

	const checkRepeat = (repeatPassword: string) => {
		return repeatPassword === password && password.length > 0;
	};

	$: usernameChanged(username);
	$: validArray[1] = checkPassword(password);
	$: validArray[2] = checkRepeat(repeatPassword);

	const signup = async () => {
		console.log(username, password);
		validArray.forEach((valid, i) => {
			if (!valid) errorMsg = `Field ${i} is wrong`;
		});
		if (errorMsg) return;
		await axios
			.post(domain + 'api/signup', { username, password })
			.then((res) => {
				console.log(res.data);
				message = 'User created successfully!';
				username = '';
				password = '';
				repeatPassword = '';
			})
			.catch((err) => {
				console.log(err);
				errorMsg = err.response.data.message;
			});
	};
</script>

<div class="page">
	<div class="menu">
		<h1>Nice to meet you!</h1>
		<InputField bind:value={username} label="Username" icon="person" valid={validArray[0]} />
		<InputField
			bind:value={password}
			label="Password"
			icon="password"
			type="password"
			valid={validArray[1]}
		/>
		<InputField
			bind:value={repeatPassword}
			label="Repeat"
			icon="password"
			type="password"
			valid={validArray[2]}
		/>
		<p class="passwordNote">
			<span style="color: red">*</span> Password must be longer then 8 characters
		</p>
		<p class="login">Have an account already? Login <a href="./login">here</a></p>
		<button on:click={signup}>Signup</button>
	</div>
	{#if errorMsg}
		<button class="errorMsg" transition:fly={{ y: -30 }} on:click={() => (errorMsg = null)}>
			{errorMsg}
		</button>
	{/if}
	{#if message}
		<button class="message" transition:fly={{ y: -30 }} on:click={() => (message = null)}>
			{message}
		</button>
	{/if}
</div>

<style>
	h1 {
		padding: 1rem 0;
	}

	.login {
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

		position: relative;
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

	.passwordNote {
		font-size: 10px;
		text-align: start;
	}
</style>
