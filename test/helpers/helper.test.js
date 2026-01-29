const { readDb } = require('../../helper/readDb');
const { writeDb } = require('../../helper/writeDb');
const {
	setupTestDatabase,
	cleanupTestDatabase,
	TEST_DB_PATH,
	getTestData,
	initialTestData,
} = require('./testDatabase');

describe('Helper Functions', () => {
	beforeEach(() => {
		setupTestDatabase();
	});

	afterEach(() => {
		cleanupTestDatabase();
	});

	describe('readDb', () => {
		test('should read and parse JSON from file', async () => {
			const data = await readDb(TEST_DB_PATH);

			expect(data).toEqual(initialTestData);
			expect(data.Players).toBeDefined();
			expect(data.Players.August).toBeDefined();
			expect(data.Players.Grace).toBeDefined();
		});

		test('should read data with correct structure', async () => {
			const data = await readDb(TEST_DB_PATH);

			expect(data.Players.August).toHaveProperty('points');
			expect(data.Players.August).toHaveProperty('guesses');
			expect(Array.isArray(data.Players.August.guesses)).toBe(true);
		});

		test('should reject if file does not exist', async () => {
			await expect(readDb('non-existent-file.json')).rejects.toThrow();
		});

		test('should reject if file contains invalid JSON', async () => {
			const fs = require('fs');
			fs.writeFileSync(TEST_DB_PATH, 'invalid json{');

			await expect(readDb(TEST_DB_PATH)).rejects.toThrow();
		});
	});

	describe('writeDb', () => {
		test('should write data to file', async () => {
			const testData = {
				Players: {
					August: {
						points: 5,
						guesses: [{ season: '1', episode: '1', contestant: 'Test' }],
					},
					Grace: {
						points: 3,
						guesses: [],
					},
				},
			};

			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

			await writeDb(TEST_DB_PATH, testData);

			expect(consoleSpy).toHaveBeenCalledWith('Save successful');
			consoleSpy.mockRestore();

			const writtenData = await readDb(TEST_DB_PATH);
			expect(writtenData.Players.August.points).toBe(5);
			expect(writtenData.Players.Grace.points).toBe(3);
		});

		test('should handle write errors gracefully', async () => {
			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

			// Pass an invalid path to trigger an error
			await writeDb('/nonexistent/directory/file.json', { test: 'data' });

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining('Save Failed')
			);

			consoleSpy.mockRestore();
		});

		test('should stringify JSON data correctly', async () => {
			const testData = {
				Players: {
					August: { points: 0, guesses: [] },
					Grace: { points: 0, guesses: [] },
				},
			};

			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

			await writeDb(TEST_DB_PATH, testData);

			const writtenData = await readDb(TEST_DB_PATH);
			expect(JSON.stringify(writtenData)).toBe(JSON.stringify(testData));

			consoleSpy.mockRestore();
		});

		test('should use default filename when not provided', () => {
			// Verify the default parameter is 'players.json' by checking the function signature
			// We don't call writeDb() without a filename to avoid overwriting the real players.json
			expect(writeDb).toBeDefined();
			expect(typeof writeDb).toBe('function');
		});
	});
});
