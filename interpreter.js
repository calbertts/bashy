const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('node:child_process');
const parser = require('./parser')

function interpret(ast, scope) {
  if (!ast) {
    return
  }

  switch (ast.type) {
    case 'CommandExecution':
      return interpretPipedCommand(ast.commands, scope);
    case 'Assignment':
      interpretAssignment(ast, scope);
      break;
    case 'CommandDefinition':
      interpretCommandDefinition(ast, scope);
      break;
    default:
      console.log("ERROR:", ast.type)
  }
}

function interpretPipedCommand(commands, scope) {
  let result = null;
  for (const _command of commands) {
    const { command, type, ...input } = _command;
    result = interpretSingleCommand(command, type, input, result, scope);
  }
  return result;
}

function interpretSingleCommand(command, type, input, stdin, scope) {
  // console.log('single', command, type, input, stdin, scope);

  if (command == "execute") {
    return interpretExecute(command, input, stdin, scope);
  }

  if (command == "eval") {
    return interpretEval(command, input, stdin, scope);
  }

  const paramsValues = [...input.params || []].map(param => {
    return interpretValue(param, scope);
  });

  Object.keys(global[command].params).forEach((key, index) => {
    global[command].params[key] = paramsValues[index];
  });

  global[command].params["__stdin"] = stdin;

  const fn = global[command].fn;
  const fnResult = fn(global[command].params);
  // console.log('FN RESULT:', fnResult);
  return fnResult;

  /*switch (command) {
    case 'print':
      interpretPrint(command, input, stdin, scope);
      break;
    case 'return':
      return interpretReturn(command, input, stdin, scope);
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
      console.log('exx')
      return interpretExecute(command, input, stdin);
  }*/
}

function interpretCommandDefinition(ast, scope) {
  global[ast.head.name] = {};
  global[ast.head.name].body = ast.body;
  global[ast.head.name].params = {};
  ast.head.params.forEach(param => {
    global[ast.head.name].params[param] = undefined;
  });
  global[ast.head.name].fn = function (params) {
    return start(global[ast.head.name].body, params);
  }
}

function interpretValue(ast, scope) {
  if (ast) {
    switch (ast.type) {
      case 'variable':
        return (scope && scope[ast.value]) || global[ast.value];
      case 'number':
      case 'string':
      case 'decimal':
      case 'integer':
      case 'boolean':
        return ast.value;
      case 'template':
        return ast.value.map(item => {
          return interpretValue(item, scope)
        }).join("");
      case 'command':
        return interpretPipedCommand(ast.value);
    }
  }
}

function interpretAssignment(assignment, scope) {
  // Get the variable name and value from the assignment object
  const { variable, value } = assignment;

  // Interpret the value of the assignment
  const interpretedValue = interpretValue(value, scope);

  // Assign the interpreted value to the variable
  if (scope)
    scope[variable] = interpretedValue;
  else
    global[variable] = interpretedValue;
}

function interpretPrint(command, input, stdin, scope) {
  let value = interpretValue(input.value, scope);
  if (stdin)
    value = stdin

  console.log(value);
  // return value;
}

function interpretReturn(command, input, stdin, scope) {
  let value = interpretValue(input.value, scope);
  return value;
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

function interpretExecute(command, input, stdin, scope) {
  const code = interpretValue(input.value, scope);
  // console.log('code:', code);
  exec(code, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return;
    }
    console.log(stdout.trim());
  });
  // return interpretPipedCommand(command.value);
}

function interpretEval(command, input, stdin, scope) {
  const code = interpretValue(input.value, scope);

  const fileContent = fs.readFileSync(path.resolve(__dirname + "/" + code)).toString();
  const ast = parser.parse(fileContent);

  start(ast, scope);
}

// Parse and interpret a program
const file = fs.readFileSync(__dirname + '/test.bashy').toString();
const ast = parser.parse(file);

// console.log('parser:', JSON.stringify(ast, null, 2))

function start(ast, scope) {
  const out = [];
  for (const sentence of ast) {
    //console.log('SENTENCE:', sentence);
    if (sentence && sentence.type === "Commands" && sentence.commands[0].command === "return") {
      out.push(interpret(sentence, scope));
      break;
    }

    out.push(interpret(sentence, scope));
  }

  const finalOut = out.filter(o => !!o);
  return finalOut;
}

start(ast);
