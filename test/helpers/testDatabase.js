const fs = require('fs');
const path = require('path');

const TEST_DB_PATH = path.join(__dirname, '../fixtures/test-players.json');

const initialTestData = {
	Players: {
		August: {
			points: 0,
			guesses: [],
		},
		Grace: {
			points: 0,
			guesses: [],
		},
	},
};

function setupTestDatabase() {
	const fixturesDir = path.join(__dirname, '../fixtures');
	if (!fs.existsSync(fixturesDir)) {
		fs.mkdirSync(fixturesDir, { recursive: true });
	}
	fs.writeFileSync(TEST_DB_PATH, JSON.stringify(initialTestData, null, 2));
	return TEST_DB_PATH;
}

function cleanupTestDatabase() {
	if (fs.existsSync(TEST_DB_PATH)) {
		fs.unlinkSync(TEST_DB_PATH);
	}
}

function getTestData() {
	return JSON.parse(fs.readFileSync(TEST_DB_PATH, 'utf8'));
}

function resetTestDatabase() {
	fs.writeFileSync(TEST_DB_PATH, JSON.stringify(initialTestData, null, 2));
}

function createTestDataWithGuesses() {
	const data = {
		Players: {
			August: {
				points: 2,
				guesses: [
					{
						season: '5',
						episode: '10',
						contestant: 'John Doe',
						result: 'win',
						finalWeapon: 'Katana',
					},
					{
						season: '3',
						episode: '8',
						contestant: 'Jane Smith',
						result: 'lose',
						finalWeapon: 'Longsword',
					},
					{
						season: '7',
						episode: '2',
						contestant: 'Bob Johnson',
						result: 'win',
						finalWeapon: 'Axe',
					},
				],
			},
			Grace: {
				points: 1,
				guesses: [
					{
						season: '4',
						episode: '5',
						contestant: 'Alice Wonder',
						result: 'win',
						finalWeapon: 'Sword',
					},
					{
						season: '6',
						episode: '12',
						contestant: 'Charlie Brown',
						result: 'lose',
						finalWeapon: 'Spear',
					},
				],
			},
		},
	};
	fs.writeFileSync(TEST_DB_PATH, JSON.stringify(data, null, 2));
	return data;
}

module.exports = {
	TEST_DB_PATH,
	setupTestDatabase,
	cleanupTestDatabase,
	getTestData,
	resetTestDatabase,
	createTestDataWithGuesses,
	initialTestData,
};
