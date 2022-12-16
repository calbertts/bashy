const readline = require('readline-sync');

// Parse the user's input
function parseInput(input) {
  // Split the input string on spaces to get the command name and any arguments
  const tokens = input.split(' ');
  const command = tokens[0];
  const args = tokens.slice(1);

  return { command, args };
}

// A map of available commands and their corresponding implementation functions
const commands = {
  // The 'echo' command simply prints the arguments it was given
  echo: (args) => args.join(' '),

  // The 'add' command adds the given arguments and returns the result
  add: (args) => args.map(Number).reduce((acc, val) => acc + val, 0),
};

// Continuously read user input and execute the corresponding command
while (true) {
  const input = readline.question('$ ');
  const { command, args } = parseInput(input);

  // Look up the implementation function for the given command
  const impl = commands[command];
  if (!impl) {
    console.log(`Unknown command: ${command}`);
    continue;
  }

  // Execute the implementation function and print the result
  console.log(impl(args));
}
