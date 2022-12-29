const {describe, expect, test} = require('@jest/globals')
const parser = require('./parser')

describe('print', () => {
  test('print string', () => {
    const test = `print "Hello World"`

     const expectedOutput = [
       {
          "type": "Commands",
          "commands": [
             {
                "command": "print",
                "value": {
                   "type": "string",
                   "value": "Hello World"
                }
             }
          ]
       }
     ]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('print number', () => {
    const test = `print 123`

     const expectedOutput = [
       {
          "type": "Commands",
          "commands": [
             {
                "command": "print",
                "value": {
                   "type": "integer",
                   "value": 123
                }
             }
          ]
       }
     ]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('print variable', () => {
    const test = `print myValue`

     const expectedOutput = [
       {
          "type": "Commands",
          "commands": [
             {
                "command": "print",
                "value": {
                   "type": "variable",
                   "value": "myValue"
                }
             }
          ]
       }
     ]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('print single command', () => {
    const test = `print read file`

     const expectedOutput = [
       {
          "type": "Commands",
          "commands": [
             {
                "command": "print",
                "value": {
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

  describe('print piped commands', () => {
    test('print simple piped command', () => {
      const test = `print > read file`

       const expectedOutput = [
         {
            "type": "Commands",
            "commands": [
               {
                  "command": "print",
                  "value":  {
                     "stdin": true
                  }
               },
               {
                  "command": "read",
                  "file": {
                     "type": "variable",
                     "value": "file"
                  }
               }
            ]
         }
       ]

      const parseOutput = parser.parse(test)
      expect(parseOutput).toStrictEqual(expectedOutput)
    })

    test('print multiple piped commands', () => {
      const test = 
        `print
           > read file
           > count
        `

       const expectedOutput = [
         {
            "type": "Commands",
            "commands": [
               {
                  "command": "print",
                  "value":  {
                     "stdin": true
                  }
               },
               {
                  "command": "read",
                  "file": {
                     "type": "variable",
                     "value": "file"
                  }
               },
               {
                  "command": "count",
                  "input": {
                     "stdin": true
                  }
               },
            ]
         }
       ]

      const parseOutput = parser.parse(test)
      expect(parseOutput).toStrictEqual(expectedOutput)
    })

    test('print nested piped commands', () => {
      const test = 
        `print (
           read file
             > count
             > print
         ) > count`

       const expectedOutput = [
         {
            "type": "Commands",
            "commands": [
                {
                    "command": "print",
                    "value": {
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

    test('print multiple nested piped commands', () => {
      const test = `print (read (read "file.pdf" > print) > count) > store "myfile"`

       const expectedOutput = [
         {
            "type": "Commands",
            "commands": [
                {
                    "command": "print",
                    "value": {
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

  describe('print from input', () => {
    test('print single command', () => {
      const test = `print < read file`

       const expectedOutput = [
         {
            "type": "Commands",
            "commands": [
               {
                  "command": "print",
                  "value": {
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

    test('print piped command', () => {
      const test = 
        `print < (
           read (
             print "filename"
           ) > sort
         )`

       const expectedOutput = [
         {
            "type": "Commands",
            "commands": [
               {
                  "command": "print",
                  "value": {
                     "type": "command",
                     "value": [
                        {
                           "command": "read",
                           "file": {
                              "type": "command",
                              "value": [
                                 {
                                    "command": "print",
                                    "value": {
                                       "type": "string",
                                       "value": "filename"
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           "command": "sort",
                           "opt": {
                             "type": "string",
                             "value": "asc"
                           },
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
  })
})
