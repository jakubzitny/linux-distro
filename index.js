'use strict';
const execa = require('execa');
const getos = require('getos');
const pify = require('pify');

module.exports = () => {
	if (process.platform !== 'linux') {
		return Promise.reject(new Error('Only Linux systems are supported'));
	}

	return execa('lsb_release', ['-a', '--short']).then(res => {
		const stdout = res.stdout.split('\n');

		return {
			os: stdout[0],
			name: stdout[1],
			release: stdout[2],
			code: stdout[3]
		};
	}).catch(() => {
		return pify(getos).then(res => {
			if (!res) {
				res = {}
			}
			if (!res.dist) {
				res.dist = 'Unknown'
			}
			if (!res.release) {
				res.release = 'Unknown'
			}
			if (!res.codename) {
				res.codename = 'Unknown'
			}

			return {
				os: res.dist,
				name: `${res.dist} ${res.release}`,
				release: res.release,
				code: res.codename
			};
		});
	});
};
