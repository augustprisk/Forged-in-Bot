const resultCommand = require('../../commands/forged_in_fire/result');
const { createMockInteraction } = require('../mocks/discordMocks');
const { writeResult } = require('../../utility/writeResult');

jest.mock('../../utility/writeResult');

describe('result command', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should have correct command data', () => {
		expect(resultCommand.data.name).toBe('result');
		expect(resultCommand.data.description).toBe('Was your guess right or wrong?');
	});

	describe('win subcommand', () => {
		test('should execute successfully with valid inputs', async () => {
			const mockInteraction = createMockInteraction({
				user: 'August',
				weapon: 'Katana',
				subcommand: 'win',
			});

			await resultCommand.execute(mockInteraction);

			expect(writeResult).toHaveBeenCalledWith('August', 'win', 'Katana', 1);
			expect(mockInteraction.reply).toHaveBeenCalledWith(
				'TestUser, your win has been recorded'
			);
		});

		test('should execute successfully with Grace as user', async () => {
			const mockInteraction = createMockInteraction({
				user: 'Grace',
				weapon: 'Longsword',
				subcommand: 'win',
			});

			await resultCommand.execute(mockInteraction);

			expect(writeResult).toHaveBeenCalledWith('Grace', 'win', 'Longsword', 1);
			expect(mockInteraction.reply).toHaveBeenCalledWith(
				'TestUser, your win has been recorded'
			);
		});

		test('should handle errors from writeResult', async () => {
			const mockInteraction = createMockInteraction({
				user: 'August',
				weapon: 'Katana',
				subcommand: 'win',
			});

			const errorMessage = 'Database error';
			writeResult.mockImplementation(() => {
				throw new Error(errorMessage);
			});

			await resultCommand.execute(mockInteraction);

			expect(mockInteraction.reply).toHaveBeenCalledWith(
				`There was an error with this command: Error: ${errorMessage}`
			);
		});
	});

	describe('loss subcommand', () => {
		test('should execute successfully with valid inputs', async () => {
			const mockInteraction = createMockInteraction({
				user: 'August',
				weapon: 'Katana',
				subcommand: 'loss',
			});

			writeResult.mockResolvedValue(undefined);

			await resultCommand.execute(mockInteraction);

			expect(writeResult).toHaveBeenCalledWith('August', 'lose', 'Katana', 0);
			expect(mockInteraction.reply).toHaveBeenCalledWith(
				'TestUser, your loss has been recorded'
			);
		});

		test('should execute successfully with Grace as user', async () => {
			const mockInteraction = createMockInteraction({
				user: 'Grace',
				weapon: 'Longsword',
				subcommand: 'loss',
			});

			writeResult.mockResolvedValue(undefined);

			await resultCommand.execute(mockInteraction);

			expect(writeResult).toHaveBeenCalledWith('Grace', 'lose', 'Longsword', 0);
			expect(mockInteraction.reply).toHaveBeenCalledWith(
				'TestUser, your loss has been recorded'
			);
		});

		test('should handle errors from writeResult', async () => {
			const mockInteraction = createMockInteraction({
				user: 'August',
				weapon: 'Katana',
				subcommand: 'loss',
			});

			const errorMessage = 'Database error';
			writeResult.mockImplementation(() => {
				throw new Error(errorMessage);
			});

			await resultCommand.execute(mockInteraction);

			expect(mockInteraction.reply).toHaveBeenCalledWith(
				`There was an error with this command: Error: ${errorMessage}`
			);
		});
	});
});
