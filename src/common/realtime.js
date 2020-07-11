import moment from "moment";

class Realtime {
	constructor(name) {
		this.name = name;
		this.started = false;
	}

	setInterval(callback, refreshInterval) {
		this.callback = callback;
		this.refreshInterval = refreshInterval;
		return this;
	}

	refresh() {
		this.callback();
		console.log(`[${moment().format()}][${this.name}] Realtime- refreshed`);
		return this;
	}

	start(refreshOnStart = false) {
		if (this.started) {
			return console.error(`[${moment().format()}][${this.name}] Realtime - tried to start twice or more`);
		}
		this.started = true;
		console.log(`[${moment().format()}][${this.name}] Realtime - started`);

		if (refreshOnStart) this.refresh();
		this.next(); // loop

		return this;
	}

	next() {
		this.setTimeoutId = setTimeout(() => {
			this.animationId = requestAnimationFrame(() => {
				this.refresh();
				this.next();
			});
		}, this.refreshInterval);
	}

	stop() {
		clearTimeout(this.setTimeoutId);
		cancelAnimationFrame(this.animationId);
		this.started = false;
		console.log(`[${moment().format()}][${this.name}] Realtime - stopped`);
		return this;
	}
}

export default Realtime;
