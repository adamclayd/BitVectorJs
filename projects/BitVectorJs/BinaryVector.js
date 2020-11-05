class BitVectotor {
	#bitsPerSlot;
	#bitshift;
	#bitmask;
	#bits;
	#flags;
	
	constructor(numbits) {
		numbits = numbits || 1;

		if(typeof numbits !== 'number' || isNaN(numbits)) {
			throw '';
		}
		else {
			this.#flags = {};
			this.#bitsPerSlot = 64;
			this.#bitshift = 6;
			this.#bitmask = 63;
			this.#bits = [];
			let slots = (numbits + this.#bitmask) >> this.#bitshift;
			for(let i = 0; i < slots; i++) {
				this.#bits.push(0);
			}
		}
	}
	
	/**
	 * Set a bit to 1
	 * @param key string|integer the index of the bit to set
	 *        or the string that is associated to the bit to set
	 */
	setBit(key) {
		if(key || key === 0) {
			
			if(Number.isInteger(key)) {
				if(this.#bitInRange(key)) {
					this.#bits[Math.floor(key >> this.#bitshift)] |= (1 << (Math.floor(key & this.#bitmask)));
				}
				else {
					throw 'Bit is out of range';
				}
			}
			else if(typeof key === 'string') {
				if(!this.#flags[key]) {
					throw 'String parmaeter \'key\' is not associated to a bit'; 
				}
				
				this.setBit(this.#flags[key]); 
			}
			else {
				throw 'Accepted values for parameter \'key\' are string or integer';
			}
		}
		else {
			throw 'Parameter \'key\' was not given';
		}
	}
	
	/**
	 * Set a bit to 0
	 * @param key string|integer the index of the bit to clear or
	 *        the string value to an associated bit
	 */
	clearBit(key) {
		if(key || key === 0) {
			if(Number.isInteger(key)) {
				if(this.#bitInRange(key)) {
					this.#bits[Math.floor(key >> this.#bitshift)] &= ~(1 << (Math.floor(key & this.#bitmask)));
				}
				else {
					throw 'Bit is out of range';
				}
			}
			else if(typeof key === 'string'){
				if(!this.#flags[key]) {
					throw 'key is not associated with a bit in the bit vector';
				}
				
				this.clearBit(this.#flags[key]);
			}
		}
		else {
			throw 'Parameter \'key\' not given';
		}
	}
	
	/**
	 * Set all bits to 0
	 */
	clearAll() {
		for(let i = 0; i < this.#bits.length; i++) {
			this.#bits[i] = 0;
		}
	}
	
	/**
	 * Add n number of 64 bit slots to the bit vector
	 * @param n number of slots to adda to the bit vector.
	 *        the default value is 1
	 */
	addSlots(n) {
		n = n || 1;
		
		if(typeof n !== 'number' || Number.isInteger(n)) {
			throw 'Param \'n\' must be an integer';
		}
		
		for (let i = 0; i < n; i++) {
			this.#bits.push(0);
		}
	}
	
	/**
	 * Associate a bit in the bit vector with a key
	 * so that the bit can be later referenced with a string
	 * @param key string to associate with a bit
	 * @param bitIndex the index of the bit vector
	 */
	assocFlag(key, bitIndex) {
		if(!key || typeof key !== 'string') {
			throw 'Param \'key\' is not a string';
		}
		else if(!bitIndex || typeof bitIndex !== 'number' && !Number.isInteger(bitIndex)) {
			throw 'Parameter \'bitIndex\' is not an integer';
		}
		else if (!this.#bitInRange(bitIndex)) {
			throw 'Parameter \'bitIndex\' is out of range of the bit vector';
		}
		
		this.#flags[key] = bitIndex;
	}
	
	/**
	 * Removes the association between a key string and
	 * a bit in the bit vector
	 * @param key the associated string to remove
	 */
	unflagBit(key) {
		if(!key || typeof key !== 'string') {
			throw 'Parameter \'key\' is not a string.'
		}
		else if(!this.#flags[key]) {
			throw 'The given key is not associated to a bit in the bit vector.';
		}
		
		this.#flags[key] = null;
		this.#flags[key] = undefined;
		delete this.#flags[key];
	}
	
	/**
	 * Checks if a bit is set or not
     * @param key string|integer the index of the bit to check or 
	 *        the string value of a flagged bit
	 *
	 * @return boolean the bit value of the associated bit
	 */
	isSet(key) {
		if(key || key === 0) {
			if(typeof key === 'string') {
				if (!this.#flags[key]) {
					throw 'key is not associated to a bit in the bit vector.'
				}
				
				return this.isSet(this.#flags[key]);
			}
			else if(Number.isInteger(key)) {
				if(!this.#bitInRange(key)) {
					throw 'Bit is out of range of the bit vector';
				}
				
				return new Boolean((this.#bits[Math.floor(key >> this.#bitshift)] & (1 << (Math.floor(key & this.#bitmask))))).valueOf();
			}
			else {
				throw 'Parmeter \'key\' can only be a string or an integer'; 
			}
		}
		else {
			throw 'Parameter \'key\' not given';
		}
	}
	
	log(){
		console.log(this.#bits);
	}
	
	#bitInRange(bit) {
			return (bit < this.#numBits());
	}
	
	#numBits() {
		return this.#bitsPerSlot * this.#bits.length;
	}
	
	#destroy() {
		for(let i = 0; i < this.#bits.length; i++) {
			this.#bits[i] = 0;
			this.#bits.pop();
		}
		
		for(prop in this.#flags) {
			this.#flags[prop] = null;
			this.#flags[prop] = undefined;
			delete this.#flags[prop];
		}
		
		this.#bitsPerSlot = null;
		this.#bitshift = null;
		this.#bitmask = null;
		this.#bits = null;
	}
}