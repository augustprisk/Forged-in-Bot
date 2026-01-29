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
		test('should read and parse JSON from file', () => {
			const data = readDb(TEST_DB_PATH);

			expect(data).toEqual(initialTestData);
			expect(data.Players).toBeDefined();
			expect(data.Players.August).toBeDefined();
			expect(data.Players.Grace).toBeDefined();
		});

		test('should read data with correct structure', () => {
			const data = readDb(TEST_DB_PATH);

			expect(data.Players.August).toHaveProperty('points');
			expect(data.Players.August).toHaveProperty('guesses');
			expect(Array.isArray(data.Players.August.guesses)).toBe(true);
		});

		test('should throw error if file does not exist', () => {
			expect(() => readDb('non-existent-file.json')).toThrow();
		});

		test('should throw error if file contains invalid JSON', () => {
			const fs = require('fs');
			fs.writeFileSync(TEST_DB_PATH, 'invalid json{');

			expect(() => readDb(TEST_DB_PATH)).toThrow();
		});
	});

	describe('writeDb', () => {
		test('should write data to players.json file', () => {
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

			// Mock console.log to check for success message
			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

			writeDb(testData);

			expect(consoleSpy).toHaveBeenCalledWith('Save successful');
			consoleSpy.mockRestore();

			// Verify the data was written correctly
			const writtenData = readDb('players.json');
			expect(writtenData.Players.August.points).toBe(5);
			expect(writtenData.Players.Grace.points).toBe(3);
		});

		test('should handle write errors gracefully', () => {
			const fs = require('fs');
			const originalWriteFileSync = fs.writeFileSync;

			// Mock writeFileSync to throw an error
			fs.writeFileSync = jest.fn(() => {
				throw new Error('Write error');
			});

			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

			writeDb({ test: 'data' });

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining('Save Failed')
			);

			// Restore original function
			fs.writeFileSync = originalWriteFileSync;
			consoleSpy.mockRestore();
		});

		test('should stringify JSON data correctly', () => {
			const testData = {
				Players: {
					August: { points: 0, guesses: [] },
					Grace: { points: 0, guesses: [] },
				},
			};

			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

			writeDb(testData);

			const writtenData = readDb('players.json');
			expect(JSON.stringify(writtenData)).toBe(JSON.stringify(testData));

			consoleSpy.mockRestore();
		});
	});
});
