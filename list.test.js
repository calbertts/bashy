const { describe, expect, test } = require('@jest/globals')
const parser = require('./parser')

describe('list', () => {
	test('list simple command', () => {
		const test = `list`

		const expectedOutput = [{
			"type": "Commands",
			"commands": [{
				"command": "list",
				"path": {
					"stdin": true
				}
			}]
		}]

		const parseOutput = parser.parse(test)
		expect(parseOutput).toStrictEqual(expectedOutput)
	})

	test('list path string', () => {
		const test = `list "my/path"`

		const expectedOutput = [{
			"type": "Commands",
			"commands": [{
				"command": "list",
				"path": {
					"type": "string",
					"value": "my/path"
				}
			}]
		}]

		const parseOutput = parser.parse(test)
		expect(parseOutput).toStrictEqual(expectedOutput)
	})

	test('list path variable', () => {
		const test = `list myPath`

		const expectedOutput = [{
			"type": "Commands",
			"commands": [{
				"command": "list",
				"path": {
					"type": "variable",
					"value": "myPath"
				}
			}]
		}]

		const parseOutput = parser.parse(test)
		expect(parseOutput).toStrictEqual(expectedOutput)
	})

	test('list command inside piped command', () => {
		const test = `list > filter "abc" > count`

		const expectedOutput = [{
			"type": "Commands",
			"commands": [{
				"command": "list",
				"path": {
					"stdin": true
				}
			}, {
				"command": "filter",
				"token": {
					"type": "string",
					"value": "abc"
				},
				"input": {
					"stdin": true
				}
			}, {
				"command": "count",
				"input": {
					"stdin": true
				}
			}]
		}]

		const parseOutput = parser.parse(test)
		expect(parseOutput).toStrictEqual(expectedOutput)
	})

  test('list nested piped command', () => {
    const test = `list (read "file.txt" > filter "abc" > count) > store "myfile"`

     const expectedOutput = [
       {
          "type": "Commands",
          "commands": [
             {
                "command": "list",
                "path": {
                   "type": "command",
                   "value": [
                      {
                         "command": "read",
                         "file": {
                            "type": "string",
                            "value": "file.txt"
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
             },
             {
                "command": "store",
                "filename": {
                   "type": "string",
                   "value": "myfile"
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
