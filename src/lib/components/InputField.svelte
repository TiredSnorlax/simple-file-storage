<script lang="ts">
	import { slide } from 'svelte/transition';

	export let value: string;
	export let label: string;
	export let icon: string;
	export let type = 'text';
	export let valid = false;

	function makeid(length: number) {
		let result = '';
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	let id = makeid(10);
	let show = false;

	const close = () => {
		if (value.length > 0) return;
		show = false;
	};
</script>

<svelte:window />

<div class="field" class:show>
	<div class="icon">
		{#if valid}
			<span transition:slide class="material-icons-outlined"> done </span>
		{:else}
			<span transition:slide class="material-icons-outlined"> {icon} </span>
		{/if}
	</div>

	<div class="content">
		<label class="label" for={id} on:click={() => (show = true)} on:keypress>{label}</label>
		{#if show}
			{#if type === 'password'}
				<input transition:slide type="password" {id} bind:value on:focusout={close} />
			{:else}
				<input transition:slide type="text" {id} bind:value on:focusout={close} />
			{/if}
		{/if}
	</div>
</div>

<style>
	input {
		min-width: 0;
		border: none;
		outline: none;
		background: none;
		height: 2rem;
		font-size: 1.1rem;
	}

	.field {
		width: 250px;
		display: flex;
		align-items: center;
		gap: 1rem;

		border-radius: 5px;
		box-shadow: 0px 1px 1px 0 rgb(200, 200, 200);
		padding: 0.5rem;

		transition: 0.3s;
	}

	.icon span {
		display: flex;
		width: 24px;
	}

	.content {
		flex: 1 1 auto;
		position: relative;
		background: none;
		display: flex;
		flex-direction: column;
	}

	.label {
		color: grey;
		transition: 0.3s;
		cursor: pointer;
	}

	.field.show {
		box-shadow: 0 5px 10px 0px rgb(201, 201, 201);
	}

	.show .label {
		font-size: 12px;
	}
</style>
