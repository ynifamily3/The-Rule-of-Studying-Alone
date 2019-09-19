class Queue {
	constructor() {
		this.first = null;
		this.last = null;
		this.size = 0;
	}

	push(value) {
		if(this.first == null) {
			this.first = this.last = {
				value,
				next: null
			};
		}
		else {
			this.last = this.last.next = {
				value,
				next: null
			};
		}
		++this.size;
		return value;
	}

	pop() {
		if(!this.first)
			return null;
		let out = this.first.value;
		this.first = this.first.next;
		if(this.first == null)
			this.last = null;
		--this.size;
		return out;
	}

	front() {
		if(this.empty())
			return null;
		return this.first.value;
	}

	back() {
		if(this.empty())
			return null;
		return this.last.value;
	}

	empty() {
		return this.first == null;
	}
};

module.exports = Queue;