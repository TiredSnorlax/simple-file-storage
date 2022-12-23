<script lang="ts">
	import InputField from '$lib/components/InputField.svelte';
	import { errorMessage, message } from '$lib/stores';
	import { domain } from '$lib/utils';
	import { imgTypes } from '$lib/utils/files';
	import axios from 'axios';
	import { Buffer } from 'buffer';

	let username = '';
	let email = '';
	let password = '';
	let repeatPassword = '';

	let usernameTimeout: ReturnType<typeof setTimeout>;
	let emailTimeout: ReturnType<typeof setTimeout>;

	let validArray = [false, false, false, false];

	let canvasEle: HTMLCanvasElement;
	let selectedFiles: FileList | null = null;

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
		await axios.post(domain + 'api/signup/check/username', { username }).then((res) => {
			console.log(res.data);
			const exists = res.data;
			if (exists) {
				validArray[0] = false;
				errorMessage.set('Username already exists');
			} else {
				validArray[0] = true;
				errorMessage.set(null);
			}
		});
	};

	const emailChanged = (email: string) => {
		if (emailTimeout) clearTimeout(emailTimeout);
		usernameTimeout = setTimeout(() => {
			checkEmail(email);
		}, 1000);
	};

	const checkEmail = async (email: string) => {
		if (email.length === 0) return;
		console.log('check email');
		const re =
			/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		if (!re.test(email)) {
			errorMessage.set('Invalid email');
			return;
		}
		await axios.post(domain + 'api/signup/check/email', { email }).then((res) => {
			const exists = res.data;
			if (exists) {
				validArray[1] = false;
				errorMessage.set('Email already in use');
			} else {
				validArray[1] = true;
				errorMessage.set(null);
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
	$: emailChanged(email);
	$: validArray[2] = checkPassword(password);
	$: validArray[3] = checkRepeat(repeatPassword);

	const previewFiles = (files: FileList | null) => {
		if (!files) return;
		console.log('start preview');
		const file = files[0];
		canvasEle.id = file.name;
		const url = URL.createObjectURL(file);

		const fileType = file.type.split('/')[0];
		console.log(fileType);
		const img = new Image();
		img.src = url;
		img.onload = () => {
			let ctx = canvasEle.getContext('2d');
			if (!ctx) return;
			canvasEle.height = 100;
			canvasEle.width = 100;
			var hRatio = canvasEle.width / img.width;
			var vRatio = canvasEle.height / img.height;
			var ratio = Math.max(hRatio, vRatio);
			var centerShift_x = (canvasEle.width - img.width * ratio) / 2;
			var centerShift_y = (canvasEle.height - img.height * ratio) / 2;
			ctx.clearRect(0, 0, canvasEle.width, canvasEle.height);
			ctx.drawImage(
				img,
				0,
				0,
				img.width,
				img.height,
				centerShift_x,
				centerShift_y,
				img.width * ratio,
				img.height * ratio
			);
			URL.revokeObjectURL(img.src);
		};
	};

	$: previewFiles(selectedFiles);

	const signup = async () => {
		console.log(username, password);
		validArray.forEach((valid, i) => {
			if (!valid) errorMessage.set(`Field ${i} is wrong`);
		});
		if ($errorMessage) return;
		let buffer: Buffer | null = null;
		if (canvasEle) {
			buffer = Buffer.from(
				canvasEle.getContext('2d')!.getImageData(0, 0, canvasEle.width, canvasEle.height).data
			);
		}
		await axios
			.post(domain + 'api/signup', { username, email, password, buffer })
			.then((res) => {
				console.log(res.data);
				message.set('User created successfully!');
				username = '';
				email = '';
				password = '';
				repeatPassword = '';
				selectedFiles = null;
				canvasEle.getContext('2d')?.clearRect(0, 0, 100, 100);
				canvasEle.width = 0;
				canvasEle.height = 0;
				validArray = [false, false, false, false];
			})
			.catch((err) => {
				console.log(err);
				errorMessage.set(err.response.data.message);
			});
	};
</script>

<div class="page">
	<div class="menu">
		<h1>Nice to meet you!</h1>
		<div class="profilePic">
			<div class="canvasContainer" class:hasChild={selectedFiles}>
				<canvas width="0" height="0" bind:this={canvasEle} />
			</div>
			{#if !selectedFiles}
				<label for="fileInput"><span class="material-icons-outlined"> photo_camera </span></label>
				<input
					bind:files={selectedFiles}
					type="file"
					id="fileInput"
					accept={imgTypes.map((type) => '.' + type).join(',')}
					hidden
				/>
				<p>Add photo here</p>
			{/if}
		</div>
		<InputField bind:value={username} label="Username" icon="person" valid={validArray[0]} />
		<InputField bind:value={email} label="Email" icon="email" valid={validArray[1]} />
		<InputField
			bind:value={password}
			label="Password"
			icon="password"
			type="password"
			valid={validArray[2]}
		/>
		<InputField
			bind:value={repeatPassword}
			label="Repeat"
			icon="password"
			type="password"
			valid={validArray[3]}
		/>
		<p class="passwordNote">
			<span style="color: red">*</span> Password must be longer then 8 characters
		</p>
		<p class="login">Have an account already? Login <a href="./login">here</a></p>
		<button on:click={signup}>Signup</button>
	</div>
</div>

<style>
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

	.profilePic {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		font-size: 12px;
		color: grey;
	}

	.profilePic label {
		padding: 0.5rem;
		background: rgba(255, 0, 0, 0.2);
		border-radius: 50%;
		margin-bottom: 0.5rem;
	}

	.profilePic span {
		display: flex;
		color: black;
		font-size: 2rem;
	}

	.profilePic .canvasContainer {
		border-radius: 50%;
		overflow: hidden;
		display: flex;
	}

	.passwordNote {
		font-size: 10px;
		text-align: start;
	}
</style>
