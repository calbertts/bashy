const {describe, expect, test} = require('@jest/globals')
const parser = require('./parser')

describe('functions', () => {
  test('function definition', () => {
    const test = 
    `hello: name - {upperCase: "-up"}
  print $name

  $template = \`Hello: $var, an expression: \${(
    print $hey
    > count < $input
  )}\`

increment: param1, param2
  print (
    print $ONE
    > count -rw
    > verify
  ) $otherParam
  hello "myname" "other"
  $wok = 1
  list

  store $file
  print 1234
  read
  hello "Carlos" < (
    print $input
    > count
  )

  print "end of function"
increment "hey" "tow"
`

    const expectedOutput = [
       {
          "type": "CommandDefinition",
          "head": {
             "name": "hello",
             "params": [
                "name"
             ],
             "flags": {
                "type": "Map",
                "value": [
                   {
                      "key": {
                         "value": "upperCase"
                      },
                      "value": {
                         "type": "string",
                         "value": "-up"
                      }
                   }
                ]
             }
          },
          "body": [
             {
                "type": "CommandExecution",
                "commands": [
                   {
                      "command": "print",
                      "params": [
                         {
                            "type": "variable",
                            "value": "name"
                         }
                      ],
                      "flags": {},
                      "input": {
                         "stdin": true
                      }
                   }
                ]
             },
             {
                "type": "Assignment",
                "variable": {
                   "type": "new",
                   "variable": "template"
                },
                "value": {
                   "type": "template",
                   "value": [
                      {
                         "type": "string",
                         "value": "Hello: "
                      },
                      {
                         "type": "variable",
                         "value": "var"
                      },
                      {
                         "type": "string",
                         "value": ", an expression: "
                      },
                      {
                         "type": "command",
                         "value": [
                            {
                               "command": "print",
                               "params": [
                                  {
                                     "type": "variable",
                                     "value": "hey"
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
                                  "type": "variable",
                                  "value": "input"
                               }
                            }
                         ]
                      }
                   ]
                }
             }
          ]
       },
       {
          "type": "CommandDefinition",
          "head": {
             "name": "increment",
             "params": [
                "param1",
                "param2"
             ],
             "flags": {}
          },
          "body": [
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
                                  "command": "print",
                                  "params": [
                                     {
                                        "type": "variable",
                                        "value": "ONE"
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
                                  "flags": {
                                     "rw": true
                                  },
                                  "input": {
                                     "stdin": true
                                  }
                               },
                               {
                                  "command": "verify",
                                  "params": null,
                                  "flags": {},
                                  "input": {
                                     "stdin": true
                                  }
                               }
                            ]
                         },
                         {
                            "type": "variable",
                            "value": "otherParam"
                         }
                      ],
                      "flags": {},
                      "input": {
                         "stdin": true
                      }
                   }
                ]
             },
             {
                "type": "CommandExecution",
                "commands": [
                   {
                      "command": "hello",
                      "params": [
                         {
                            "type": "string",
                            "value": "myname"
                         },
                         {
                            "type": "string",
                            "value": "other"
                         }
                      ],
                      "flags": {},
                      "input": {
                         "stdin": true
                      }
                   }
                ]
             },
             {
                "type": "Assignment",
                "variable": {
                   "type": "new",
                   "variable": "wok"
                },
                "value": {
                   "type": "integer",
                   "value": 1
                }
             },
             {
                "type": "CommandExecution",
                "commands": [
                   {
                      "command": "list",
                      "params": null,
                      "flags": {},
                      "input": {
                         "stdin": true
                      }
                   }
                ]
             },
             {
                "type": "CommandExecution",
                "commands": [
                   {
                      "command": "store",
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
             },
             {
                "type": "CommandExecution",
                "commands": [
                   {
                      "command": "print",
                      "params": [
                         {
                            "type": "integer",
                            "value": 1234
                         }
                      ],
                      "flags": {},
                      "input": {
                         "stdin": true
                      }
                   }
                ]
             },
             {
                "type": "CommandExecution",
                "commands": [
                   {
                      "command": "read",
                      "params": null,
                      "flags": {},
                      "input": {
                         "stdin": true
                      }
                   }
                ]
             },
             {
                "type": "CommandExecution",
                "commands": [
                   {
                      "command": "hello",
                      "params": [
                         {
                            "type": "string",
                            "value": "Carlos"
                         }
                      ],
                      "flags": {},
                      "input": {
                         "type": "command",
                         "value": [
                            {
                               "command": "print",
                               "params": [
                                  {
                                     "type": "variable",
                                     "value": "input"
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
                   }
                ]
             },
             {
                "type": "CommandExecution",
                "commands": [
                   {
                      "command": "print",
                      "params": [
                         {
                            "type": "string",
                            "value": "end of function"
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
       },
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "increment",
                "params": [
                   {
                      "type": "string",
                      "value": "hey"
                   },
                   {
                      "type": "string",
                      "value": "tow"
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
});
