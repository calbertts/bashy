const {describe, expect, test} = require('@jest/globals')
const parser = require('./parser')

describe('maps', () => {
  test('maps declaration', () => {
    const test = 
      `var = {
  key1: "value",
  [
    print "KEY" > count < read $file
  ]: print $var,
  [1]: comma "one"
}`

    const expectedOutput = [
       {
          "type": "Assignment",
          "variable": "var",
          "value": {
             "type": "Map",
             "value": [
                {
                   "key": {
                      "value": "key1"
                   },
                   "value": {
                      "type": "string",
                      "value": "value"
                   }
                },
                {
                   "key": {
                      "type": "command",
                      "value": [
                         {
                            "command": "print",
                            "value": {
                               "type": "string",
                               "value": "KEY"
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
                   "value": {
                      "type": "command",
                      "value": [
                         {
                            "command": "print",
                            "value": {
                               "type": "variable",
                               "value": "var"
                            }
                         }
                      ]
                   }
                },
                {
                   "key": {
                      "type": "integer",
                      "value": 1
                   },
                   "value": {
                      "type": "command",
                      "value": [
                         {
                            "command": "comma",
                            "type": "custom",
                            "params": [
                               {
                                  "type": "string",
                                  "value": "one"
                               }
                            ],
                            "input": {
                               "stdin": true
                            }
                         }
                      ]
                   }
                }
             ]
          }
       }
    ]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })
})
