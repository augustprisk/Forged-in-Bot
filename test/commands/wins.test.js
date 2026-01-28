const winsCommand = require('../../commands/forged_in_fire/wins');
const { createMockInteraction } = require('../mocks/discordMocks');
const { getWins } = require('../../utility/getWins');
const pagination = require('../../utility/pagination');

jest.mock('../../utility/getWins');
jest.mock('../../utility/pagination');

describe('wins command', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should have correct command data', () => {
		expect(winsCommand.data.name).toBe('wins');
		expect(winsCommand.data.description).toBe('get wins');
	});

	test('should display wins with pagination when wins exist', async () => {
		const mockInteraction = createMockInteraction({
			player: 'August',
		});

		const mockWins = [
			{
				season: '5',
				episode: '10',
				contestant: 'John Doe',
				finalWeapon: 'Katana',
			},
			{
				season: '3',
				episode: '8',
				contestant: 'Jane Smith',
				finalWeapon: 'Longsword',
			},
		];

		getWins.mockResolvedValue(mockWins);
		pagination.mockResolvedValue(undefined);

		await winsCommand.execute(mockInteraction);

		expect(getWins).toHaveBeenCalledWith('August');
		expect(pagination).toHaveBeenCalledWith(
			mockInteraction,
			mockWins,
			expect.objectContaining({
				itemsPerPage: 3,
				formatPage: expect.any(Function),
			})
		);
		expect(mockInteraction.reply).not.toHaveBeenCalled();
	});

	test('should test pagination formatPage function', async () => {
		const mockInteraction = createMockInteraction({
			player: 'August',
		});

		const mockWins = [
			{
				season: '5',
				episode: '10',
				contestant: 'John Doe',
				finalWeapon: 'Katana',
			},
		];

		getWins.mockResolvedValue(mockWins);
		pagination.mockImplementation(async (interaction, wins, options) => {
			const embed = options.formatPage(mockWins);
			expect(embed).toBeDefined();
			expect(embed.data.description).toContain('Season 5 Episode 10');
			expect(embed.data.description).toContain('Contestant: John Doe');
			expect(embed.data.description).toContain('Winning Weapon: Katana');
		});

		await winsCommand.execute(mockInteraction);

		expect(pagination).toHaveBeenCalled();
	});

	test('should display message when no wins exist', async () => {
		const mockInteraction = createMockInteraction({
			player: 'Grace',
		});

		getWins.mockResolvedValue([]);

		await winsCommand.execute(mockInteraction);

		expect(getWins).toHaveBeenCalledWith('Grace');
		expect(mockInteraction.reply).toHaveBeenCalledWith(
			'You have no wins lmao :sob:'
		);
		expect(pagination).not.toHaveBeenCalled();
	});

	test('should handle errors from getWins', async () => {
		const mockInteraction = createMockInteraction({
			player: 'August',
		});

		const errorMessage = 'Database error';
		getWins.mockRejectedValue(new Error(errorMessage));

		await winsCommand.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith(
			`There was an error with this command: ${errorMessage}`
		);
		expect(pagination).not.toHaveBeenCalled();
	});

	test('should format multiple wins correctly', async () => {
		const mockInteraction = createMockInteraction({
			player: 'August',
		});

		const mockWins = [
			{
				season: '5',
				episode: '10',
				contestant: 'John Doe',
				finalWeapon: 'Katana',
			},
			{
				season: '3',
				episode: '8',
				contestant: 'Jane Smith',
				finalWeapon: 'Longsword',
			},
			{
				season: '7',
				episode: '2',
				contestant: 'Bob Johnson',
				finalWeapon: 'Axe',
			},
		];

		getWins.mockResolvedValue(mockWins);
		pagination.mockImplementation(async (interaction, wins, options) => {
			const embed = options.formatPage(mockWins);
			expect(embed.data.description).toContain('Season 5 Episode 10');
			expect(embed.data.description).toContain('Season 3 Episode 8');
			expect(embed.data.description).toContain('Season 7 Episode 2');
		});

		await winsCommand.execute(mockInteraction);

		expect(pagination).toHaveBeenCalled();
	});
});
