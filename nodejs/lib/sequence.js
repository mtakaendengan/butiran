/*
	sequence.js
	An object for storing sequence of periodic values
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180519
	Create this object as part of generator in butiran.
*/

// Define class of Sequence
module.exports = class Sequence {
	
	// Define constructor
	constructor() {
		// Define default periodic values in one period
		this.value = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1];
		this.pos = 0;
		
		// Change default value if given as arguments
		if(arguments.length == 1) {
			this.value = arguments[0];
		}
		
		// Calculate length of sequence
		this.end = this.value.length;
	}
	
	// Get value and increase pos by one
	ping() {
		var value = this.value[this.pos];
		this.pos++;
		if(this.pos == this.end) {
			this.pos = 0;
		}
		return value;
	}
}
