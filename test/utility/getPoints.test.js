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
		writeDb.mockImplementation((fileName, data) => {
			const fs = require('fs');
			fs.writeFileSync(TEST_DB_PATH, JSON.stringify(data, null, 2));
		});
	});

	afterEach(() => {
		cleanupTestDatabase();
	});

	test('should return 0 points for new player', async () => {
		const points = await getPoints('August', TEST_DB_PATH);
		expect(points).toBe(0);
	});

	test('should return correct points for August', async () => {
		await makeGuess('August', 'John Doe', '5', '10', TEST_DB_PATH);
		await writeResult('August', 'win', 'Katana', 1, TEST_DB_PATH);

		const points = await getPoints('August', TEST_DB_PATH);
		expect(points).toBe(1);
	});

	test('should return correct points for Grace', async () => {
		await makeGuess('Grace', 'Jane Smith', '3', '8', TEST_DB_PATH);
		await writeResult('Grace', 'win', 'Sword', 1, TEST_DB_PATH);

		await makeGuess('Grace', 'Bob Johnson', '4', '9', TEST_DB_PATH);
		await writeResult('Grace', 'win', 'Axe', 1, TEST_DB_PATH);

		const points = await getPoints('Grace', TEST_DB_PATH);
		expect(points).toBe(2);
	});

	test('should return correct points after multiple wins', async () => {
		await makeGuess('August', 'First', '1', '1', TEST_DB_PATH);
		await writeResult('August', 'win', 'Sword', 1, TEST_DB_PATH);

		await makeGuess('August', 'Second', '2', '2', TEST_DB_PATH);
		await writeResult('August', 'win', 'Axe', 1, TEST_DB_PATH);

		await makeGuess('August', 'Third', '3', '3', TEST_DB_PATH);
		await writeResult('August', 'win', 'Spear', 1, TEST_DB_PATH);

		const points = await getPoints('August', TEST_DB_PATH);
		expect(points).toBe(3);
	});

	test('should return 0 points after reset at 5', async () => {
		for (let i = 1; i <= 5; i++) {
			await makeGuess('August', `Contestant ${i}`, `${i}`, `${i}`, TEST_DB_PATH);
			await writeResult('August', 'win', 'Weapon', 1, TEST_DB_PATH);
		}

		const points = await getPoints('August', TEST_DB_PATH);
		expect(points).toBe(0);
	});

	test('should return correct points after losses', async () => {
		await makeGuess('Grace', 'Winner', '1', '1', TEST_DB_PATH);
		await writeResult('Grace', 'win', 'Sword', 1, TEST_DB_PATH);

		await makeGuess('Grace', 'Loser', '2', '2', TEST_DB_PATH);
		await writeResult('Grace', 'lose', 'Axe', 0, TEST_DB_PATH);

		const points = await getPoints('Grace', TEST_DB_PATH);
		expect(points).toBe(1);
	});

	test('should return correct points from pre-populated data', async () => {
		createTestDataWithGuesses();

		const augustPoints = await getPoints('August', TEST_DB_PATH);
		const gracePoints = await getPoints('Grace', TEST_DB_PATH);

		expect(augustPoints).toBe(2);
		expect(gracePoints).toBe(1);
	});

	test('should return negative points after double down loss', async () => {
		await makeGuess('August', 'First', '1', '1', TEST_DB_PATH);
		await writeResult('August', 'win', 'Sword', 1, TEST_DB_PATH);

		await makeGuess('August', 'Second', '2', '2', TEST_DB_PATH);

		// Simulate double down
		const fs = require('fs');
		const data = JSON.parse(fs.readFileSync(TEST_DB_PATH, 'utf8'));
		data.Players.August.guesses[1].secondGuess = 'Wrong Guess';
		fs.writeFileSync(TEST_DB_PATH, JSON.stringify(data, null, 2));

		await writeResult('August', 'lose', 'Axe', 0, TEST_DB_PATH);

		const points = await getPoints('August', TEST_DB_PATH);
		expect(points).toBe(0); // 1 + (-1) = 0
	});

	test('should track points independently for both players', async () => {
		await makeGuess('August', 'August Win', '1', '1', TEST_DB_PATH);
		await writeResult('August', 'win', 'Katana', 1, TEST_DB_PATH);

		await makeGuess('Grace', 'Grace Win', '2', '2', TEST_DB_PATH);
		await writeResult('Grace', 'win', 'Sword', 1, TEST_DB_PATH);

		await makeGuess('Grace', 'Grace Win 2', '3', '3', TEST_DB_PATH);
		await writeResult('Grace', 'win', 'Axe', 1, TEST_DB_PATH);

		const augustPoints = await getPoints('August', TEST_DB_PATH);
		const gracePoints = await getPoints('Grace', TEST_DB_PATH);

		expect(augustPoints).toBe(1);
		expect(gracePoints).toBe(2);
	});
});
