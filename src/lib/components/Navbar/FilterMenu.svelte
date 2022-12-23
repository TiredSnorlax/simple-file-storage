<script lang="ts">
	import { imgTypes, pdfTypes, vidTypes } from '$lib/utils/files';

	export let filter: string[];
	export let filterMenuOpen: boolean;

	type Filter = {
		name: string;
		icon: string;
		fileTypes: string[];
	};

	let availableFilters: Filter[] = [
		{
			name: 'Images',
			icon: 'image',
			fileTypes: imgTypes
		},
		{ name: 'Videos', icon: 'videocam', fileTypes: vidTypes },
		{
			name: 'PDFs',
			icon: 'picture_as_pdf',
			fileTypes: pdfTypes
		},
		{ name: 'Folders', icon: 'folder', fileTypes: ['folder'] }
	];

	let currentFilters: Filter[] = [...availableFilters];

	const addFilter = (name: string) => {
		if (!name) return;
		const index = currentFilters.findIndex((fil) => fil.name === name);
		if (index >= 0) {
			currentFilters = currentFilters.filter((f) => f.name !== name);
		} else {
			const selectedFilter = availableFilters.find((fil) => fil.name === name);
			if (!selectedFilter) return;
			currentFilters = [...currentFilters, selectedFilter];
		}
		filter = currentFilters.map((f) => f.fileTypes).flat();
		console.log(filter);
	};

	const addAllFilters = () => {
		currentFilters = [...availableFilters];
	};

	const clearFilters = () => {
		currentFilters = [];
	};
</script>

{#if filterMenuOpen}
	<div class="filtersContainer">
		{#each availableFilters as filter}
			<button
				class="filter"
				class:selected={currentFilters.map((f) => f.name).includes(filter.name)}
				on:click={() => addFilter(filter.name)}
			>
				<span class="material-icons-outlined">{filter.icon}</span>
				<p>{filter.name}</p>
			</button>
		{/each}
		<button class="filter" on:click={addAllFilters}>
			<span class="material-icons-outlined">description</span>
			<p>All</p>
		</button>
		<button class="filter" on:click={clearFilters}>
			<span class="material-icons-outlined">clear</span>
			<p>Clear</p>
		</button>
	</div>
{/if}

<style>
	button {
		background: none;
		outline: none;
		border: none;
	}

	.filtersContainer {
		width: 250px;
		background: white;
		border-radius: 5px;
		box-shadow: 1px 0 3px 0 grey;

		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr;

		gap: 1rem;
		padding: 1rem;

		position: absolute;
		left: 100%;
		top: 0;

		z-index: 100;
	}

	.filter {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 0.5rem;

		border-radius: 5px;
		cursor: pointer;

		aspect-ratio: 1;
	}

	.filter.selected {
		background: rgba(0, 0, 0, 0.1);
	}

	.filter:hover {
		background: rgba(0, 0, 0, 0.05);
		cursor: pointer;
	}

	.filter span {
		font-size: 2rem;
	}

	.filter p {
		color: grey;
		font-size: 12px;
		padding-top: 5px;
	}

	@media (max-width: 800px) {
		.filtersContainer {
			left: auto;
			right: 2rem;
		}
	}

	@media (max-width: 500px) {
		.filtersContainer {
			position: fixed;
			top: 4.5rem;
			left: 1rem;
			width: calc(100% - 2rem);
			grid-template-columns: repeat(6, 1fr);
			grid-template-rows: 1fr;
			padding: 0.5rem;
			gap: 5px;
		}
	}
</style>
