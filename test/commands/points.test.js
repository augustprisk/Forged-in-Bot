const pointsCommand = require('../../commands/forged_in_fire/points');
const { createMockInteraction } = require('../mocks/discordMocks');
const { getPoints } = require('../../utility/getPoints');

jest.mock('../../utility/getPoints');

describe('points command', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should have correct command data', () => {
		expect(pointsCommand.data.name).toBe('points');
		expect(pointsCommand.data.description).toBe('Get points');
	});

	test('should execute successfully and display points for August', async () => {
		const mockInteraction = createMockInteraction({
			player: 'August',
		});

		getPoints.mockResolvedValue(5);

		await pointsCommand.execute(mockInteraction);

		expect(getPoints).toHaveBeenCalledWith('August');
		expect(mockInteraction.reply).toHaveBeenCalledWith(
			'August, your points are: 5'
		);
	});

	test('should execute successfully and display points for Grace', async () => {
		const mockInteraction = createMockInteraction({
			player: 'Grace',
		});

		getPoints.mockResolvedValue(3);

		await pointsCommand.execute(mockInteraction);

		expect(getPoints).toHaveBeenCalledWith('Grace');
		expect(mockInteraction.reply).toHaveBeenCalledWith(
			'Grace, your points are: 3'
		);
	});

	test('should display zero points when player has no points', async () => {
		const mockInteraction = createMockInteraction({
			player: 'August',
		});

		getPoints.mockResolvedValue(0);

		await pointsCommand.execute(mockInteraction);

		expect(getPoints).toHaveBeenCalledWith('August');
		expect(mockInteraction.reply).toHaveBeenCalledWith(
			'August, your points are: 0'
		);
	});

	test('should handle errors from getPoints', async () => {
		const mockInteraction = createMockInteraction({
			player: 'August',
		});

		const errorMessage = 'Failed to read database';
		getPoints.mockRejectedValue(new Error(errorMessage));

		await pointsCommand.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith(
			`There was an error with this command: Error: ${errorMessage}`
		);
	});
});
