const { doubleDownGuess } = require('../../utility/doubleDownGuess');
const { makeGuess } = require('../../utility/makeGuess');
const { writeResult } = require('../../utility/writeResult');
const { writeDb } = require('../../helper/writeDb');
const {
	setupTestDatabase,
	cleanupTestDatabase,
	TEST_DB_PATH,
	getTestData,
} = require('../helpers/testDatabase');

jest.mock('../../helper/writeDb');

describe('doubleDownGuess (integration)', () => {
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

	test('should add secondGuess to August\'s last guess', async () => {
		await makeGuess('August', 'John Doe', '5', '10', TEST_DB_PATH);
		await doubleDownGuess('August', 'Jane Smith', TEST_DB_PATH);

		const data = getTestData();
		const lastGuess = data.Players.August.guesses.at(-1);
		expect(lastGuess.secondGuess).toBe('Jane Smith');
		expect(lastGuess.contestant).toBe('John Doe');
	});

	test('should add secondGuess to Grace\'s last guess', async () => {
		await makeGuess('Grace', 'Alice Wonder', '3', '8', TEST_DB_PATH);
		await doubleDownGuess('Grace', 'Bob Johnson', TEST_DB_PATH);

		const data = getTestData();
		const lastGuess = data.Players.Grace.guesses.at(-1);
		expect(lastGuess.secondGuess).toBe('Bob Johnson');
		expect(lastGuess.contestant).toBe('Alice Wonder');
	});

	test('should only affect last guess when multiple guesses exist', async () => {
		await makeGuess('August', 'First', '1', '1', TEST_DB_PATH);
		await makeGuess('August', 'Second', '2', '2', TEST_DB_PATH);
		await makeGuess('August', 'Third', '3', '3', TEST_DB_PATH);

		await doubleDownGuess('August', 'New Contestant', TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.August.guesses[0].secondGuess).toBeUndefined();
		expect(data.Players.August.guesses[1].secondGuess).toBeUndefined();
		expect(data.Players.August.guesses[2].secondGuess).toBe('New Contestant');
	});

	test('should not affect other properties of the guess', async () => {
		await makeGuess('Grace', 'Original Contestant', '7', '15', TEST_DB_PATH);
		await doubleDownGuess('Grace', 'New Contestant', TEST_DB_PATH);

		const data = getTestData();
		const lastGuess = data.Players.Grace.guesses.at(-1);
		expect(lastGuess.season).toBe('7');
		expect(lastGuess.episode).toBe('15');
		expect(lastGuess.contestant).toBe('Original Contestant');
		expect(lastGuess.result).toBeNull();
		expect(lastGuess.finalWeapon).toBeNull();
		expect(lastGuess.secondGuess).toBe('New Contestant');
	});

	test('should work before result is recorded', async () => {
		await makeGuess('August', 'First Guess', '5', '10', TEST_DB_PATH);
		await doubleDownGuess('August', 'Second Guess', TEST_DB_PATH);
		await writeResult('August', 'Second Guess', 'Katana', 1, TEST_DB_PATH);

		const data = getTestData();
		const lastGuess = data.Players.August.guesses.at(-1);
		expect(lastGuess.secondGuess).toBe('Second Guess');
		expect(lastGuess.result).toBe('win');
		expect(data.Players.August.points).toBe(1);
	});

	test('should result in point deduction when double down guess loses', async () => {
		await makeGuess('August', 'First Guess', '5', '10', TEST_DB_PATH);
		await writeResult('August', 'win', 'Sword', 1, TEST_DB_PATH);

		await makeGuess('August', 'Second Guess', '6', '11', TEST_DB_PATH);
		await doubleDownGuess('August', 'Wrong Guess', TEST_DB_PATH);
		await writeResult('August', 'lose', 'Axe', 0, TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.August.points).toBe(0); // 1 + (-1) = 0
	});

	test('should overwrite existing secondGuess', async () => {
		await makeGuess('Grace', 'Original', '1', '1', TEST_DB_PATH);
		await doubleDownGuess('Grace', 'First Double Down', TEST_DB_PATH);
		await doubleDownGuess('Grace', 'Second Double Down', TEST_DB_PATH);

		const data = getTestData();
		const lastGuess = data.Players.Grace.guesses.at(-1);
		expect(lastGuess.secondGuess).toBe('Second Double Down');
	});

	test('should not affect other player', async () => {
		await makeGuess('August', 'August Guess', '1', '1', TEST_DB_PATH);
		await makeGuess('Grace', 'Grace Guess', '2', '2', TEST_DB_PATH);

		await doubleDownGuess('August', 'August Double Down', TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.August.guesses[0].secondGuess).toBe(
			'August Double Down'
		);
		expect(data.Players.Grace.guesses[0].secondGuess).toBeUndefined();
	});

	test('should persist across operations', async () => {
		await makeGuess('August', 'First', '1', '1', TEST_DB_PATH);
		await doubleDownGuess('August', 'First DD', TEST_DB_PATH);

		let data = getTestData();
		expect(data.Players.August.guesses[0].secondGuess).toBe('First DD');

		await makeGuess('August', 'Second', '2', '2', TEST_DB_PATH);

		data = getTestData();
		expect(data.Players.August.guesses[0].secondGuess).toBe('First DD');
		expect(data.Players.August.guesses[1].secondGuess).toBeUndefined();
	});

	test('should work in complete game flow', async () => {
		// First round - normal win
		await makeGuess('Grace', 'Round 1 Guess', '1', '1', TEST_DB_PATH);
		await writeResult('Grace', 'Round 1 Guess', 'Sword', 1, TEST_DB_PATH);

		// Second round - double down win
		await makeGuess('Grace', 'Round 2 First', '2', '2', TEST_DB_PATH);
		await doubleDownGuess('Grace', 'Round 2 Second', TEST_DB_PATH);
		await writeResult('Grace', 'Round 2 Second', 'Axe', 1, TEST_DB_PATH);

		// Third round - double down loss
		await makeGuess('Grace', 'Round 3 First', '3', '3', TEST_DB_PATH);
		await doubleDownGuess('Grace', 'Round 3 Second', TEST_DB_PATH);
		await writeResult('Grace', 'Round 3 Third', 'Spear', 0, TEST_DB_PATH);

		const data = getTestData();
		expect(data.Players.Grace.guesses).toHaveLength(3);
		expect(data.Players.Grace.guesses[0].secondGuess).toBeUndefined();
		expect(data.Players.Grace.guesses[1].secondGuess).toBe('Round 2 Second');
		expect(data.Players.Grace.guesses[2].secondGuess).toBe('Round 3 Second');
		expect(data.Players.Grace.points).toBe(1); // 1 + 1 - 1 = 1
	});
});
