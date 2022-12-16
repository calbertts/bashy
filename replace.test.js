const { describe, expect, test } = require('@jest/globals')
const parser = require('./parser')

describe('replace', () => {
  test('replace simple piped command', () => {
    const test = `replace "old" by "new" < read file`

    const expectedOutput = [{
      "type": "Commands",
      "commands": [{
        "command": "replace",
        "oldValue": {
          "type": "string",
          "value": "old"
        },
        "newValue": {
          "type": "string",
          "value": "new"
        },
        "input": {
          "type": "command",
          "value": [{
            "command": "read",
            "file": {
              "type": "variable",
              "value": "file"
            }
          }]
        }
      }]
    }]
  })

  test('replace multiple piped commands', () => {
    const test = `replace "old" by "new" < read file > print`

    const expectedOutput = [{
      "type": "Commands",
      "commands": [{
        "command": "replace",
        "pattern": {
          "type": "string",
          "value": "old"
        },
        "replace": {
          "type": "string",
          "value": "new"
        },
        "input": {
          "type": "command",
          "value": [{
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
      }]
    }]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('replace simple command', () => {
    const test = `replace "old" by "new"`

    const expectedOutput = [{
      "type": "Commands",
      "commands": [{
        "command": "replace",
        "pattern": {
          "type": "string",
          "value": "old"
        },
        "replace": {
          "type": "string",
          "value": "new"
        },
        "input": {
          "stdin": true
        }
      }]
    }]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('replace multiple piped commands', () => {
    const test = `replace "old" by "new" < read file > print`

    const expectedOutput = [
      {
        "type": "Commands",
        "commands": [
          {
            "command": "replace",
            "pattern": {
              "type": "string",
              "value": "old"
            },
            "replace": {
              "type": "string",
              "value": "new"
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

  test('replace nested piped commands', () => {
    const test = `replace "old" by "new" < (read file) > print`
    const expectedOutput = [{
      "type": "Commands",
      "commands": [{
          "command": "replace",
          "pattern": {
            "type": "string",
            "value": "old"
          },
          "replace": {
            "type": "string",
            "value": "new"
          },
          "input": {
            "type": "command",
            "value": [{
              "command": "read",
              "file": {
                "type": "variable",
                "value": "file"
              }
            }]
          }
        },
        {
          "command": "print",
          "value": {
            "stdin": true
          }
        }
      ]
    }]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })
})
