const { describe, expect, test } = require('@jest/globals')
const parser = require('./parser')

describe("variables", () => {
  test("assign string value", () => {
    const test = '$string = "Hello World!"\nprint $string'
    const result = parser.parse(test)
    const expected = [
       {
          "type": "Assignment",
          "variable": "string",
          "value": {
             "type": "string",
             "value": "Hello World!"
          }
       },
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "print",
                "params": [
                   {
                      "type": "variable",
                      "value": "string"
                   }
                ],
                "flags": {},
                "input": {
                   "stdin": true
                }
             }
          ]
       }
    ]
    expect(result).toEqual(expected)
  })

  test("assign integer value", () => {
    const test = '$int = 123\nprint $int'
    const result = parser.parse(test)
    const expected = [
       {
          "type": "Assignment",
          "variable": "int",
          "value": {
             "type": "integer",
             "value": 123
          }
       },
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "print",
                "params": [
                   {
                      "type": "variable",
                      "value": "int"
                   }
                ],
                "flags": {},
                "input": {
                   "stdin": true
                }
             }
          ]
       }
    ]
    expect(result).toEqual(expected)
  })

  test("assign decimal value", () => {
    const test = '$dec = 123.456\nprint $dec'
    const result = parser.parse(test)
    const expected = [
       {
          "type": "Assignment",
          "variable": "dec",
          "value": {
             "type": "decimal",
             "value": 123.456
          }
       },
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "print",
                "params": [
                   {
                      "type": "variable",
                      "value": "dec"
                   }
                ],
                "flags": {},
                "input": {
                   "stdin": true
                }
             }
          ]
       }
    ]
    expect(result).toEqual(expected)
  })

  test("assign boolean value", () => {
    const test = '$bool = true'
    const result = parser.parse(test)
    const expected = [
       {
          "type": "Assignment",
          "variable": "bool",
          "value": {
             "type": "boolean",
             "value": true
          }
       }
    ]

    expect(result).toEqual(expected)
  })

  test("assign command output", () => {
    const test =
      `$commandResult = (
        read $file 
        > print < (
          read $path
        )
      )`
    const result = parser.parse(test)
    const expected = [
       {
          "type": "Assignment",
          "variable": "commandResult",
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
                      "type": "command",
                      "value": [
                         {
                            "command": "read",
                            "params": [
                               {
                                  "type": "variable",
                                  "value": "path"
                               }
                            ],
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
       }
    ]

    expect(result).toEqual(expected)
  })
})
