const { describe, expect, test } = require('@jest/globals')
const parser = require('./parser')

describe('store', () => {
  test('store simple piped command', () => {
    const test = `store "myfile" < read $file`

    const expectedOutput = [{
      "type": "Commands",
      "commands": [{
        "command": "store",
        "filename": {
          "type": "string",
          "value": "myfile"
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

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('store multiple piped commands', () => {
    const test = `store "myfile" < read $file > filter "abc" > count`

    const expectedOutput = [
      {
        "type": "Commands",
        "commands": [
          {
            "command": "store",
            "filename": {
              "type": "string",
              "value": "myfile"
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
                  "command": "filter",
                  "token": {
                    "type": "string",
                    "value": "abc"
                  },
                  "input": {
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

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('store from stdin', () => {
    const test = `store "myfile"`

    const expectedOutput = [{
      "type": "Commands",
      "commands": [{
        "command": "store",
        "filename": {
          "type": "string",
          "value": "myfile"
        },
        "input": {
          "stdin": true
        }
      }]
    }]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('store variable filename', () => {
    const test = `store $myFile < read $file`

    const expectedOutput = [{
      "type": "Commands",
      "commands": [{
        "command": "store",
        "filename": {
          "type": "variable",
          "value": "myFile"
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

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

	test('store command filename', () => {
		const test = `store (print $myFile) < read $file`

		const expectedOutput = [{
			"type": "Commands",
			"commands": [{
				"command": "store",
				"filename": {
					"type": "command",
					"value": [{
						"command": "print",
						"value": {
							"type": "variable",
							"value": "myFile"
						}
					}]
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

		const parseOutput = parser.parse(test)
		expect(parseOutput).toStrictEqual(expectedOutput)
	})
})
