const { makeGuess } = require('../../utility/makeGuess');
const { writeDb } = require('../../helper/writeDb');
const {
	setupTestDatabase,
	cleanupTestDatabase,
	TEST_DB_PATH,
	getTestData,
} = require('../helpers/testDatabase');

jest.mock('../../helper/writeDb');

describe('makeGuess (integration)', () => {
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

	test('should add a guess for August to the database', async () => {
		await makeGuess('August', 'John Doe', '5', '10', TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.August.guesses).toHaveLength(1);
		expect(data.Players.August.guesses[0]).toEqual({
			season: '5',
			episode: '10',
			contestant: 'John Doe',
			result: null,
			finalWeapon: null,
		});
	});

	test('should add a guess for Grace to the database', async () => {
		await makeGuess('Grace', 'Jane Smith', '3', '8', TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.Grace.guesses).toHaveLength(1);
		expect(data.Players.Grace.guesses[0]).toEqual({
			season: '3',
			episode: '8',
			contestant: 'Jane Smith',
			result: null,
			finalWeapon: null,
		});
	});

	test('should add multiple guesses for the same player', async () => {
		await makeGuess('August', 'First Contestant', '1', '1', TEST_DB_PATH);
		await makeGuess('August', 'Second Contestant', '2', '2', TEST_DB_PATH);
		await makeGuess('August', 'Third Contestant', '3', '3', TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.August.guesses).toHaveLength(3);
		expect(data.Players.August.guesses[0].contestant).toBe('First Contestant');
		expect(data.Players.August.guesses[1].contestant).toBe('Second Contestant');
		expect(data.Players.August.guesses[2].contestant).toBe('Third Contestant');
	});

	test('should not affect other player when adding guess', async () => {
		await makeGuess('August', 'John Doe', '5', '10', TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.Grace.guesses).toHaveLength(0);
		expect(data.Players.Grace.points).toBe(0);
	});

	test('should handle different season and episode formats', async () => {
		await makeGuess('Grace', 'Test Name', '10', '25', TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.Grace.guesses[0].season).toBe('10');
		expect(data.Players.Grace.guesses[0].episode).toBe('25');
	});

	test('should initialize guess with null result and weapon', async () => {
		await makeGuess('August', 'New Person', '7', '14', TEST_DB_PATH);

		const data = getTestData();
		const guess = data.Players.August.guesses[0];
		expect(guess.result).toBeNull();
		expect(guess.finalWeapon).toBeNull();
	});

	test('should persist data across multiple operations', async () => {
		await makeGuess('August', 'First', '1', '1', TEST_DB_PATH);
		const dataAfterFirst = getTestData();
		expect(dataAfterFirst.Players.August.guesses).toHaveLength(1);

		await makeGuess('Grace', 'Second', '2', '2', TEST_DB_PATH);
		const dataAfterSecond = getTestData();
		expect(dataAfterSecond.Players.August.guesses).toHaveLength(1);
		expect(dataAfterSecond.Players.Grace.guesses).toHaveLength(1);
	});
});
