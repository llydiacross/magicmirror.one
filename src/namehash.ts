let sha3 = require('js-sha3').keccak_256;
let uts46 = require('idna-uts46-hx');
import { Buffer } from 'buffer';

export function namehash(inputName) {
	// Reject empty names:
	let node = '';
	for (let i = 0; i < 32; i++) {
		node += '00';
	}

	let name = normalize(inputName);

	if (name) {
		let labels = name.split('.');

		for (let i = labels.length - 1; i >= 0; i--) {
			let labelSha = sha3(labels[i]);
			node = sha3(new Buffer(node + labelSha, 'hex'));
		}
	}

	return '0x' + node;
}

export function normalize(name) {
	return name
		? uts46.toUnicode(name, { useStd3ASCII: true, transitional: false })
		: name;
}
