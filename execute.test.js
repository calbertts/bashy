const { describe, expect, test } = require('@jest/globals')
const parser = require('./parser')

describe("execute", () => {
  test("should parse a simple execute a bashy command", () => {
    const test = '~$ --interpreter="bashy" "print $variable"';
    const expectedOutput = [
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "execute",
                "flags": {
                   "interpreter": {
                      "type": "string",
                      "value": "bashy"
                   }
                },
                "value": {
                   "type": "string",
                   "value": "print $variable"
                }
             }
          ]
       }
    ]

    const parseOutput = parser.parse(test);
    expect(parseOutput).toEqual(expectedOutput);
  });

  it("should parse an execute a bashy command with a variable value", () => {
    const test = '~$ --interpreter="bashy" `list ${$folder}`';
    const expectedOutput = [
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "execute",
                "flags": {
                   "interpreter": {
                      "type": "string",
                      "value": "bashy"
                   }
                },
                "value": {
                   "type": "template",
                   "value": [
                      {
                         "type": "string",
                         "value": "list "
                      },
                      {
                         "type": "variable",
                         "value": "folder"
                      }
                   ]
                }
             }
          ]
       }
    ]

    const parseOutput = parser.parse(test);
    expect(parseOutput).toEqual(expectedOutput);
  });

  it("should parse an execute a bash command with an input redirection", () => {
    const test = 
      `~$ --interpreter="bash" < (
        read $file
          > print
          > count
      )`

    const expectedOutput = [
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "execute",
                "flags": {
                   "interpreter": {
                      "type": "string",
                      "value": "bash"
                   }
                },
                "value": {
                   "type": "command",
                   "value": [
                      {
                         "command": "read",
                         "params": [
                            {
                               "type": "variable",
                               "value": "file"
                            }
                         ],
                         "flags": {},
                         "input": {
                            "stdin": true
                         }
                      },
                      {
                         "command": "print",
                         "params": null,
                         "flags": {},
                         "input": {
                            "stdin": true
                         }
                      },
                      {
                         "command": "count",
                         "params": null,
                         "flags": {},
                         "input": {
                            "stdin": true
                         }
                      }
                   ]
                }
             }
          ]
       }
    ]

    const parseOutput = parser.parse(test);
    expect(parseOutput).toEqual(expectedOutput);
  });

  it("should parse an execute a nodejs command with an input redirection", () => {
    const test = `~$ --interpreter="/usr/local/bin/node" < 'console.log("OK")'`

    const expectedOutput = [
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "execute",
                "flags": {
                   "interpreter": {
                      "type": "string",
                      "value": "/usr/local/bin/node"
                   }
                },
                "value": {
                   "type": "string",
                   "value": "console.log(\"OK\")"
                }
             }
          ]
       }
    ]

    const parseOutput = parser.parse(test);
    expect(parseOutput).toEqual(expectedOutput);
  });
});
