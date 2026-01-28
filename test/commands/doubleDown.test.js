const doubleDownCommand = require('../../commands/forged_in_fire/doubleDown');
const { createMockInteraction } = require('../mocks/discordMocks');
const { doubleDownGuess } = require('../../utility/doubleDownGuess');

jest.mock('../../utility/doubleDownGuess');

describe('double_down command', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should have correct command data', () => {
		expect(doubleDownCommand.data.name).toBe('double_down');
		expect(doubleDownCommand.data.description).toBe(
			"Champions edition only, select a new contestant, if you're wrong again, you lose a point"
		);
	});

	test('should execute successfully with August and new contestant', async () => {
		const mockInteraction = createMockInteraction({
			user: 'August',
			contestant: 'John Doe',
		});

		doubleDownGuess.mockResolvedValue(undefined);

		await doubleDownCommand.execute(mockInteraction);

		expect(doubleDownGuess).toHaveBeenCalledWith('August', 'John Doe');
		expect(mockInteraction.reply).toHaveBeenCalledWith(
			'August doubled down with John Doe :smiling_imp:'
		);
	});

	test('should execute successfully with Grace and new contestant', async () => {
		const mockInteraction = createMockInteraction({
			user: 'Grace',
			contestant: 'Jane Smith',
		});

		doubleDownGuess.mockResolvedValue(undefined);

		await doubleDownCommand.execute(mockInteraction);

		expect(doubleDownGuess).toHaveBeenCalledWith('Grace', 'Jane Smith');
		expect(mockInteraction.reply).toHaveBeenCalledWith(
			'Grace doubled down with Jane Smith :smiling_imp:'
		);
	});

	test('should execute with different contestant names', async () => {
		const mockInteraction = createMockInteraction({
			user: 'August',
			contestant: 'Bob Johnson',
		});

		doubleDownGuess.mockResolvedValue(undefined);

		await doubleDownCommand.execute(mockInteraction);

		expect(doubleDownGuess).toHaveBeenCalledWith('August', 'Bob Johnson');
		expect(mockInteraction.reply).toHaveBeenCalledWith(
			'August doubled down with Bob Johnson :smiling_imp:'
		);
	});

	test('should still reply even if doubleDownGuess throws error', async () => {
		const mockInteraction = createMockInteraction({
			user: 'August',
			contestant: 'John Doe',
		});

		doubleDownGuess.mockRejectedValue(new Error('Database error'));

		await expect(doubleDownCommand.execute(mockInteraction)).rejects.toThrow('Database error');
		expect(doubleDownGuess).toHaveBeenCalledWith('August', 'John Doe');
	});
});
