# Test Suite for Forged-in-Bot

This directory contains the test suite for the Forged-in-Bot Discord bot.

## Test Structure

```
test/
├── commands/           # Command tests
│   ├── guess.test.js
│   ├── result.test.js
│   ├── points.test.js
│   ├── wins.test.js
│   └── doubleDown.test.js
└── mocks/             # Mock utilities
    └── discordMocks.js
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Test Coverage

### Commands Tested

1. **guess.test.js** - Tests for the `/guess` command
   - Command metadata verification
   - Successful guess recording for both players
   - Error handling

2. **result.test.js** - Tests for the `/result` command
   - Win subcommand functionality
   - Loss subcommand functionality
   - Error handling for both subcommands
   - Correct point allocation

3. **points.test.js** - Tests for the `/points` command
   - Point retrieval for both players
   - Zero points display
   - Error handling

4. **wins.test.js** - Tests for the `/wins` command
   - Win display with pagination
   - Empty wins handling
   - Pagination formatting
   - Error handling

5. **doubleDown.test.js** - Tests for the `/double_down` command
   - Double down functionality for both players
   - Different contestant names
   - Error handling

## Mock Utilities

### discordMocks.js

Provides `createMockInteraction()` function to mock Discord.js interaction objects for testing.

**Usage:**
```javascript
const { createMockInteraction } = require('../mocks/discordMocks');

const mockInteraction = createMockInteraction({
  user: 'August',
  name: 'John Doe',
  season: '5',
  episode: '10',
});
```

## Test Statistics

- **Total Tests:** 28
- **Test Suites:** 5
- **All tests passing:** ✓

## Dependencies

- **jest** - Testing framework
- **@types/jest** - TypeScript definitions for Jest
