const {describe, expect, test} = require('@jest/globals')
const parser = require('./parser')

describe('command', () => {
  test('print string', () => {
    const test = `print "Hello World"`

     const expectedOutput = [
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "print",
                "params": [
                   {
                      "type": "string",
                      "value": "Hello World"
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

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('print with flags', () => {
    const test = `print -s "Hello World"`

     const expectedOutput = [
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "print",
                "params": [
                   {
                      "type": "string",
                      "value": "Hello World"
                   }
                ],
                "flags": {
                   "s": true
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

  test('print number', () => {
    const test = `print 123`

     const expectedOutput = [
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "print",
                "params": [
                   {
                      "type": "integer",
                      "value": 123
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

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('print variable', () => {
    const test = `print $myValue`

     const expectedOutput = [
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "print",
                "params": [
                   {
                      "type": "variable",
                      "value": "myValue"
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

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  test('print single command', () => {
    const test = 
    `print (
      read $file
    )`

     const expectedOutput = [
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "print",
                "params": [
                   {
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
                         }
                      ]
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

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })

  describe('print piped commands', () => {
    test('print simple piped command', () => {
      const test = `print
        > read $file`

       const expectedOutput = [
         {
            "type": "CommandExecution",
            "commands": [
               {
                  "command": "print",
                  "params": null,
                  "flags": {},
                  "input": {
                     "stdin": true
                  }
               },
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
           > read $file
           > count
        `

       const expectedOutput = [
         {
            "type": "CommandExecution",
            "commands": [
               {
                  "command": "print",
                  "params": null,
                  "flags": {},
                  "input": {
                     "stdin": true
                  }
               },
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
                  "command": "count",
                  "params": null,
                  "flags": {},
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

    test('print nested piped commands', () => {
      const test = 
        `print (
           read $file
             > count
             > print
         )
         > count`

       const expectedOutput = [
         {
            "type": "CommandExecution",
            "commands": [
               {
                  "command": "print",
                  "params": [
                     {
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
                              "command": "count",
                              "params": null,
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
                                 "stdin": true
                              }
                           }
                        ]
                     }
                  ],
                  "flags": {},
                  "input": {
                     "stdin": true
                  }
               },
               {
                  "command": "count",
                  "params": null,
                  "flags": {},
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
      const test = `print (
        read (
          read "file.pdf" 
          > print
        )
        > count
      )
      > store "myfile"
      `

       const expectedOutput = [
         {
            "type": "CommandExecution",
            "commands": [
               {
                  "command": "print",
                  "params": [
                     {
                        "type": "command",
                        "value": [
                           {
                              "command": "read",
                              "params": [
                                 {
                                    "type": "command",
                                    "value": [
                                       {
                                          "command": "read",
                                          "params": [
                                             {
                                                "type": "string",
                                                "value": "file.pdf"
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
                                             "stdin": true
                                          }
                                       }
                                    ]
                                 }
                              ],
                              "flags": {},
                              "input": {
                                 "stdin": true
                              }
                           },
                           {
                              "command": "count",
                              "params": null,
                              "flags": {},
                              "input": {
                                 "stdin": true
                              }
                           }
                        ]
                     }
                  ],
                  "flags": {},
                  "input": {
                     "stdin": true
                  }
               },
               {
                  "command": "store",
                  "params": [
                     {
                        "type": "string",
                        "value": "myfile"
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

      const parseOutput = parser.parse(test)
      expect(parseOutput).toStrictEqual(expectedOutput)
    })
  })

  describe('print from input', () => {
    test('print single command', () => {
      const test = `print < (
  read $file
)`

       const expectedOutput = [
         {
            "type": "CommandExecution",
            "commands": [
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
                                 "value": "file"
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
      ]

      const parseOutput = parser.parse(test)
      expect(parseOutput).toStrictEqual(expectedOutput)
    })

    test('print piped command', () => {
      const test = 
        `print < (
          read (
            print "filename"
          )
          > sort
        )
      `

       const expectedOutput = [
         {
            "type": "CommandExecution",
            "commands": [
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
                                 "type": "command",
                                 "value": [
                                    {
                                       "command": "print",
                                       "params": [
                                          {
                                             "type": "string",
                                             "value": "filename"
                                          }
                                       ],
                                       "flags": {},
                                       "input": {
                                          "stdin": true
                                       }
                                    }
                                 ]
                              }
                           ],
                           "flags": {},
                           "input": {
                              "stdin": true
                           }
                        },
                        {
                           "command": "sort",
                           "params": null,
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
      ]

      const parseOutput = parser.parse(test)
      expect(parseOutput).toStrictEqual(expectedOutput)
    })
  })
})
