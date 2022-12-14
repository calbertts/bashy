const { describe, expect, test } = require('@jest/globals')
const parser = require('./parser')

describe("execute", () => {
  test("should parse a simple execute a bashy command", () => {
    const test = 'execute "print $variable"';
    const expectedOutput = [{
      "type": "Commands",
      "commands": [
         {
            "command": "execute",
            "interpreter": {
               "type": "string",
               "value": "bashy"
            },
            "value": {
               "type": "string",
               "value": "print $variable"
            }
         }
      ]
    }]

    const parseOutput = parser.parse(test);
    expect(parseOutput).toEqual(expectedOutput);
  });

  it("should parse an execute a bashy command with a variable value", () => {
    const test = 'execute `list ${$folder}`';
    const expectedOutput = [
       {
          "type": "Commands",
          "commands": [
             {
                "command": "execute",
                "interpreter": {
                   "type": "string",
                   "value": "bashy"
                },
                "value": {
                   "type": "template",
                   "value": [
                      "list ",
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
      `execute -bash < (
        read $file
          > print
          > count
      )`

    const expectedOutput = [
       {
          "type": "Commands",
          "commands": [
             {
                "command": "execute",
                "interpreter": {
                   "type": "string",
                   "value": "bash"
                },
                "value": {
                   "type": "command",
                   "value": [
                      {
                         "command": "read",
                         "file": {
                            "type": "variable",
                            "value": "file"
                         }
                      },
                      {
                         "command": "print",
                         "value": {
                            "stdin": true
                         }
                      },
                      {
                         "command": "count",
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
    const test = `execute -"/usr/local/bin/node" < 'console.log("OK")'`

    const expectedOutput = [
       {
          "type": "Commands",
          "commands": [
             {
                "command": "execute",
                "interpreter": {
                   "type": "string",
                   "value": "/usr/local/bin/node"
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
