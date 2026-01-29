const { fetchWins } = require('../../services/fetchWins');

describe('fetchWins', () => {
	test('should return all wins for a player', () => {
		const mockData = {
			Players: {
				August: {
					points: 2,
					guesses: [
						{
							season: '5',
							episode: '10',
							contestant: 'John Doe',
							result: 'win',
							finalWeapon: 'Katana',
						},
						{
							season: '3',
							episode: '8',
							contestant: 'Jane Smith',
							result: 'lose',
							finalWeapon: 'Longsword',
						},
						{
							season: '7',
							episode: '2',
							contestant: 'Bob Johnson',
							result: 'win',
							finalWeapon: 'Axe',
						},
					],
				},
				Grace: {
					points: 0,
					guesses: [],
				},
			},
		};

		const wins = fetchWins('August', mockData);

		expect(wins).toHaveLength(2);
		expect(wins[0].contestant).toBe('John Doe');
		expect(wins[1].contestant).toBe('Bob Johnson');
	});

	test('should return empty array when player has no wins', () => {
		const mockData = {
			Players: {
				August: {
					points: 0,
					guesses: [
						{
							season: '3',
							episode: '8',
							contestant: 'Jane Smith',
							result: 'lose',
							finalWeapon: 'Longsword',
						},
					],
				},
				Grace: {
					points: 0,
					guesses: [],
				},
			},
		};

		const wins = fetchWins('August', mockData);

		expect(wins).toHaveLength(0);
		expect(Array.isArray(wins)).toBe(true);
	});

	test('should return empty array when player has no guesses', () => {
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

		const wins = fetchWins('Grace', mockData);

		expect(wins).toHaveLength(0);
		expect(Array.isArray(wins)).toBe(true);
	});

	test('should return all wins when all guesses are wins', () => {
		const mockData = {
			Players: {
				Grace: {
					points: 3,
					guesses: [
						{
							season: '1',
							episode: '1',
							contestant: 'Winner 1',
							result: 'win',
							finalWeapon: 'Sword',
						},
						{
							season: '2',
							episode: '2',
							contestant: 'Winner 2',
							result: 'win',
							finalWeapon: 'Spear',
						},
						{
							season: '3',
							episode: '3',
							contestant: 'Winner 3',
							result: 'win',
							finalWeapon: 'Hammer',
						},
					],
				},
				August: {
					points: 0,
					guesses: [],
				},
			},
		};

		const wins = fetchWins('Grace', mockData);

		expect(wins).toHaveLength(3);
		expect(wins.every((win) => win.result === 'win')).toBe(true);
	});

	test('should not include guesses with null result', () => {
		const mockData = {
			Players: {
				August: {
					points: 1,
					guesses: [
						{
							season: '5',
							episode: '10',
							contestant: 'John Doe',
							result: 'win',
							finalWeapon: 'Katana',
						},
						{
							season: '6',
							episode: '11',
							contestant: 'Pending',
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

		const wins = fetchWins('August', mockData);

		expect(wins).toHaveLength(1);
		expect(wins[0].contestant).toBe('John Doe');
	});

	test('should work correctly for Grace player', () => {
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
							season: '4',
							episode: '5',
							contestant: 'Alice Wonder',
							result: 'win',
							finalWeapon: 'Sword',
						},
						{
							season: '6',
							episode: '12',
							contestant: 'Charlie Brown',
							result: 'lose',
							finalWeapon: 'Spear',
						},
						{
							season: '8',
							episode: '3',
							contestant: 'Diana Prince',
							result: 'win',
							finalWeapon: 'Lasso',
						},
					],
				},
			},
		};

		const wins = fetchWins('Grace', mockData);

		expect(wins).toHaveLength(2);
		expect(wins[0].contestant).toBe('Alice Wonder');
		expect(wins[1].contestant).toBe('Diana Prince');
	});
});
