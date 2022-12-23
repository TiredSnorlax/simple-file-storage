<script lang="ts">
	import type { IUser, UserPermission } from '$lib/types';
	import { domain } from '$lib/utils';
	import { user } from '$lib/stores';
	import axios from 'axios';
	import FileViewer from '../FileViewer.svelte';

	export let userPermissions: UserPermission[];

	let userQuery = '';
	let queryResults: IUser[] | null = null;
	let queryTimeout: ReturnType<typeof setTimeout>;

	const checkQuery = (userQuery: string) => {
		console.log('check query');
		clearTimeout(queryTimeout);
		if (!userQuery) return (queryResults = null);
		queryTimeout = setTimeout(() => {
			findUsers();
		}, 1000);
	};

	const findUsers = async () => {
		console.log('search perms users');
		await axios
			.post(domain + 'api/user/find', { userQuery })
			.then((res) => {
				console.log(res);
				queryResults = res.data;
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const filterQuery = (queryResults: IUser[] | null) => {
		console.log('filter');
		let current = $user?._id;
		if (!queryResults || queryResults.length === 0) return;
		queryResults = queryResults.filter((user) => user._id !== current);
		return;
	};

	const addUser = (user: IUser) => {
		queryResults = null;
		const exists = userPermissions.find((perm) => perm.user._id === user._id);
		if (!exists) userPermissions = [{ user, type: 'edit' }, ...userPermissions];
	};

	const removeUser = (user: IUser) => {
		userPermissions = userPermissions.filter((perm) => perm.user._id !== user._id);
		return;
	};

	$: checkQuery(userQuery);
	$: filterQuery(queryResults);
</script>

<div class="userPermsList">
	<div class="userSearch">
		<input
			type="text"
			placeholder="Add user by email or via username with '@'"
			bind:value={userQuery}
		/>
		{#if queryResults}
			<div class="results">
				{#if queryResults.length > 0}
					{#each queryResults as _user}
						<button on:click={() => addUser(_user)}>
							<div class="profilePic">
								<FileViewer id={_user.picture} fileType="png" />
							</div>
							<div>
								<p>{_user.username}</p>
								<p>{_user.email}</p>
							</div>
						</button>
					{/each}
				{:else}
					<p>No such user</p>
				{/if}
			</div>
		{/if}
	</div>
	<h3>People with access:</h3>
	<div class="users">
		{#each userPermissions as perm}
			<div class="user">
				<div>
					<div class="profilePic">
						<FileViewer id={perm.user.picture} fileType="png" />
					</div>
					<div>
						<p class="name">{perm.user.username}</p>
						<p class="email">{perm.user.email}</p>
					</div>
				</div>
				<div>
					<label for={`perm-${perm.user._id}`}>Can:</label>
					<select id={`perm-${perm.user._id}`} name="perm" bind:value={perm.type}>
						<option value="edit">Edit</option>
						<option value="view">View</option>
					</select>
				</div>
				<button on:click={() => removeUser(perm.user)}>x</button>
			</div>
		{/each}
	</div>
</div>

<style>
	input {
		min-width: none;
		font-size: 1rem;
		width: 100%;
		padding: 0.5rem;
		border-radius: 5px;
		border: 1px solid grey;
		outline: none;
	}

	button {
		background: none;
		outline: none;
		border: none;
	}

	h3 {
		font-weight: normal;
		text-align: start;
		width: 100%;
		font-size: 18px;
	}

	.userSearch {
		width: 100%;
		position: relative;
	}

	.userSearch .results {
		top: 100%;
		width: 100%;
		position: absolute;
		background: white;
		padding: 0.5rem 0;
		box-shadow: 0 1px 2px 0 grey;

		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
	}

	.userSearch .results button {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5rem;

		padding: 0.5rem;
	}

	.userSearch .results button:hover {
		background: rgb(200, 200, 200);
	}

	.userSearch .results button p {
		font-weight: bold;
		font-size: 1rem;
	}

	.userSearch .results button p:last-child {
		min-width: none;
		font-weight: normal;
		color: grey;
		font-size: 14px;

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.results button div:last-child {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.profilePic {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.userPermsList {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.users {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.user {
		width: 100%;
		display: flex;
	}

	.user {
		flex: 1 1 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.user > div:first-child {
		flex: 1 1 auto;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5rem;
	}

	.user .name {
		font-weight: bold;
	}

	.user .email {
		font-size: 13px;
		color: grey;
	}

	.user select {
		background: none;
		border: 1px solid grey;
		padding: 0.5rem;
		border-radius: 0.5rem;

		font-size: 1rem;
	}
</style>
