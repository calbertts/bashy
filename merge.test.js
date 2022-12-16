const { describe, expect, test } = require('@jest/globals')
const parser = require('./parser')

describe('merge', () => {
  test('merge simple command', () => {
    const test = `merge (read file1), (read file2), "string"`

    const expectedOutput = [{
      "type": "Commands",
      "commands": [{
        "command": "merge",
        "inputs": [{
            "type": "command",
            "value": [{
              "command": "read",
              "file": {
                "type": "variable",
                "value": "file1"
              }
            }]
          },
          {
            "type": "command",
            "value": [{
              "command": "read",
              "file": {
                "type": "variable",
                "value": "file2"
              }
            }]
          },
          {
            "type": "string",
            "value": "string"
          }
        ]
      }]
    }]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('merge muliple line command', () => {
    const test =
      `merge 
         read file1,
         read file2,
         "string"`

    const expectedOutput = [{
      "type": "Commands",
      "commands": [{
        "command": "merge",
        "inputs": [{
            "type": "command",
            "value": [{
              "command": "read",
              "file": {
                "type": "variable",
                "value": "file1"
              }
            }]
          },
          {
            "type": "command",
            "value": [{
              "command": "read",
              "file": {
                "type": "variable",
                "value": "file2"
              }
            }]
          },
          {
            "type": "string",
            "value": "string"
          }
        ]
      }]
    }]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })
})
