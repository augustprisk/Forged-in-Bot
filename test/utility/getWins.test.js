const { getWins } = require('../../utility/getWins');
const { makeGuess } = require('../../utility/makeGuess');
const { writeResult } = require('../../utility/writeResult');
const { writeDb } = require('../../helper/writeDb');
const {
	setupTestDatabase,
	cleanupTestDatabase,
	TEST_DB_PATH,
	createTestDataWithGuesses,
} = require('../helpers/testDatabase');

jest.mock('../../helper/writeDb');

describe('getWins (integration)', () => {
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

	test('should return empty array for player with no guesses', async () => {
		const wins = await getWins('August', TEST_DB_PATH);
		expect(wins).toEqual([]);
		expect(Array.isArray(wins)).toBe(true);
	});

	test('should return wins for August', async () => {
		await makeGuess('August', 'John Doe', '5', '10', TEST_DB_PATH);
		await writeResult('August', 'win', 'Katana', 1, TEST_DB_PATH);

		const wins = await getWins('August', TEST_DB_PATH);
		expect(wins).toHaveLength(1);
		expect(wins[0]).toEqual({
			season: '5',
			episode: '10',
			contestant: 'John Doe',
			result: 'win',
			finalWeapon: 'Katana',
		});
	});

	test('should return wins for Grace', async () => {
		await makeGuess('Grace', 'Jane Smith', '3', '8', TEST_DB_PATH);
		await writeResult('Grace', 'win', 'Sword', 1, TEST_DB_PATH);

		const wins = await getWins('Grace', TEST_DB_PATH);
		expect(wins).toHaveLength(1);
		expect(wins[0].contestant).toBe('Jane Smith');
	});

	test('should return only wins, not losses', async () => {
		await makeGuess('August', 'Winner', '1', '1', TEST_DB_PATH);
		await writeResult('August', 'win', 'Sword', 1, TEST_DB_PATH);

		await makeGuess('August', 'Loser', '2', '2', TEST_DB_PATH);
		await writeResult('August', 'lose', 'Axe', 0, TEST_DB_PATH);

		await makeGuess('August', 'Another Winner', '3', '3', TEST_DB_PATH);
		await writeResult('August', 'win', 'Spear', 1, TEST_DB_PATH);

		const wins = await getWins('August', TEST_DB_PATH);
		expect(wins).toHaveLength(2);
		expect(wins[0].contestant).toBe('Winner');
		expect(wins[1].contestant).toBe('Another Winner');
		expect(wins.every((win) => win.result === 'win')).toBe(true);
	});

	test('should not include pending guesses (null result)', async () => {
		await makeGuess('Grace', 'Winner', '1', '1', TEST_DB_PATH);
		await writeResult('Grace', 'win', 'Sword', 1, TEST_DB_PATH);

		await makeGuess('Grace', 'Pending', '2', '2', TEST_DB_PATH);
		// Don't write result for this one

		const wins = await getWins('Grace', TEST_DB_PATH);
		expect(wins).toHaveLength(1);
		expect(wins[0].contestant).toBe('Winner');
	});

	test('should return multiple wins in correct order', async () => {
		await makeGuess('August', 'First Win', '1', '1', TEST_DB_PATH);
		await writeResult('August', 'win', 'Sword', 1, TEST_DB_PATH);

		await makeGuess('August', 'Second Win', '2', '2', TEST_DB_PATH);
		await writeResult('August', 'win', 'Axe', 1, TEST_DB_PATH);

		await makeGuess('August', 'Third Win', '3', '3', TEST_DB_PATH);
		await writeResult('August', 'win', 'Spear', 1, TEST_DB_PATH);

		const wins = await getWins('August', TEST_DB_PATH);
		expect(wins).toHaveLength(3);
		expect(wins[0].contestant).toBe('First Win');
		expect(wins[1].contestant).toBe('Second Win');
		expect(wins[2].contestant).toBe('Third Win');
	});

	test('should work with pre-populated test data', async () => {
		createTestDataWithGuesses();

		const augustWins = await getWins('August', TEST_DB_PATH);
		const graceWins = await getWins('Grace', TEST_DB_PATH);

		expect(augustWins).toHaveLength(2);
		expect(augustWins[0].contestant).toBe('John Doe');
		expect(augustWins[1].contestant).toBe('Bob Johnson');

		expect(graceWins).toHaveLength(1);
		expect(graceWins[0].contestant).toBe('Alice Wonder');
	});

	test('should return empty array when player has only losses', async () => {
		await makeGuess('Grace', 'First Loss', '1', '1', TEST_DB_PATH);
		await writeResult('Grace', 'lose', 'Sword', 0, TEST_DB_PATH);

		await makeGuess('Grace', 'Second Loss', '2', '2', TEST_DB_PATH);
		await writeResult('Grace', 'lose', 'Axe', 0, TEST_DB_PATH);

		const wins = await getWins('Grace', TEST_DB_PATH);
		expect(wins).toEqual([]);
	});

	test('should include all win properties', async () => {
		await makeGuess('August', 'Test Contestant', '7', '14', TEST_DB_PATH);
		await writeResult('August', 'win', 'Test Weapon', 1, TEST_DB_PATH);

		const wins = await getWins('August', TEST_DB_PATH);
		expect(wins[0]).toHaveProperty('season');
		expect(wins[0]).toHaveProperty('episode');
		expect(wins[0]).toHaveProperty('contestant');
		expect(wins[0]).toHaveProperty('result');
		expect(wins[0]).toHaveProperty('finalWeapon');
		expect(wins[0].season).toBe('7');
		expect(wins[0].episode).toBe('14');
		expect(wins[0].finalWeapon).toBe('Test Weapon');
	});

	test('should track wins independently for both players', async () => {
		await makeGuess('August', 'August Win', '1', '1', TEST_DB_PATH);
		await writeResult('August', 'win', 'Katana', 1, TEST_DB_PATH);

		await makeGuess('Grace', 'Grace Win 1', '2', '2', TEST_DB_PATH);
		await writeResult('Grace', 'win', 'Sword', 1, TEST_DB_PATH);

		await makeGuess('Grace', 'Grace Win 2', '3', '3', TEST_DB_PATH);
		await writeResult('Grace', 'win', 'Axe', 1, TEST_DB_PATH);

		const augustWins = await getWins('August', TEST_DB_PATH);
		const graceWins = await getWins('Grace', TEST_DB_PATH);

		expect(augustWins).toHaveLength(1);
		expect(graceWins).toHaveLength(2);
	});
});
