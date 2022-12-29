const {describe, expect, test} = require('@jest/globals')
const parser = require('./parser')

describe('sort', () => {
  test('sort command with options', () => {
    const test = `sort -des < read file`

    const expectedOutput = [
       {
          "type": "Commands",
          "commands": [
             {
                "command": "sort",
                "opt": {
                  "type": "string",
                  "value": "des"
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

  test('sort command with input', () => {
    const test = `print lines > sort`

    const expectedOutput = [{
      "type": "Commands",
      "commands": [{
        "command": "print",
        "value": {
          "type": "variable",
          "value": "lines"
        }
      }, {
        "command": "sort",
        "opt": {
          "type": "string",
          "value": "asc"
        },
        "input": {
          "stdin": true
        }
      }]
    }]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('sort param as variable', () => {
    const test = `print lines > sort -(print "asc")`

    const expectedOutput = [
       {
          "type": "Commands",
          "commands": [
             {
                "command": "print",
                "value": {
                   "type": "variable",
                   "value": "lines"
                }
             },
             {
                "command": "sort",
                "opt": {
                   "type": "command",
                   "value": [
                      {
                         "command": "print",
                         "value": {
                            "type": "string",
                            "value": "asc"
                         }
                      }
                   ]
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
})
