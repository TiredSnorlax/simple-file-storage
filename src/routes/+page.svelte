<div class="page">
	<nav>
		<div class="icon">
			<span class="material-icons-outlined"> wb_cloudy </span>
		</div>
		<a href="./me">Go to folder</a>
	</nav>
	<div class="intro">
		<div>
			<div class="content">
				<h2>Simple file storage</h2>
				<p>Simplify file storage and boost collaboration with our cloud file storage web app</p>
				<button>Signup now</button>
			</div>
		</div>
		<img src="./home-img.jpg" alt="" />
	</div>
	<!-- <h2>Features</h2> -->
	<div class="anyDevice feature">
		<div>
			<h3>Access your files from <span>any device</span></h3>
			<p>No need for any installations. Just work on the browser</p>
		</div>
		<img src="./anydevice.png" alt="" />
	</div>
	<div class="fileSharing feature">
		<img src="./file-sharing.png" alt="" />
		<div>
			<h3><span>Collaborate</span> with others</h3>
			<p>Share your folders with other users and work on the project together</p>
		</div>
	</div>
	<div class="fileSafety feature">
		<div>
			<h3>Store your files <span>safely</span></h3>
			<p>Data uploaded will only be accessible to you and your trusted collaborators</p>
		</div>
		<img src="./safe-data.png" alt="" />
	</div>
	<div class="prompt">
		<h2>Ready to start working?</h2>
		<div>
			<a href="./signup">Signup Now</a>
			<a href="./me">Go to folder</a>
		</div>
	</div>
</div>

<style>
	button {
		background: none;
		outline: none;
		border: none;

		cursor: pointer;
	}

	a {
		cursor: pointer;
		text-decoration: none;
		color: initial;
	}
	.page {
		--bg: #33477e;
		background: #33477e;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
	}
	img {
		width: 100%;
		max-height: calc(100vh - 4rem);
	}

	nav {
		position: sticky;
		height: 4rem;
		top: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1rem;
		background: rgb(21, 54, 102);
		z-index: 100;
	}

	nav a {
		color: white;
		border: 1px solid white;
		border-radius: 5px;
		padding: 0.5rem 1rem;
		font-size: 1rem;
	}

	.icon {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: white;
		margin-left: 1rem;
		user-select: none;
	}

	.icon span {
		font-size: 3rem;
	}

	.intro {
		position: relative;
		display: flex;
	}

	.intro > div:first-child {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
	}

	.intro .content {
		color: white;
		position: absolute;

		top: 40%;
		left: 3rem;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.intro .content p {
		color: rgb(200, 200, 200);
	}

	.intro .content h2 {
		font-weight: normal;
		font-size: 2.5rem;
	}

	.intro .content button {
		margin-top: 2rem;
		border: 2px solid lightblue;
		color: lightblue;
		border-radius: 5rem;
		padding: 0.5rem 1rem;
		font-size: 1rem;
	}

	.feature {
		display: grid;
		grid-template-columns: 2fr 3fr;
		justify-content: center;
		justify-items: center;
		align-items: center;
		margin-top: 3rem;
		padding: 1rem;
		color: white;

		align-self: center;

		max-width: 1200px;
		width: fit-content;
		text-align: center;
	}

	.feature img {
		width: 100%;
		max-width: 700px;
	}

	.feature h3 {
		font-weight: normal;
		font-size: 2rem;
	}

	.feature h3 span {
		color: lightskyblue;
		font-weight: bold;
	}

	.feature p {
		margin-top: 0.5rem;
		color: rgb(220, 220, 220);
	}

	.fileSharing {
		grid-template-columns: 3fr 2fr;
	}

	.fileSafety {
		grid-template-columns: 2fr 3fr;
	}

	.prompt {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;
		align-items: center;
		color: white;

		align-self: center;

		width: fit-content;
		margin-top: 3rem;
		margin-bottom: 5rem;
	}

	.prompt h2 {
		font-size: 2.5rem;
	}

	.prompt > div {
		margin-top: 1rem;
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 0 0.5rem;
	}

	.prompt a {
		padding: 1rem 1.5rem;
		font-size: 1.2rem;
		border-radius: 5px;
		border: 2px solid lightblue;
		color: lightskyblue;
	}

	.prompt div a:first-child {
		background: white;
		color: var(--bg);
	}
</style>
