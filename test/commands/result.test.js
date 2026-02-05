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

	test('should execute successfully with valid inputs', async () => {
		const mockInteraction = createMockInteraction({
			user: 'August',
			winner: 'James',
			weapon: 'Katana'
		});

		await resultCommand.execute(mockInteraction);

		expect(writeResult).toHaveBeenCalledWith('August', 'James', 'Katana', 1);
		expect(mockInteraction.reply).toHaveBeenCalledWith(
			'August, your result has been recorded'
		);
	});

	test('should execute successfully with Grace as user', async () => {
		const mockInteraction = createMockInteraction({
			user: 'Grace',
			winner: 'Leon',
			weapon: 'Longsword'
		});

		await resultCommand.execute(mockInteraction);

		expect(writeResult).toHaveBeenCalledWith('Grace', 'Leon', 'Longsword', 1);
		expect(mockInteraction.reply).toHaveBeenCalledWith(
			'Grace, your result has been recorded'
		);
	});

	test('should handle errors from writeResult', async () => {
		const mockInteraction = createMockInteraction({
			user: 'August',
			winner: 'James',
			weapon: 'Katana'
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
