const { resultToDb } = require('../../services/resultToDb');
const { writeDb } = require('../../helper/writeDb');

jest.mock('../../helper/writeDb');

describe('resultToDb', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should update last guess with win result and weapon', () => {
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

		resultToDb('August', 'John Doe', 'Katana', 1, mockData);

		const lastGuess = mockData.Players.August.guesses.at(-1);
		expect(lastGuess.result).toBe('win');
		expect(lastGuess.finalWeapon).toBe('Katana');
		expect(mockData.Players.August.points).toBe(1);
		expect(writeDb).toHaveBeenCalledWith('players.json', mockData);
	});

	test('should update last guess with lose result and weapon', () => {
		const mockData = {
			Players: {
				August: {
					points: 2,
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

		resultToDb('August', 'lose', 'Sword', 0, mockData);

		const lastGuess = mockData.Players.August.guesses.at(-1);
		expect(lastGuess.result).toBe('lose');
		expect(lastGuess.finalWeapon).toBe('Sword');
		expect(mockData.Players.August.points).toBe(2); // No change for loss
		expect(writeDb).toHaveBeenCalledWith('players.json', mockData);
	});

	test('should reset points to 0 when reaching 5', () => {
		const mockData = {
			Players: {
				August: {
					points: 4,
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

		resultToDb('August', 'win', 'Katana', 1, mockData);

		expect(mockData.Players.August.points).toBe(0); // Reset to 0 after reaching 5
		expect(writeDb).toHaveBeenCalledWith('players.json', mockData);
	});

	test('should deduct 1 point for loss with secondGuess (double down)', () => {
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
							secondGuess: 'Jane Smith',
						},
					],
				},
				Grace: {
					points: 0,
					guesses: [],
				},
			},
		};

		resultToDb('August', 'lose', 'Sword', 0, mockData);

		expect(mockData.Players.August.points).toBe(2); // 3 + (-1) = 2
		expect(writeDb).toHaveBeenCalledWith('players.json', mockData);
	});

	test('should not deduct points for loss without secondGuess', () => {
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
					points: 0,
					guesses: [],
				},
			},
		};

		resultToDb('August', 'lose', 'Sword', 0, mockData);

		expect(mockData.Players.August.points).toBe(3); // No change
		expect(writeDb).toHaveBeenCalledWith('players.json', mockData);
	});

	test('should add points correctly for win', () => {
		const mockData = {
			Players: {
				Grace: {
					points: 2,
					guesses: [
						{
							season: '3',
							episode: '5',
							contestant: 'Alice',
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

		resultToDb('Grace', 'win', 'Axe', 1, mockData);

		expect(mockData.Players.Grace.points).toBe(3);
		expect(writeDb).toHaveBeenCalledWith('players.json', mockData);
	});

	test('should handle multiple guesses and update only the last one', () => {
		const mockData = {
			Players: {
				August: {
					points: 1,
					guesses: [
						{
							season: '1',
							episode: '1',
							contestant: 'First',
							result: 'win',
							finalWeapon: 'Sword',
						},
						{
							season: '2',
							episode: '2',
							contestant: 'Second',
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

		resultToDb('August', 'Second', 'Katana', 1, mockData);

		expect(mockData.Players.August.guesses[0].result).toBe('win');
		expect(mockData.Players.August.guesses[0].finalWeapon).toBe('Sword');
		expect(mockData.Players.August.guesses[1].result).toBe('win');
		expect(mockData.Players.August.guesses[1].finalWeapon).toBe('Katana');
		expect(mockData.Players.August.points).toBe(2);
	});

	test('should handle reaching exactly 5 points', () => {
		const mockData = {
			Players: {
				August: {
					points: 4,
					guesses: [
						{
							season: '5',
							episode: '10',
							contestant: 'John',
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

		resultToDb('August', 'win', 'Spear', 1, mockData);

		expect(mockData.Players.August.points).toBe(0);
	});

	test('should handle points greater than 5', () => {
		const mockData = {
			Players: {
				August: {
					points: 6,
					guesses: [
						{
							season: '5',
							episode: '10',
							contestant: 'John',
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

		resultToDb('August', 'win', 'Hammer', 1, mockData);

		expect(mockData.Players.August.points).toBe(0); // 6+1=7 >= 5, so reset to 0
	});
});
