module.exports = {
	testEnvironment: 'node',
	coverageDirectory: 'coverage',
	collectCoverageFrom: [
		'commands/**/*.js',
		'services/**/*.js',
		'utility/**/*.js',
		'helper/**/*.js',
		'!**/node_modules/**',
	],
	testMatch: [
		'**/test/**/*.test.js',
	],
	verbose: true,
};
