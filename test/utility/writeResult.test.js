const { writeResult } = require('../../utility/writeResult');
const { makeGuess } = require('../../utility/makeGuess');
const { writeDb } = require('../../helper/writeDb');
const {
	setupTestDatabase,
	cleanupTestDatabase,
	TEST_DB_PATH,
	getTestData,
} = require('../helpers/testDatabase');

jest.mock('../../helper/writeDb');

describe('writeResult (integration)', () => {
	beforeEach(() => {
		setupTestDatabase();
		jest.clearAllMocks();
		// Mock writeDb to write to test database
		writeDb.mockImplementation((data) => {
			const fs = require('fs');
			fs.writeFileSync(TEST_DB_PATH, JSON.stringify(data, null, 2));
		});
	});

	afterEach(() => {
		cleanupTestDatabase();
	});

	test('should record a win result for August', () => {
		makeGuess('August', 'John Doe', '5', '10', TEST_DB_PATH);
		writeResult('August', 'win', 'Katana', 1, TEST_DB_PATH);

		const data = getTestData();
		const lastGuess = data.Players.August.guesses.at(-1);
		expect(lastGuess.result).toBe('win');
		expect(lastGuess.finalWeapon).toBe('Katana');
		expect(data.Players.August.points).toBe(1);
	});

	test('should record a loss result for Grace', () => {
		makeGuess('Grace', 'Jane Smith', '3', '8', TEST_DB_PATH);
		writeResult('Grace', 'lose', 'Longsword', 0, TEST_DB_PATH);

		const data = getTestData();
		const lastGuess = data.Players.Grace.guesses.at(-1);
		expect(lastGuess.result).toBe('lose');
		expect(lastGuess.finalWeapon).toBe('Longsword');
		expect(data.Players.Grace.points).toBe(0);
	});

	test('should accumulate points for multiple wins', () => {
		makeGuess('August', 'First', '1', '1', TEST_DB_PATH);
		writeResult('August', 'win', 'Sword', 1, TEST_DB_PATH);

		makeGuess('August', 'Second', '2', '2', TEST_DB_PATH);
		writeResult('August', 'win', 'Axe', 1, TEST_DB_PATH);

		makeGuess('August', 'Third', '3', '3', TEST_DB_PATH);
		writeResult('August', 'win', 'Spear', 1, TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.August.points).toBe(3);
		expect(data.Players.August.guesses).toHaveLength(3);
	});

	test('should reset points to 0 when reaching 5', () => {
		makeGuess('August', 'First', '1', '1', TEST_DB_PATH);
		writeResult('August', 'win', 'Sword', 1, TEST_DB_PATH);

		makeGuess('August', 'Second', '2', '2', TEST_DB_PATH);
		writeResult('August', 'win', 'Axe', 1, TEST_DB_PATH);

		makeGuess('August', 'Third', '3', '3', TEST_DB_PATH);
		writeResult('August', 'win', 'Spear', 1, TEST_DB_PATH);

		makeGuess('August', 'Fourth', '4', '4', TEST_DB_PATH);
		writeResult('August', 'win', 'Hammer', 1, TEST_DB_PATH);

		makeGuess('August', 'Fifth', '5', '5', TEST_DB_PATH);
		writeResult('August', 'win', 'Katana', 1, TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.August.points).toBe(0); // Reset after reaching 5
	});

	test('should handle loss without affecting points', () => {
		makeGuess('August', 'Winner', '1', '1', TEST_DB_PATH);
		writeResult('August', 'win', 'Sword', 1, TEST_DB_PATH);

		makeGuess('August', 'Loser', '2', '2', TEST_DB_PATH);
		writeResult('August', 'lose', 'Axe', 0, TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.August.points).toBe(1); // Still 1 from first win
	});

	test('should deduct point for double down loss', () => {
		// Make initial guess
		makeGuess('August', 'John Doe', '5', '10', TEST_DB_PATH);

		// Add secondGuess manually to simulate double down
		const data = getTestData();
		data.Players.August.guesses[0].secondGuess = 'Jane Smith';
		const fs = require('fs');
		fs.writeFileSync(TEST_DB_PATH, JSON.stringify(data, null, 2));

		// Record loss with point = 0 (will be changed to -1 by resultToDb)
		writeResult('August', 'lose', 'Sword', 0, TEST_DB_PATH);

		const finalData = getTestData();
		expect(finalData.Players.August.points).toBe(-1);
	});

	test('should update only last guess when multiple guesses exist', () => {
		makeGuess('Grace', 'First', '1', '1', TEST_DB_PATH);
		writeResult('Grace', 'win', 'Sword', 1, TEST_DB_PATH);

		makeGuess('Grace', 'Second', '2', '2', TEST_DB_PATH);
		writeResult('Grace', 'lose', 'Axe', 0, TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.Grace.guesses[0].result).toBe('win');
		expect(data.Players.Grace.guesses[0].finalWeapon).toBe('Sword');
		expect(data.Players.Grace.guesses[1].result).toBe('lose');
		expect(data.Players.Grace.guesses[1].finalWeapon).toBe('Axe');
		expect(data.Players.Grace.points).toBe(1);
	});

	test('should work correctly for both players independently', () => {
		makeGuess('August', 'August Person', '1', '1', TEST_DB_PATH);
		writeResult('August', 'win', 'Katana', 1, TEST_DB_PATH);

		makeGuess('Grace', 'Grace Person', '2', '2', TEST_DB_PATH);
		writeResult('Grace', 'win', 'Sword', 1, TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.August.points).toBe(1);
		expect(data.Players.Grace.points).toBe(1);
		expect(data.Players.August.guesses[0].contestant).toBe('August Person');
		expect(data.Players.Grace.guesses[0].contestant).toBe('Grace Person');
	});
});
