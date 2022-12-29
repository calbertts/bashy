const {describe, expect, test} = require('@jest/globals')
const parser = require('./parser')

describe('parallel', () => {
  test('parallel assigments', () => {
    const test = 
      `out1, out2 = 
        | read $file1 > count < print "OK"
        | false
        | "hello"
        | 1.2
        | customCommand $param1, $param2

out1, out2 = 
        | read $file1
        | print "OK" > count < (
            read $file
          )
        | aaa "OK", "YES"`

    const expectedOutput = [
       {
          "type": "ParallelCommands",
          "outputVars": [
             "out1",
             "out2"
          ],
          "commands": [
             {
                "type": "command",
                "value": [
                   {
                      "command": "read",
                      "file": {
                         "type": "variable",
                         "value": "file1"
                      }
                   },
                   {
                      "command": "count",
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
                "type": "boolean",
                "value": false
             },
             {
                "type": "string",
                "value": "hello"
             },
             {
                "type": "decimal",
                "value": 1.2
             },
             {
                "type": "command",
                "value": [
                   {
                      "command": "customCommand",
                      "type": "custom",
                      "params": [
                         {
                            "type": "variable",
                            "value": "param1"
                         },
                         {
                            "type": "variable",
                            "value": "param2"
                         }
                      ],
                      "input": {
                         "stdin": true
                      }
                   }
                ]
             }
          ]
       },
       {
          "type": "ParallelCommands",
          "outputVars": [
             "out1",
             "out2"
          ],
          "commands": [
             {
                "type": "command",
                "value": [
                   {
                      "command": "read",
                      "file": {
                         "type": "variable",
                         "value": "file1"
                      }
                   }
                ]
             },
             {
                "type": "command",
                "value": [
                   {
                      "command": "print",
                      "value": {
                         "type": "string",
                         "value": "OK"
                      }
                   },
                   {
                      "command": "count",
                      "input": {
                         "type": "command",
                         "value": [
                            {
                               "command": "read",
                               "file": {
                                  "type": "variable",
                                  "value": "file"
                               }
                            }
                         ]
                      }
                   }
                ]
             },
             {
                "type": "command",
                "value": [
                   {
                      "command": "aaa",
                      "type": "custom",
                      "params": [
                         {
                            "type": "string",
                            "value": "OK"
                         },
                         {
                            "type": "string",
                            "value": "YES"
                         }
                      ],
                      "input": {
                         "stdin": true
                      }
                   }
                ]
             }
          ]
       }
    ]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })
});
