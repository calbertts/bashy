const {describe, expect, test} = require('@jest/globals')
const parser = require('./parser')

describe('read', () => {
	test('read file', () => {
		const test = `read "file.txt"`

		const expectedOutput = [{
			"type": "Commands",
			"commands": [{
				"command": "read",
				"file": {
					"type": "string",
					"value": "file.txt"
				}
			}]
		}]

		const parseOutput = parser.parse(test)
		expect(parseOutput).toStrictEqual(expectedOutput)
	})

	test('read variable', () => {
		const test = `read $myFile`

		const expectedOutput = [{
			"type": "Commands",
			"commands": [{
				"command": "read",
				"file": {
					"type": "variable",
					"value": "myFile"
				}
			}]
		}]

		const parseOutput = parser.parse(test)
		expect(parseOutput).toStrictEqual(expectedOutput)
	})

	test('read command', () => {
		const test = `read (print 123)`

		const expectedOutput = [{
			"type": "Commands",
			"commands": [{
				"command": "read",
				"file": {
					"type": "command",
					"value": [{
						"command": "print",
						"value": {
							"type": "integer",
							"value": 123
						}
					}]
				}
			}]
		}]

		const parseOutput = parser.parse(test)
		expect(parseOutput).toStrictEqual(expectedOutput)
	})

	describe('read piped commands', () => {
		test('read simple piped command', () => {
			const test = `read > print 123`

			const expectedOutput = [{
				"type": "Commands",
				"commands": [{
					"command": "read",
					"file": {
						"stdin": true
					}
				}, {
					"command": "print",
					"value": {
						"type": "integer",
						"value": 123
					}
				}]
			}]

			const parseOutput = parser.parse(test)
			expect(parseOutput).toStrictEqual(expectedOutput)
		})

    test('read multiple piped commands', () => {
      const test = 
        `read
           > filter 123
           > count`

       const expectedOutput = [
         {
            "type": "Commands",
            "commands": [
               {
                  "command": "read",
                  "file": {
                     "stdin": true
                  }
               },
               {
                  "command": "filter",
                  "token": {
                     "type": "integer",
                     "value": 123
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
       ]

      const parseOutput = parser.parse(test)
      expect(parseOutput).toStrictEqual(expectedOutput)
    })

    test('read nested piped commands', () => {
      const test = 
        `read (
           filter 123
             > count
             > print
         ) > count`

       const expectedOutput = [
         {
            "type": "Commands",
            "commands": [
               {
                  "command": "read",
                  "file": {
                     "type": "command",
                     "value": [
                        {
                           "command": "filter",
                           "token": {
                              "type": "integer",
                              "value": 123
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
                        },
                        {
                           "command": "print",
                           "value": {
                              "stdin": true
                           }
                        }
                     ]
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
       ]

      const parseOutput = parser.parse(test)
      expect(parseOutput).toStrictEqual(expectedOutput)
    })

    test('read multiple nested piped commands', () => {
      const test = `read (read (read "file.pdf" > print) > count) > store "myfile"`

       const expectedOutput = [
          {
              "type": "Commands",
              "commands": [
                  {
                      "command": "read",
                      "file": {
                          "type": "command",
                          "value": [
                              {
                                  "command": "read",
                                  "file": {
                                      "type": "command",
                                      "value": [
                                          {
                                              "command": "read",
                                              "file": {
                                                  "type": "string",
                                                  "value": "file.pdf"
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
})
