const {describe, expect, test} = require('@jest/globals')
const parser = require('./parser')

describe('functions', () => {
  test('function definition', () => {
    const test = 
    `myFunction: param1, param2
     variable = true
     filter $file < (
       print "OK"
     )
     print $variable

var = myFunction print "ab", "cd" > print`

    const expectedOutput = [
       {
          "type": "CustomCommand",
          "head": {
             "name": "myFunction",
             "params": [
                "param1",
                "param2"
             ]
          },
          "body": [
             {
                "type": "Assignment",
                "variable": "variable",
                "value": {
                   "type": "boolean",
                   "value": true
                }
             },
             {
                "type": "Commands",
                "commands": [
                   {
                      "command": "filter",
                      "token": {
                         "type": "variable",
                         "value": "file"
                      },
                      "input": {
                         "type": "command",
                         "value": [
                            {
                               "command": "print",
                               "value": {
                                  "type": "string",
                                  "value": "OK"
                               }
                            }
                         ]
                      }
                   }
                ]
             },
             {
                "type": "Commands",
                "commands": [
                   {
                      "command": "print",
                      "value": {
                         "type": "variable",
                         "value": "variable"
                      }
                   }
                ]
             }
          ]
       },
       {
          "type": "Assignment",
          "variable": "var",
          "value": {
             "type": "command",
             "value": [
                {
                   "command": "myFunction",
                   "type": "custom",
                   "params": [
                      {
                         "type": "command",
                         "value": [
                            {
                               "command": "print",
                               "value": {
                                  "type": "string",
                                  "value": "ab"
                               }
                            }
                         ]
                      },
                      {
                         "type": "string",
                         "value": "cd"
                      }
                   ],
                   "input": {
                      "stdin": true
                   }
                },
                {
                   "command": "print",
                   "value": {
                      "stdin": true
                   }
                }
             ]
          }
       }
    ]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })
});
