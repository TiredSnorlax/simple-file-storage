<script lang="ts">
	import axios from 'axios';
	import { domain } from '$lib/utils/index';
	import { Buffer } from 'buffer';

	let selectedFiles: FileList;

	const upload = async () => {
		if (selectedFiles.length === 0) return;
		const file = selectedFiles[0];

		// const formData = new FormData();

		const arrayBuffer = await file.arrayBuffer();

		const buffer = Buffer.from(arrayBuffer);

		// formData.append('file', file);
		// formData.append('buffer', buffer);
		// formData.append('fileName', file.name);

		let data = {
			buffer,
			filename: file.name,
			path: ""
		};

		fetch(domain + 'api/test', {
			method: 'POST',
			body: JSON.stringify(data)
		})
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((err) => console.log(err));
	};
</script>

<div>
	<input type="file" name="image" bind:files={selectedFiles} />
	<button on:click={upload}>Upload</button>
</div>
