const guessCommand = require('../../commands/forged_in_fire/guess');
const { createMockInteraction } = require('../mocks/discordMocks');
const { makeGuess } = require('../../utility/makeGuess');

jest.mock('../../utility/makeGuess');

describe('guess command', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should have correct command data', () => {
		expect(guessCommand.data.name).toBe('guess');
		expect(guessCommand.data.description).toBe('Make your guess for this episodes forged in fire winner');
	});

	test('should execute successfully with valid inputs', async () => {
		const mockInteraction = createMockInteraction({
			user: 'August',
			name: 'John Doe',
			season: '5',
			episode: '10',
		});

		await guessCommand.execute(mockInteraction);

		expect(makeGuess).toHaveBeenCalledWith('August', 'John Doe', '5', '10');
		expect(mockInteraction.reply).toHaveBeenCalledWith(
			'August Made their guess for John Doe, Season: 5 Episode: 10'
		);
	});

	test('should execute successfully with Grace as user', async () => {
		const mockInteraction = createMockInteraction({
			user: 'Grace',
			name: 'Jane Smith',
			season: '3',
			episode: '8',
		});

		await guessCommand.execute(mockInteraction);

		expect(makeGuess).toHaveBeenCalledWith('Grace', 'Jane Smith', '3', '8');
		expect(mockInteraction.reply).toHaveBeenCalledWith(
			'Grace Made their guess for Jane Smith, Season: 3 Episode: 8'
		);
	});

	test('should handle errors from makeGuess', async () => {
		const mockInteraction = createMockInteraction({
			user: 'August',
			name: 'John Doe',
			season: '5',
			episode: '10',
		});

		const errorMessage = 'Database error';
		makeGuess.mockImplementation(() => {
			throw new Error(errorMessage);
		});

		await guessCommand.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith(
			`There was an error with this command: ${errorMessage}`
		);
	});

	test('should handle errors without message property', async () => {
		const mockInteraction = createMockInteraction({
			user: 'August',
			name: 'John Doe',
			season: '5',
			episode: '10',
		});

		makeGuess.mockImplementation(() => {
			throw 'String error';
		});

		await guessCommand.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalled();
	});
});
