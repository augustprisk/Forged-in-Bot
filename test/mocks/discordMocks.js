const createMockInteraction = (options = {}) => {
	const mockInteraction = {
		options: {
			getString: jest.fn((name) => options[name] || null),
			getSubcommand: jest.fn(() => options.subcommand || null),
		},
		reply: jest.fn().mockResolvedValue(undefined),
		user: {
			username: 'TestUser',
		},
	};
	return mockInteraction;
};

module.exports = {
	createMockInteraction,
};
