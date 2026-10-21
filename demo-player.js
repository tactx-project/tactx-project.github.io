document.querySelectorAll(".demo-card").forEach((card) => {
	const video = card.querySelector("video");
	const title = card.querySelector("h3").textContent;
	const controls = document.createElement("div");
	controls.className = "demo-controls";
	controls.innerHTML = `
		<button class="demo-play" type="button">Play</button>
		<input class="demo-seek" type="range" min="0" max="1" step="0.1" value="0" disabled>
		<span class="demo-time">0:00 / 0:00</span>
	`;
	const playButton = controls.querySelector("button");
	const seek = controls.querySelector("input");
	const time = controls.querySelector("span");
	seek.setAttribute("aria-label", `Seek ${title} video`);

	const formatTime = (seconds) => {
		const total = Math.max(0, Math.floor(seconds || 0));
		return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
	};

	const updatePlayback = () => {
		const action = video.paused ? "Play" : "Pause";
		playButton.textContent = action;
		playButton.setAttribute("aria-label", `${action} ${title} video`);
	};

	const updateTime = () => {
		const duration = Number.isFinite(video.duration) ? video.duration : 0;
		seek.disabled = duration <= 0;
		seek.max = duration || 1;
		seek.value = video.currentTime;
		const current = formatTime(video.currentTime);
		const end = formatTime(duration);
		time.textContent = `${current} / ${end}`;
		seek.setAttribute("aria-valuetext", `${current} of ${end}`);
	};

	playButton.addEventListener("click", () => {
		if (video.paused) {
			video.play().catch(updatePlayback);
		} else {
			video.pause();
		}
	});
	seek.addEventListener("input", () => {
		if (Number.isFinite(video.duration)) {
			video.currentTime = Number(seek.value);
			updateTime();
		}
	});
	["play", "pause", "ended"].forEach((event) => video.addEventListener(event, updatePlayback));
	["loadedmetadata", "durationchange", "timeupdate", "seeked"].forEach((event) => video.addEventListener(event, updateTime));

	video.insertAdjacentElement("afterend", controls);
	video.controls = false;
	updatePlayback();
	updateTime();
});
