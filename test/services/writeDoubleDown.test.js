const { writeDoubleDown } = require('../../services/writeDoubleDown');
const { writeDb } = require('../../helper/writeDb');

jest.mock('../../helper/writeDb');

describe('writeDoubleDown', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should add secondGuess to last guess for August', () => {
		const mockData = {
			Players: {
				August: {
					points: 0,
					guesses: [
						{
							season: '5',
							episode: '10',
							contestant: 'John Doe',
							result: null,
							finalWeapon: null,
						},
					],
				},
				Grace: {
					points: 0,
					guesses: [],
				},
			},
		};

		writeDoubleDown('August', 'Jane Smith', mockData);

		const lastGuess = mockData.Players.August.guesses.at(-1);
		expect(lastGuess.secondGuess).toBe('Jane Smith');
		expect(writeDb).toHaveBeenCalledWith(mockData);
	});

	test('should add secondGuess to last guess for Grace', () => {
		const mockData = {
			Players: {
				August: {
					points: 0,
					guesses: [],
				},
				Grace: {
					points: 2,
					guesses: [
						{
							season: '3',
							episode: '8',
							contestant: 'Alice Wonder',
							result: null,
							finalWeapon: null,
						},
					],
				},
			},
		};

		writeDoubleDown('Grace', 'Bob Johnson', mockData);

		const lastGuess = mockData.Players.Grace.guesses.at(-1);
		expect(lastGuess.secondGuess).toBe('Bob Johnson');
		expect(writeDb).toHaveBeenCalledWith(mockData);
	});

	test('should update only the last guess when multiple guesses exist', () => {
		const mockData = {
			Players: {
				August: {
					points: 1,
					guesses: [
						{
							season: '1',
							episode: '1',
							contestant: 'First Person',
							result: 'win',
							finalWeapon: 'Sword',
						},
						{
							season: '2',
							episode: '2',
							contestant: 'Second Person',
							result: null,
							finalWeapon: null,
						},
					],
				},
				Grace: {
					points: 0,
					guesses: [],
				},
			},
		};

		writeDoubleDown('August', 'Third Person', mockData);

		expect(mockData.Players.August.guesses[0].secondGuess).toBeUndefined();
		expect(mockData.Players.August.guesses[1].secondGuess).toBe('Third Person');
		expect(writeDb).toHaveBeenCalledWith(mockData);
	});

	test('should overwrite existing secondGuess if called again', () => {
		const mockData = {
			Players: {
				August: {
					points: 0,
					guesses: [
						{
							season: '5',
							episode: '10',
							contestant: 'John Doe',
							result: null,
							finalWeapon: null,
							secondGuess: 'Old Guess',
						},
					],
				},
				Grace: {
					points: 0,
					guesses: [],
				},
			},
		};

		writeDoubleDown('August', 'New Guess', mockData);

		const lastGuess = mockData.Players.August.guesses.at(-1);
		expect(lastGuess.secondGuess).toBe('New Guess');
		expect(writeDb).toHaveBeenCalledWith(mockData);
	});

	test('should not affect other properties of the guess', () => {
		const mockData = {
			Players: {
				Grace: {
					points: 2,
					guesses: [
						{
							season: '7',
							episode: '15',
							contestant: 'Original Contestant',
							result: null,
							finalWeapon: null,
						},
					],
				},
				August: {
					points: 0,
					guesses: [],
				},
			},
		};

		writeDoubleDown('Grace', 'New Contestant', mockData);

		const lastGuess = mockData.Players.Grace.guesses.at(-1);
		expect(lastGuess.season).toBe('7');
		expect(lastGuess.episode).toBe('15');
		expect(lastGuess.contestant).toBe('Original Contestant');
		expect(lastGuess.result).toBeNull();
		expect(lastGuess.finalWeapon).toBeNull();
		expect(lastGuess.secondGuess).toBe('New Contestant');
	});

	test('should not affect other player data', () => {
		const mockData = {
			Players: {
				August: {
					points: 3,
					guesses: [
						{
							season: '5',
							episode: '10',
							contestant: 'John Doe',
							result: null,
							finalWeapon: null,
						},
					],
				},
				Grace: {
					points: 1,
					guesses: [
						{
							season: '4',
							episode: '5',
							contestant: 'Grace Person',
							result: null,
							finalWeapon: null,
						},
					],
				},
			},
		};

		writeDoubleDown('August', 'Jane Smith', mockData);

		expect(mockData.Players.Grace.guesses[0].secondGuess).toBeUndefined();
		expect(mockData.Players.Grace.points).toBe(1);
		expect(mockData.Players.August.guesses[0].secondGuess).toBe('Jane Smith');
	});
});
