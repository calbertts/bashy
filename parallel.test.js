const {describe, expect, test} = require('@jest/globals')
const parser = require('./parser')

describe('parallel', () => {
  test('parallel assigments', () => {
    const test = 
      `
$out1, $out2, $out3, $out4 = 
  | print "OK"
  | request "GET" "http://google.com"
  | hello "Carlos" < (
      print $input
      > count
    )
  | count

[$array] =
  | print "OK"
  | request "GET" "http://google.com"
  | hello "Carlos" < (
      print $input
      > count
    )
  | count

otherFunc: p1
  print $m

  hello
  read < (
    print "omg"
  )

  [$outputs:2] = 
    | print "OK"
    | request "GET" "http://google.com"
    | hello "Carlos" < (
        print $input
        > store
      )
    | read

  $returnValue = "valor"


[$salida] = 
  | print "first" "second" true 1.3 456 < (
      print "an input"
    )
  | request "GET" "http://google.com"
  | hello "Carlos" < "Input here"
`

    const expectedOutput = [
       {
          "type": "ParallelCommands",
          "outputType": "variables",
          "outputVars": [
             "$out1",
             "$out2",
             "$out3",
             "$out4"
          ],
          "commands": [
             {
                "command": "print",
                "params": [
                   {
                      "type": "string",
                      "value": "OK"
                   }
                ],
                "flags": {},
                "input": {
                   "stdin": true
                }
             },
             {
                "command": "request",
                "params": [
                   {
                      "type": "string",
                      "value": "GET"
                   },
                   {
                      "type": "string",
                      "value": "http://google.com"
                   }
                ],
                "flags": {},
                "input": {
                   "stdin": true
                }
             },
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
       },
       {
          "type": "ParallelCommands",
          "outputType": "list",
          "outputList": {
             "concurrency": 1,
             "outputVar": "$array"
          },
          "commands": [
             {
                "command": "print",
                "params": [
                   {
                      "type": "string",
                      "value": "OK"
                   }
                ],
                "flags": {},
                "input": {
                   "stdin": true
                }
             },
             {
                "command": "request",
                "params": [
                   {
                      "type": "string",
                      "value": "GET"
                   },
                   {
                      "type": "string",
                      "value": "http://google.com"
                   }
                ],
                "flags": {},
                "input": {
                   "stdin": true
                }
             },
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
       },
       {
          "type": "CommandDefinition",
          "head": {
             "name": "otherFunc",
             "params": [
                "p1"
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
                            "type": "variable",
                            "value": "m"
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
                      "command": "read",
                      "params": null,
                      "flags": {},
                      "input": {
                         "type": "command",
                         "value": [
                            {
                               "command": "print",
                               "params": [
                                  {
                                     "type": "string",
                                     "value": "omg"
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
             },
             {
                "type": "ParallelCommands",
                "outputType": "list",
                "outputList": {
                   "concurrency": "2",
                   "outputVar": "$outputs"
                },
                "commands": [
                   {
                      "command": "print",
                      "params": [
                         {
                            "type": "string",
                            "value": "OK"
                         }
                      ],
                      "flags": {},
                      "input": {
                         "stdin": true
                      }
                   },
                   {
                      "command": "request",
                      "params": [
                         {
                            "type": "string",
                            "value": "GET"
                         },
                         {
                            "type": "string",
                            "value": "http://google.com"
                         }
                      ],
                      "flags": {},
                      "input": {
                         "stdin": true
                      }
                   },
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
                               "command": "store",
                               "params": null,
                               "flags": {},
                               "input": {
                                  "stdin": true
                               }
                            }
                         ]
                      }
                   },
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
                "type": "Assignment",
                "variable": "returnValue",
                "value": {
                   "type": "string",
                   "value": "valor"
                }
             }
          ]
       },
       {
          "type": "ParallelCommands",
          "outputType": "list",
          "outputList": {
             "concurrency": 1,
             "outputVar": "$salida"
          },
          "commands": [
             {
                "command": "print",
                "params": [
                   {
                      "type": "string",
                      "value": "first"
                   },
                   {
                      "type": "string",
                      "value": "second"
                   },
                   {
                      "type": "boolean",
                      "value": true
                   },
                   {
                      "type": "decimal",
                      "value": 1.3
                   },
                   {
                      "type": "integer",
                      "value": 456
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
                               "type": "string",
                               "value": "an input"
                            }
                         ],
                         "flags": {},
                         "input": {
                            "stdin": true
                         }
                      }
                   ]
                }
             },
             {
                "command": "request",
                "params": [
                   {
                      "type": "string",
                      "value": "GET"
                   },
                   {
                      "type": "string",
                      "value": "http://google.com"
                   }
                ],
                "flags": {},
                "input": {
                   "stdin": true
                }
             },
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
                   "type": "string",
                   "value": "Input here"
                }
             }
          ]
       }
    ]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })
});
