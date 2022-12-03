<script lang="ts">
	import type { IDoc } from '$lib/types';
	import { domain } from '$lib/utils';
	import { imgTypes, vidTypes, pdfTypes } from '$lib/utils/files/index';
	import axios from 'axios';
	import { slide } from 'svelte/transition';
	import DocIcon from './document/DocIcon.svelte';

	let inputFocused = false;

	let searchTimeout: ReturnType<typeof setTimeout>;

	let filter = ['folder', ...imgTypes, ...vidTypes, ...pdfTypes];

	let results: IDoc[];
	let searchTerm: string;

	const hasFocus = (e: Event) => {
		const input = e.target as HTMLInputElement;
		if (document.activeElement === input) inputFocused = true;
		else inputFocused = false;
	};

	const checkSearch = (e: Event) => {
		const ele = e.target as HTMLInputElement;
		console.log(ele.value);

		if (ele.value.length === 0) return;
		clearTimeout(searchTimeout);

		searchTimeout = setTimeout(() => searchFunction(ele.value), 1000);
	};

	const searchFunction = async (term: string) => {
		console.log('search');
		searchTerm = term;

		await axios
			.post(domain + 'api/document/search', { term, filter })
			.then((res) => {
				console.log(res.data);
				results = res.data;
			})
			.catch((err) => console.log(err));
	};

	// const highlightResults = (results: IDoc[], term: string) => {
	// 	const resultsElement = document.querySelector('#results') as HTMLDivElement;
	// 	if (!resultsElement) return;
	// 	resultsElement.innerHTML = '';
	// 	for (const doc of results) {
	// 		const str = doc.name
	// 			.replace(term, `/${term}/`)
	// 			.split('/')
	// 			.filter((s) => s !== '');
	// 		console.log(str);
	// 		createResultItem(resultsElement, term, str, doc.type);
	// 	}
	// };

	// const createResultItem = (
	// 	container: HTMLDivElement,
	// 	term: string,
	// 	arr: string[],
	// 	type: string
	// ) => {
	// 	const item = document.createElement('div');
	// 	const nameContainer = document.createElement('div');
	// 	for (const str of arr) {
	// 		const ele = document.createElement('span');
	// 		if (type === 'file')
	// 			item.innerHTML = '<span class="material-icons-outlined"> insert_drive_file </span>';
	// 		else if (type === 'folder')
	// 			item.innerHTML = '<span class="material-icons-outlined"> folder </span>';
	// 		ele.innerText = str;
	// 		if (str === term) {
	// 			ele.style.fontWeight = 'bold';
	// 		}
	// 		nameContainer.appendChild(ele);
	// 	}
	// 	item.appendChild(nameContainer);
	// 	container.appendChild(item);
	// };
</script>

<svelte:window on:click={hasFocus} />

<div class="search" class:inputFocused>
	<span class="material-icons-outlined"> search </span>
	<input type="text" placeholder="Search drive" on:keyup={checkSearch} />
	<span class="material-icons-outlined"> tune </span>
	{#if results && results.length > 0 && inputFocused}
		<div class="results" id="results" transition:slide>
			{#each results as doc, i}
				<a href={`${domain}${doc.type}/${doc.childId}`}>
					<div>
						<DocIcon fileType={doc.fileType} />
						<div>
							{#each doc.name
								.replace(searchTerm, `/${searchTerm}/`)
								.split('/')
								.filter((s) => s !== '') as str}
								<span class:bolded={str === searchTerm}>{str}</span>
							{/each}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	span.bolded {
		font-weight: bold;
	}
	a {
		text-decoration: none;
		color: initial;
		width: 100%;
	}

	.search {
		width: 100%;
		max-width: 400px;

		background: rgb(240, 240, 240);
		padding: 0.5rem;
		border-radius: 5px;

		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;

		position: relative;
	}

	.search.inputFocused {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;

		background: white;
		box-shadow: 0 1px 3px 0 grey;
	}

	.search input {
		background: none;
		outline: none;
		border: none;
		border-radius: 2rem;

		flex: 1 1 auto;
		min-width: none;

		font-size: 1rem;
	}

	.results {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;

		background: white;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding: 0.5rem;

		box-shadow: 0 3px 3px 0 grey;
		border-radius: 5px;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		z-index: 50;
	}
	.results a > div {
		padding: 0.5rem;

		width: 100%;

		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.results a > div > div {
		flex: 1 1 0;
		text-align: start;
	}
</style>
