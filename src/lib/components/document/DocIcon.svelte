<script lang="ts">
	import { imgTypes, vidTypes, pdfTypes } from '$lib/utils/files/index';
	export let fileType: string;
</script>

{#if fileType === 'folder'}
	<span class="material-icons-outlined"> folder </span>
{:else if imgTypes.includes(fileType)}
	<span class="material-icons-outlined"> image </span>
{:else if vidTypes.includes(fileType)}
	<span class="material-icons-outlined"> videocam </span>
{:else if pdfTypes.includes(fileType)}
	<span class="material-icons-outlined"> picture_as_pdf </span>
{:else}
	<span class="material-icons-outlined"> insert_drive_file </span>
{/if}
