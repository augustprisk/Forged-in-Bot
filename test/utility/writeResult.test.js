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
		writeDb.mockImplementation((fileName, data) => {
			const fs = require('fs');
			fs.writeFileSync(TEST_DB_PATH, JSON.stringify(data, null, 2));
		});
	});

	afterEach(() => {
		cleanupTestDatabase();
	});

	test('should record a win result for August', async () => {
		await makeGuess('August', 'John Doe', '5', '10', TEST_DB_PATH);
		await writeResult('August', 'John Doe', 'Katana', 1, TEST_DB_PATH);

		const data = getTestData();
		const lastGuess = data.Players.August.guesses.at(-1);
		expect(lastGuess.result).toBe('win');
		expect(lastGuess.finalWeapon).toBe('Katana');
		expect(data.Players.August.points).toBe(1);
	});

	test('should record a loss result for Grace', async () => {
		await makeGuess('Grace', 'Jane Smith', '3', '8', TEST_DB_PATH);
		await writeResult('Grace', 'Janet Smith', 'Longsword', 0, TEST_DB_PATH);

		const data = getTestData();
		const lastGuess = data.Players.Grace.guesses.at(-1);
		expect(lastGuess.result).toBe('lose');
		expect(lastGuess.finalWeapon).toBe('Longsword');
		expect(data.Players.Grace.points).toBe(0);
	});

	test('should accumulate points for multiple wins', async () => {
		await makeGuess('August', 'First', '1', '1', TEST_DB_PATH);
		await writeResult('August', 'First', 'Sword', 1, TEST_DB_PATH);

		await makeGuess('August', 'Second', '2', '2', TEST_DB_PATH);
		await writeResult('August', 'Second', 'Axe', 1, TEST_DB_PATH);

		await makeGuess('August', 'Third', '3', '3', TEST_DB_PATH);
		await writeResult('August', 'Third', 'Spear', 1, TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.August.points).toBe(3);
		expect(data.Players.August.guesses).toHaveLength(3);
	});

	test('should reset points to 0 when reaching 5', async () => {
		await makeGuess('August', 'First', '1', '1', TEST_DB_PATH);
		await writeResult('August', 'First', 'Sword', 1, TEST_DB_PATH);

		await makeGuess('August', 'Second', '2', '2', TEST_DB_PATH);
		await writeResult('August', 'Second', 'Axe', 1, TEST_DB_PATH);

		await makeGuess('August', 'Third', '3', '3', TEST_DB_PATH);
		await writeResult('August', 'Third', 'Spear', 1, TEST_DB_PATH);

		await makeGuess('August', 'Fourth', '4', '4', TEST_DB_PATH);
		await writeResult('August', 'Fourth', 'Hammer', 1, TEST_DB_PATH);

		await makeGuess('August', 'Fifth', '5', '5', TEST_DB_PATH);
		await writeResult('August', 'Fifth', 'Katana', 1, TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.August.points).toBe(0); // Reset after reaching 5
	});

	test('should handle loss without affecting points', async () => {
		await makeGuess('August', 'Winner', '1', '1', TEST_DB_PATH);
		await writeResult('August', 'Winner', 'Sword', 1, TEST_DB_PATH);

		await makeGuess('August', 'Loser', '2', '2', TEST_DB_PATH);
		await writeResult('August', 'Lose', 'Axe', 0, TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.August.points).toBe(1); // Still 1 from first win
	});

	test('should deduct point for double down loss', async () => {
		await makeGuess('August', 'John Doe', '5', '10', TEST_DB_PATH);

		// Add secondGuess manually to simulate double down
		const data = getTestData();
		data.Players.August.guesses[0].secondGuess = 'Jane Smith';
		const fs = require('fs');
		fs.writeFileSync(TEST_DB_PATH, JSON.stringify(data, null, 2));

		await writeResult('August', 'lose', 'Sword', 0, TEST_DB_PATH);

		const finalData = getTestData();
		expect(finalData.Players.August.points).toBe(-1);
	});

	test('should update only last guess when multiple guesses exist', async () => {
		await makeGuess('Grace', 'First', '1', '1', TEST_DB_PATH);
		await writeResult('Grace', 'First', 'Sword', 1, TEST_DB_PATH);

		await makeGuess('Grace', 'Second', '2', '2', TEST_DB_PATH);
		await writeResult('Grace', 'lose', 'Axe', 0, TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.Grace.guesses[0].result).toBe('win');
		expect(data.Players.Grace.guesses[0].finalWeapon).toBe('Sword');
		expect(data.Players.Grace.guesses[1].result).toBe('lose');
		expect(data.Players.Grace.guesses[1].finalWeapon).toBe('Axe');
		expect(data.Players.Grace.points).toBe(1);
	});

	test('should work correctly for both players independently', async () => {
		await makeGuess('August', 'August Person', '1', '1', TEST_DB_PATH);
		await writeResult('August', 'win', 'Katana', 1, TEST_DB_PATH);

		await makeGuess('Grace', 'Grace Person', '2', '2', TEST_DB_PATH);
		await writeResult('Grace', 'win', 'Sword', 1, TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.August.points).toBe(1);
		expect(data.Players.Grace.points).toBe(1);
		expect(data.Players.August.guesses[0].contestant).toBe('August Person');
		expect(data.Players.Grace.guesses[0].contestant).toBe('Grace Person');
	});
});
