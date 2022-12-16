const fs = require('fs');
const parser = require('./parser')

function interpret(ast) {
  switch (ast.type) {
    case 'Commands':
      return interpretPipedCommand(ast.commands);
    case 'Assignment':
      return interpretAssignment(ast);
    // Add case statements for other types of sentences here
  }
}

function interpretPipedCommand(commands) {
  let result = null;
  commands.forEach(_command => {
    const { command, ...input } = _command;
    result = interpretSingleCommand(command, input, result);
  });
  return result;
}

function interpretSingleCommand(command, input, stdin) {
  switch (command) {
    case 'print':
      return interpretPrint(command, input, stdin);
    case 'list':
      return interpretList(command, input, stdin);
    case 'read':
      return interpretRead(command, input, stdin);
    case 'filter':
      return interpretFilter(command, input, stdin);
    case 'replace':
      return interpretReplace(command, input, stdin);
    case 'cut':
      return interpretCut(command, input, stdin);
    case 'count':
      return interpretCount(command, input, stdin);
    case 'execute':
      return interpretExecute(command, input, stdin);
  }
}

function interpretAssignment(assignment) {
  // Get the variable name and value from the assignment object
  const { variable, value } = assignment;
  console.log('VARIABLE:', variable, value)

  // Interpret the value of the assignment
  let interpretedValue;
  if (value.type === "string") {
    interpretedValue = value.value;
  } else if (value.type === "int") {
    interpretedValue = parseInt(value.value);
  } else if (value.type === "command") {
    // Execute the command and get the result
    interpretedValue = interpretPipedCommand(value.value);
  }

  // Assign the interpreted value to the variable
  global[variable] = interpretedValue;
}

function interpretPrint(command, input) {
  return input.text;
}

function interpretList(command, input) {
  const files = fs.readdirSync(input.path);
  return files.join('\n');
}

function interpretRead(command, input) {
  return fs.readFileSync(command.file, 'utf-8');
}

function interpretFilter(command, input) {
  return input.split('\n').filter(line => line.includes(command.token)).join('\n');
}

function interpretReplace(command, input, stdin) {
  return stdin.replaceAll(input.pattern, input.value);
}

function interpretCut(command, input) {
  return input.split(input).join('\n');
}

function interpretCount(command, input, stdin) {
  return stdin.split('\n').length;
}

function interpretExecute(command, input) {
  return interpretPipedCommand(command.value);
}

// Parse and interpret a program
const file = fs.readFileSync(__dirname + '/test.bashy').toString();
const ast = parser.parse(file);
const out = ast.map(interpret)
//const out = interpret(ast[0]);
out.forEach(o => {
  console.log(o)
})
