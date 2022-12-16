<script lang="ts">
	export let progress: number;
	export let uploading: boolean;
	export let uploadDone: boolean;

	const close = () => {
		progress = 0;
		uploading = false;
		uploadDone = false;
	};
</script>

<div class="progressBarContainer">
	{#if uploadDone}
		<p>Upload successful <span class="material-icons-outlined"> done </span></p>
		<button on:click={close}>Close</button>
	{:else}
		<p>Uploading:</p>
		<div class="progressBar">
			<progress max="100" value={progress + ''} />
			<p>{progress}%</p>
		</div>
	{/if}
</div>

<style>
	button {
		background: none;
		outline: none;
		border: none;
		align-self: center;
		color: grey;

		cursor: pointer;
	}

	p {
		display: flex;
		align-items: center;
	}

	p span {
		border-radius: 50%;
		margin-left: 0.5rem;
		padding: 3px;
		font-size: 1.2rem;
		background: green;
		color: white;
	}

	.progressBarContainer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 1rem;
	}

	.progressBar {
		display: flex;
		gap: 1rem;
	}
</style>
