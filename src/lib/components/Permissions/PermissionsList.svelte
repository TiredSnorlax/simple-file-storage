<script lang="ts">
	import { errorMessage, message } from '$lib/stores';
	import type { IDoc, UserPermission } from '$lib/types';
	import { domain } from '$lib/utils';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import UserPermissionsList from './UserPermissionsList.svelte';

	export let doc: IDoc;

	let open = false;
	let userPermissions: UserPermission[] = [];

	let isPublic = doc.isPublic;

	const getPermissions = async () => {
		await axios
			.get(domain + 'api/document/permissions', {
				params: { childId: doc.childId, type: doc.type }
			})
			.then((res) => {
				console.log(res.data);
				userPermissions = res.data;
			})
			.catch((err) => {
				console.log(err);
				errorMessage.set(err.data.response.message);
			});
	};

	const send = async () => {
		console.log(userPermissions);
		await axios
			.post(domain + 'api/document/permissions', {
				isPublic,
				updatedUserPermissions: userPermissions,
				docId: doc._id
			})
			.then((res) => {
				message.set(res.data.message);
				open = false;
			})
			.catch((err) => {
				errorMessage.set(err.data.response.message);
			});
	};

	onMount(() => {
		getPermissions();
	});
</script>

<button class="groupBtn" on:click={() => (open = true)}
	><span class="material-icons-outlined"> group </span></button
>

{#if open}
	<div class="bg" on:click|self={() => (open = false)} on:keypress>
		<div class="menu">
			<div class="top">
				<button on:click={() => (isPublic = false)}>
					<span class="material-icons-outlined" class:selected={!isPublic}> lock </span>
					<div>
						<p>Set this {doc.type} to <strong>private</strong>.</p>
						<span>Only users with permission will be able to edit and view it</span>
					</div>
				</button>
				<button on:click={() => (isPublic = true)}>
					<span class="material-icons-outlined" class:selected={isPublic}> lock_open </span>
					<div>
						<p>Set this {doc.type} to <strong>public</strong>.</p>
						<span>All users will be able to view it</span>
					</div>
				</button>
			</div>
			<UserPermissionsList bind:userPermissions />
			<button class="doneBtn" on:click={send}>Done</button>
		</div>
	</div>
{/if}

<style>
	button {
		background: none;
		outline: none;
		border: none;

		cursor: pointer;
	}

	.groupBtn {
		background: blue;
		border-radius: 5px;
		padding: 0.5rem 1rem;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.groupBtn span {
		color: white;
		display: flex;
		font-size: 1.7rem;
	}

	.bg {
		position: fixed;

		inset: 0;
		background: rgba(0, 0, 0, 0.2);

		display: flex;
		justify-content: center;
		align-items: center;

		z-index: 50;
	}

	.menu {
		background: white;
		border-radius: 0.5rem;
		padding: 2rem;

		width: 80%;
		max-width: 600px;
		max-height: 80%;

		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	/* TOP */

	.top {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.top > button {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.top > button > span {
		color: grey;
		font-size: 2rem;
	}

	.top > button > span.selected {
		color: blue;
	}

	.top > button > div {
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		gap: 0.5rem;
		text-align: center;
		height: 100%;
	}

	.top > button > div p {
		font-size: 1rem;
	}
	.top > button > div span {
		font-size: 12px;
		color: grey;
	}

	.doneBtn {
		background: blue;
		color: white;
		width: fit-content;
		padding: 0.5rem 1rem;
		border-radius: 5px;
		align-self: flex-end;
		font-size: 1.2rem;
	}

	@media (max-width: 600px) {
		.groupBtn span {
			font-size: 20px;
		}
	}
</style>
