const { describe, expect, test } = require('@jest/globals')
const parser = require('./parser')

describe('cut', () => {
  test('cut string', () => {
    const test = `cut by "," < read $file`

     const expectedOutput = [
        {
            "type": "Commands",
            "commands": [
                {
                    "command": "cut",
                    "value": {
                       "type": "string",
                       "value": ","
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

  test('cut variable', () => {
    const test = `cut by $myValue < read $file`

     const expectedOutput = [
        {
            "type": "Commands",
            "commands": [
                {
                    "command": "cut",
                    "value": {
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

  test('cut single command', () => {
    const test = `cut by read $file < print`

     const expectedOutput = [
        {
            "type": "Commands",
            "commands": [
                {
                    "command": "cut",
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
                    },
                    "input": {
                       "type": "command",
                       "value": [
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

  describe('cut piped commands', () => {
    test('cut simple piped command', () => {
      const test = `cut by "," < read $file`

      const expectedOutput = [
          {
              "type": "Commands",
              "commands": [
                  {
                      "command": "cut",
                      "value": {
                          "type": "string",
                          "value": ","
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

    test('cut multiple piped commands', () => {
      const test = 
        `read $file
           > cut by ","
           > count
           > print`

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
                  "command": "cut",
                  "value": {
                     "type": "string",
                     "value": ","
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
       ]

      const parseOutput = parser.parse(test)
      expect(parseOutput).toStrictEqual(expectedOutput)
    })

    test('print nested piped commands', () => {
        const test = `print (cut by "," < read $file) > count`

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
                             "command": "cut",
                             "value": {
                                "type": "string",
                                "value": ","
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
  })
})
