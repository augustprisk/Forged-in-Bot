# Test Suite for Forged-in-Bot

This directory contains a comprehensive test suite for the Forged-in-Bot Discord bot, including unit tests, integration tests, and full code path testing.

## Test Structure

```
test/
├── commands/           # Unit tests for Discord commands (28 tests)
│   ├── guess.test.js
│   ├── result.test.js
│   ├── points.test.js
│   ├── wins.test.js
│   └── doubleDown.test.js
├── services/          # Unit tests for service layer (25 tests)
│   ├── guessToDb.test.js
│   ├── resultToDb.test.js
│   ├── fetchWins.test.js
│   └── writeDoubleDown.test.js
├── utility/           # Integration tests for utility layer (45 tests)
│   ├── makeGuess.test.js
│   ├── writeResult.test.js
│   ├── getPoints.test.js
│   ├── getWins.test.js
│   └── doubleDownGuess.test.js
├── helpers/           # Tests for helper functions & test utilities (7 tests)
│   ├── helper.test.js
│   └── testDatabase.js
├── mocks/             # Mock utilities for testing
│   └── discordMocks.js
└── fixtures/          # Test database files (auto-generated, gitignored)
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

## Test Types

### 1. Unit Tests (Commands)
Test the command layer in isolation with mocked dependencies:
- Command metadata verification
- Discord interaction handling
- Error handling and edge cases
- Reply message formatting

**What they test:** Command orchestration and Discord.js integration
**What they don't test:** Actual business logic implementation

### 2. Unit Tests (Services)
Test service layer business logic with mocked file I/O:
- Data manipulation logic
- Points calculation and reset at 5
- Double down penalty logic
- Win/loss filtering
- Guess recording

**What they test:** Core business rules and data transformations
**What they don't test:** File operations

### 3. Integration Tests (Utilities)
Test complete code paths with real implementations but test database:
- Full flow from utility → service → helper
- Real business logic execution
- Data persistence verification
- Multi-step game flows

**What they test:** Complete feature workflows end-to-end
**What they don't test:** Only the actual production database (uses test DB)

### 4. Helper Tests
Test low-level file I/O operations:
- Reading JSON from files
- Writing JSON to files
- Error handling for invalid files

**What they test:** File system operations and JSON parsing

## Test Coverage Details

### Commands (28 tests)

**guess.test.js** (5 tests)
- Command metadata verification
- Successful guess recording for both players
- Error handling with and without error messages

**result.test.js** (7 tests)
- Win/loss subcommand functionality
- Error handling for both subcommands
- Correct point allocation
- Both players tested independently

**points.test.js** (5 tests)
- Point retrieval for both players
- Zero points display
- Error handling

**wins.test.js** (6 tests)
- Win display with pagination
- Empty wins handling
- Pagination formatting
- Multiple wins display
- Error handling

**doubleDown.test.js** (5 tests)
- Double down for both players
- Different contestant names
- Error handling

### Services (25 tests)

**guessToDb.test.js** (5 tests)
- Adding guesses to player arrays
- Multiple guesses handling
- Null result/weapon initialization
- Player isolation

**resultToDb.test.js** (9 tests)
- Win/loss result recording
- Points reset at 5
- Double down penalty (-1 point)
- Multiple guesses handling
- Edge cases (>5 points, exactly 5)

**fetchWins.test.js** (6 tests)
- Filtering wins from all guesses
- Empty array for no wins
- Excluding pending/null results
- Both players independently

**writeDoubleDown.test.js** (5 tests)
- Adding secondGuess property
- Overwriting existing secondGuess
- Last guess targeting
- Property preservation

### Utilities (45 tests)

**makeGuess.test.js** (7 tests)
- Adding guesses with test database
- Multiple guesses per player
- Data persistence
- Season/episode format handling

**writeResult.test.js** (8 tests)
- Recording wins and losses
- Points accumulation
- Reset at 5 points
- Double down penalties
- Multiple result handling

**getPoints.test.js** (9 tests)
- Point retrieval from database
- Zero points for new players
- Multiple wins accumulation
- Reset behavior at 5
- Negative points (double down)
- Both players independently

**getWins.test.js** (10 tests)
- Win filtering from database
- Empty arrays for no wins
- Pending guess exclusion
- Multiple wins ordering
- Pre-populated data handling
- Win properties verification

**doubleDownGuess.test.js** (10 tests)
- Adding secondGuess to database
- Last guess targeting
- Property preservation
- Result recording integration
- Point deduction flow
- Complete game flow testing

### Helpers (7 tests)

**helper.test.js** (7 tests)
- Reading valid JSON files
- Writing JSON data
- Invalid file handling
- Invalid JSON handling
- Error graceful handling

## Test Database

Integration tests use an isolated test database located at `test/fixtures/test-players.json`:

- **Automatic setup/teardown** - Each test gets a clean database
- **No production impact** - Never touches `players.json`
- **Pre-populated fixtures** - Helper function for complex test scenarios
- **Proper cleanup** - Files removed after tests complete

**Test Database Helper:**
```javascript
const {
  setupTestDatabase,    // Creates clean test DB
  cleanupTestDatabase,  // Removes test DB
  getTestData,          // Reads current test data
  resetTestDatabase,    // Resets to initial state
  createTestDataWithGuesses, // Loads fixture data
  TEST_DB_PATH          // Path to test database
} = require('./helpers/testDatabase');
```

## Mock Utilities

### discordMocks.js

Provides `createMockInteraction()` function to mock Discord.js interaction objects:

```javascript
const { createMockInteraction } = require('../mocks/discordMocks');

const mockInteraction = createMockInteraction({
  user: 'August',
  name: 'John Doe',
  season: '5',
  episode: '10',
  subcommand: 'win',
});
```

## Test Statistics

- **Total Tests:** 105
- **Test Suites:** 15
- **All tests passing:** ✓
- **Coverage:** Commands, Services, Utilities, Helpers

## What These Tests Catch

### Business Logic Bugs
- Incorrect point calculations
- Reset logic failing at 5 points
- Double down penalty not applied
- Win/loss filtering errors

### Integration Issues
- Data not persisting correctly
- Service functions not called properly
- Utilities not orchestrating correctly

### Error Handling
- Missing error catches
- Incorrect error messages
- Graceful failure scenarios

### Edge Cases
- Empty data arrays
- Null/undefined values
- Multiple sequential operations
- Player data isolation

## Dependencies

- **jest** (v30.2.0) - Testing framework
- **@types/jest** (v30.0.0) - TypeScript definitions for Jest

## Notes

- Integration tests use mocked `writeDb` to prevent file conflicts
- Command tests mock all utility functions for isolation
- Service tests mock only file I/O operations
- All async operations properly awaited
- Test database automatically cleaned up after each test
