const { getPoints } = require('../../utility/getPoints');
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

describe('getPoints (integration)', () => {
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

	test('should return 0 points for new player', () => {
		const points = getPoints('August', TEST_DB_PATH);
		expect(points).toBe(0);
	});

	test('should return correct points for August', () => {
		makeGuess('August', 'John Doe', '5', '10', TEST_DB_PATH);
		writeResult('August', 'win', 'Katana', 1, TEST_DB_PATH);

		const points = getPoints('August', TEST_DB_PATH);
		expect(points).toBe(1);
	});

	test('should return correct points for Grace', () => {
		makeGuess('Grace', 'Jane Smith', '3', '8', TEST_DB_PATH);
		writeResult('Grace', 'win', 'Sword', 1, TEST_DB_PATH);

		makeGuess('Grace', 'Bob Johnson', '4', '9', TEST_DB_PATH);
		writeResult('Grace', 'win', 'Axe', 1, TEST_DB_PATH);

		const points = getPoints('Grace', TEST_DB_PATH);
		expect(points).toBe(2);
	});

	test('should return correct points after multiple wins', () => {
		makeGuess('August', 'First', '1', '1', TEST_DB_PATH);
		writeResult('August', 'win', 'Sword', 1, TEST_DB_PATH);

		makeGuess('August', 'Second', '2', '2', TEST_DB_PATH);
		writeResult('August', 'win', 'Axe', 1, TEST_DB_PATH);

		makeGuess('August', 'Third', '3', '3', TEST_DB_PATH);
		writeResult('August', 'win', 'Spear', 1, TEST_DB_PATH);

		const points = getPoints('August', TEST_DB_PATH);
		expect(points).toBe(3);
	});

	test('should return 0 points after reset at 5', () => {
		// Add 5 wins to trigger reset
		for (let i = 1; i <= 5; i++) {
			makeGuess('August', `Contestant ${i}`, `${i}`, `${i}`, TEST_DB_PATH);
			writeResult('August', 'win', 'Weapon', 1, TEST_DB_PATH);
		}

		const points = getPoints('August', TEST_DB_PATH);
		expect(points).toBe(0);
	});

	test('should return correct points after losses', () => {
		makeGuess('Grace', 'Winner', '1', '1', TEST_DB_PATH);
		writeResult('Grace', 'win', 'Sword', 1, TEST_DB_PATH);

		makeGuess('Grace', 'Loser', '2', '2', TEST_DB_PATH);
		writeResult('Grace', 'lose', 'Axe', 0, TEST_DB_PATH);

		const points = getPoints('Grace', TEST_DB_PATH);
		expect(points).toBe(1); // Loss doesn't reduce points (unless double down)
	});

	test('should return correct points from pre-populated data', () => {
		createTestDataWithGuesses();

		const augustPoints = getPoints('August', TEST_DB_PATH);
		const gracePoints = getPoints('Grace', TEST_DB_PATH);

		expect(augustPoints).toBe(2);
		expect(gracePoints).toBe(1);
	});

	test('should return negative points after double down loss', () => {
		makeGuess('August', 'First', '1', '1', TEST_DB_PATH);
		writeResult('August', 'win', 'Sword', 1, TEST_DB_PATH);

		makeGuess('August', 'Second', '2', '2', TEST_DB_PATH);

		// Simulate double down
		const fs = require('fs');
		const data = JSON.parse(fs.readFileSync(TEST_DB_PATH, 'utf8'));
		data.Players.August.guesses[1].secondGuess = 'Wrong Guess';
		fs.writeFileSync(TEST_DB_PATH, JSON.stringify(data, null, 2));

		writeResult('August', 'lose', 'Axe', 0, TEST_DB_PATH);

		const points = getPoints('August', TEST_DB_PATH);
		expect(points).toBe(0); // 1 + (-1) = 0
	});

	test('should track points independently for both players', () => {
		makeGuess('August', 'August Win', '1', '1', TEST_DB_PATH);
		writeResult('August', 'win', 'Katana', 1, TEST_DB_PATH);

		makeGuess('Grace', 'Grace Win', '2', '2', TEST_DB_PATH);
		writeResult('Grace', 'win', 'Sword', 1, TEST_DB_PATH);

		makeGuess('Grace', 'Grace Win 2', '3', '3', TEST_DB_PATH);
		writeResult('Grace', 'win', 'Axe', 1, TEST_DB_PATH);

		const augustPoints = getPoints('August', TEST_DB_PATH);
		const gracePoints = getPoints('Grace', TEST_DB_PATH);

		expect(augustPoints).toBe(1);
		expect(gracePoints).toBe(2);
	});
});
