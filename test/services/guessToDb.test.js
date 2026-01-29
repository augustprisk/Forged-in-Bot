const { guessToDb } = require('../../services/guessToDb');
const { writeDb } = require('../../helper/writeDb');

jest.mock('../../helper/writeDb');

describe('guessToDb', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should add a guess to August\'s guesses array', () => {
		const mockData = {
			Players: {
				August: {
					points: 0,
					guesses: [],
				},
				Grace: {
					points: 0,
					guesses: [],
				},
			},
		};

		guessToDb('August', 'John Doe', '5', '10', mockData);

		expect(mockData.Players.August.guesses).toHaveLength(1);
		expect(mockData.Players.August.guesses[0]).toEqual({
			season: '5',
			episode: '10',
			contestant: 'John Doe',
			result: null,
			finalWeapon: null,
		});
		expect(writeDb).toHaveBeenCalledWith('players.json', mockData);
	});

	test('should add a guess to Grace\'s guesses array', () => {
		const mockData = {
			Players: {
				August: {
					points: 0,
					guesses: [],
				},
				Grace: {
					points: 0,
					guesses: [],
				},
			},
		};

		guessToDb('Grace', 'Jane Smith', '3', '8', mockData);

		expect(mockData.Players.Grace.guesses).toHaveLength(1);
		expect(mockData.Players.Grace.guesses[0]).toEqual({
			season: '3',
			episode: '8',
			contestant: 'Jane Smith',
			result: null,
			finalWeapon: null,
		});
		expect(writeDb).toHaveBeenCalledWith('players.json', mockData);
	});

	test('should add multiple guesses to the same player', () => {
		const mockData = {
			Players: {
				August: {
					points: 0,
					guesses: [
						{
							season: '1',
							episode: '1',
							contestant: 'First Person',
							result: 'win',
							finalWeapon: 'Sword',
						},
					],
				},
				Grace: {
					points: 0,
					guesses: [],
				},
			},
		};

		guessToDb('August', 'Second Person', '2', '2', mockData);

		expect(mockData.Players.August.guesses).toHaveLength(2);
		expect(mockData.Players.August.guesses[1].contestant).toBe('Second Person');
		expect(writeDb).toHaveBeenCalledWith('players.json', mockData);
	});

	test('should initialize guess with null result and finalWeapon', () => {
		const mockData = {
			Players: {
				August: {
					points: 0,
					guesses: [],
				},
				Grace: {
					points: 0,
					guesses: [],
				},
			},
		};

		guessToDb('August', 'Test Contestant', '7', '15', mockData);

		const addedGuess = mockData.Players.August.guesses[0];
		expect(addedGuess.result).toBeNull();
		expect(addedGuess.finalWeapon).toBeNull();
	});

	test('should not affect other player\'s guesses', () => {
		const mockData = {
			Players: {
				August: {
					points: 2,
					guesses: [],
				},
				Grace: {
					points: 3,
					guesses: [
						{
							season: '5',
							episode: '5',
							contestant: 'Grace Person',
							result: 'win',
							finalWeapon: 'Axe',
						},
					],
				},
			},
		};

		guessToDb('August', 'August Person', '6', '6', mockData);

		expect(mockData.Players.Grace.guesses).toHaveLength(1);
		expect(mockData.Players.Grace.points).toBe(3);
		expect(mockData.Players.August.guesses).toHaveLength(1);
	});
});
