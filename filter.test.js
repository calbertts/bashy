const { describe, expect, test } = require('@jest/globals')
const parser = require('./parser')

describe('filter', () => {
  test('filter string', () => {
    const test = `filter "abc" < read $file`
    const expectedOutput = [
      {
        type: "Commands",
        commands: [
          {
            command: "filter",
            token: { type: "string", value: "abc" },
            input: {
              type: "command",
              value: [
                {
                  command: "read",
                  file: { type: "variable", value: "file" }
                }
              ]
            }
          }
        ]
      }
    ]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('filter number', () => {
    const test = `filter 123 < read $file`
    const expectedOutput = [
      {
        type: "Commands",
        commands: [
          {
            command: "filter",
            token: { type: "integer", value: 123 },
            input: {
              type: "command",
              value: [
                {
                  command: "read",
                  file: { type: "variable", value: "file" }
                }
              ]
            }
          }
        ]
      }
    ]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('filter variable', () => {
    const test = `filter $myValue < read $file`

    const expectedOutput = [
        {
            "type": "Commands",
            "commands": [
                {
                    "command": "filter",
                    "token": {
                        "type": "variable",
                        "value": "myValue"
                    },
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
        }
    ]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('filter string from stdin', () => {
    const test = `read $file > filter "abc"`

     const expectedOutput = [
        {
            "type": "Commands",
            "commands": [
                {
                    "command": "read",
                    "file": {
                        "type": "variable",
                        "value": "file"
                    }
                },
                {
                    "command": "filter",
                    "token": {
                        "type": "string",
                        "value": "abc"
                    },
                    "input": {
                        "stdin": true
                    }
                }
            ]
        }
    ]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('filter nested piped commands', () => {
     const test = `filter (print $theToken) < (read $file > print)`

     const expectedOutput = [
         {
             "type": "Commands",
             "commands": [
                 {
                     "command": "filter",
                     "token": {
                         "type": "command",
                         "value": [
                             {
                                 "command": "print",
                                 "value": {
                                     "type": "variable",
                                     "value": "theToken"
                                 }
                             }
                         ]
                     },
                     "input": {
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
                             }
                         ]
                     }
                 }
             ]
         }
     ]

     const parseOutput = parser.parse(test)
     expect(parseOutput).toStrictEqual(expectedOutput)
  })
})
