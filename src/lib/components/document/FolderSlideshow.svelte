<script lang="ts">
	import type { IDoc } from '$lib/types';
	import { domain } from '$lib/utils';
	import FileViewer from '../FileViewer.svelte';

	export let files: IDoc[];
	export let slideshowOpen: boolean;

	let offset = 0;
	let currentIndex = 0;

	let downloadLink: string;

	const increment = () => {
		if (currentIndex < files.length - 1) currentIndex++;
	};

	const decrement = () => {
		if (currentIndex > 0) currentIndex--;
	};

	const setOffset = (index: number) => {
		if (!files || files.length === 0) return 0;
		downloadLink = domain + `api/file/${files[currentIndex].childId}`;
		return index * 100;
	};

	const onKeyBoardInput = (e: KeyboardEvent) => {
		if (e.key === 'ArrowLeft') decrement();
		else if (e.key === 'ArrowRight') increment();
	};

	$: offset = setOffset(currentIndex);
</script>

<svelte:window on:keydown={onKeyBoardInput} />

{#if slideshowOpen}
	<div class="slideshow">
		<div class="offset" style="margin-left: -{offset}%;" />
		{#each files as file}
			<div class="slide">
				<FileViewer id={file.childId} fileType={file.fileType} />
			</div>
		{/each}
		<div class="indexInfo">
			<p>{currentIndex + 1} of {files.length}</p>
		</div>

		<div class="topRight">
			<a href={downloadLink} class="download" download={files[currentIndex].name}
				><span class="material-icons-outlined"> file_download </span></a
			>
			<button class="closeBtn" on:click={() => (slideshowOpen = false)}
				><span class="material-icons-outlined"> close </span></button
			>
		</div>
		{#if currentIndex > 0}
			<button on:click={decrement} class="decrementBtn"
				><span class="material-icons-outlined"> chevron_left </span></button
			>
		{/if}
		{#if currentIndex < files.length - 1}
			<button on:click={increment} class="incrementBtn"
				><span class="material-icons-outlined"> chevron_right </span></button
			>
		{/if}
	</div>
{/if}

<style>
	button {
		outline: none;
		border: none;
		background: none;
		cursor: pointer;

		display: flex;
	}

	button span {
		color: white;
	}

	.slideshow :global(p) {
		color: white;
	}

	.offset {
		transition: 0.3s;
	}
	.slideshow {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);

		display: flex;
		justify-content: flex-start;
		align-items: center;

		z-index: 100;
	}

	.slide {
		flex-shrink: 0;
		width: 100%;
		height: 100%;
	}

	.topRight {
		display: flex;

		position: absolute;
		top: 1.5rem;
		right: 1.5rem;

		gap: 1rem;
	}

	.closeBtn span {
		font-size: 1.5rem;
		color: white;
	}

	.download {
		display: block;
		color: white;
		text-decoration: none;
	}

	.incrementBtn {
		position: absolute;
		top: 50%;
		right: 1rem;

		padding: 0.5rem;
		border-radius: 50%;

		transform: translate(0, -50%);
	}

	.decrementBtn {
		position: absolute;
		top: 50%;
		left: 1rem;

		border-radius: 50%;
		padding: 0.5rem;

		transform: translate(0, -50%);
	}

	.incrementBtn:hover,
	.decrementBtn:hover {
		background: rgba(0, 0, 0, 0.4);
	}

	.indexInfo {
		background: rgba(0, 0, 0, 0.4);
		padding: 0.25rem 0.5rem;

		position: absolute;
		top: 1rem;
		left: 0;
		right: 0;
		width: fit-content;
		margin: 0 auto;
	}
</style>
