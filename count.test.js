const { describe, expect, test } = require('@jest/globals')
const parser = require('./parser')

describe('count command', () => {
	test('count simple command', () => {
		const test = `count < read $file`
		const expectedOutput = [{
			"type": "Commands",
			"commands": [{
				"command": "count",
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

	test('count multiple piped commands', () => {
		const test = `print (read $file > filter "abc") > count`
		const expectedOutput = [{
			"type": "Commands",
			"commands": [{
					"command": "print",
					"value": {
						"type": "command",
						"value": [{
							"command": "read",
							"file": {
								"type": "variable",
								"value": "file"
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
						}]
					}
				},
				{
					"command": "count",
					"input": {
						"stdin": true
					}
				}
			]
		}]
		const parseOutput = parser.parse(test)
		expect(parseOutput).toStrictEqual(expectedOutput)
	})

	test('count nested piped commands', () => {
		const test = `count < (print (read $file > filter "abc"))`
		const expectedOutput = [{
			"type": "Commands",
			"commands": [{
				"command": "count",
				"input": {
					"type": "command",
					"value": [{
						"command": "print",
						"value": {
							"type": "command",
							"value": [{
								"command": "read",
								"file": {
									"type": "variable",
									"value": "file"
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
							}]
						}
					}]
				}
			}]
		}]
		const parseOutput = parser.parse(test)
		expect(parseOutput).toStrictEqual(expectedOutput)
	})
})
