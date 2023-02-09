const {describe, expect, test} = require('@jest/globals')
const parser = require('./parser')

describe('structure', () => {
  test('test all structure', () => {
    const test =
    `execute -$node 'console.log("hola")'
execute -bash 'echo $HOME'

fn:
  hello -oh --up-so="OK" -cl -lw "param1" 2 3 4 < (
    print -o $input
    )
    > count
    > sort -asc

$simple = 'Simple Comma'
$double = "Double Comma"
$result = 1.456
$brith = 1987
$underAge = false
$math = # $birth + print "NO" < "input"
$emptyArrayVar = []
$arrayVar = [
  1,
  $he,
  (
    hello 1 2 3 4 5 < "input"
  ),
  true
]
$emptyObj = {}
$obj = {
  one: 1
  two: 2.3
  [$hey]: $template
  command: (
    print "comamnd result"
  )
  [\`tell me $why\`]: true
  [(
    print "TheKey"
  )]: "wow"
  aFunctionObj: !myfn
}

$commandResult = (
  print "OK" < (
    print $input
    > size
  )
  > count
)

hello: name - {upperCase: "-up"}
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
  | hello "Carlos" < "Input here"`

     const expectedOutput = [
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "execute",
                "interpreter": {
                   "type": "variable",
                   "value": "node"
                },
                "value": {
                   "type": "string",
                   "value": "console.log(\"hola\")"
                }
             }
          ]
       },
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "execute",
                "interpreter": {
                   "type": "string",
                   "value": "bash"
                },
                "value": {
                   "type": "string",
                   "value": "echo $HOME"
                }
             }
          ]
       },
       {
          "type": "CommandDefinition",
          "head": {
             "name": "fn",
             "params": [],
             "flags": {}
          },
          "body": [
             {
                "type": "CommandExecution",
                "commands": [
                   {
                      "command": "hello",
                      "params": [
                         {
                            "type": "string",
                            "value": "param1"
                         },
                         {
                            "type": "integer",
                            "value": 2
                         },
                         {
                            "type": "integer",
                            "value": 3
                         },
                         {
                            "type": "integer",
                            "value": 4
                         }
                      ],
                      "flags": {
                         "oh": true,
                         "up-so": {
                            "type": "string",
                            "value": "OK"
                         },
                         "cl": true,
                         "lw": true
                      },
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
                               "flags": {
                                  "o": true
                               },
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
                   },
                   {
                      "command": "sort",
                      "params": null,
                      "flags": {
                         "asc": true
                      },
                      "input": {
                         "stdin": true
                      }
                   }
                ]
             }
          ]
       },
       {
          "type": "Assignment",
          "variable": "simple",
          "value": {
             "type": "string",
             "value": "Simple Comma"
          }
       },
       {
          "type": "Assignment",
          "variable": "double",
          "value": {
             "type": "string",
             "value": "Double Comma"
          }
       },
       {
          "type": "Assignment",
          "variable": "result",
          "value": {
             "type": "decimal",
             "value": 1.456
          }
       },
       {
          "type": "Assignment",
          "variable": "brith",
          "value": {
             "type": "integer",
             "value": 1987
          }
       },
       {
          "type": "Assignment",
          "variable": "underAge",
          "value": {
             "type": "boolean",
             "value": false
          }
       },
       {
          "type": "Assignment",
          "variable": "math",
          "value": {
             "type": "mathExpression",
             "value": [
                {
                   "type": "mathTerm",
                   "value": [
                      {
                         "type": "variable",
                         "value": "birth"
                      }
                   ]
                },
                {
                   "op": "+",
                   "term": {
                      "type": "mathTerm",
                      "value": [
                         {
                            "type": "command",
                            "command": [
                               {
                                  "command": "print",
                                  "params": [
                                     {
                                        "type": "string",
                                        "value": "NO"
                                     }
                                  ],
                                  "flags": {},
                                  "input": {
                                     "type": "string",
                                     "value": "input"
                                  }
                               },
                               []
                            ]
                         }
                      ]
                   }
                }
             ]
          }
       },
       {
          "type": "Assignment",
          "variable": "emptyArrayVar",
          "value": {
             "type": "List",
             "value": []
          }
       },
       {
          "type": "Assignment",
          "variable": "arrayVar",
          "value": {
             "type": "List",
             "value": [
                {
                   "type": "integer",
                   "value": 1
                },
                {
                   "type": "variable",
                   "value": "he"
                },
                {
                   "type": "command",
                   "value": [
                      {
                         "command": "hello",
                         "params": [
                            {
                               "type": "integer",
                               "value": 1
                            },
                            {
                               "type": "integer",
                               "value": 2
                            },
                            {
                               "type": "integer",
                               "value": 3
                            },
                            {
                               "type": "integer",
                               "value": 4
                            },
                            {
                               "type": "integer",
                               "value": 5
                            }
                         ],
                         "flags": {},
                         "input": {
                            "type": "string",
                            "value": "input"
                         }
                      }
                   ]
                },
                {
                   "type": "boolean",
                   "value": true
                }
             ]
          }
       },
       {
          "type": "Assignment",
          "variable": "emptyObj",
          "value": {
             "type": "Map",
             "value": []
          }
       },
       {
          "type": "Assignment",
          "variable": "obj",
          "value": {
             "type": "Map",
             "value": [
                {
                   "key": {
                      "value": "one"
                   },
                   "value": {
                      "type": "integer",
                      "value": 1
                   }
                },
                {
                   "key": {
                      "value": "two"
                   },
                   "value": {
                      "type": "decimal",
                      "value": 2.3
                   }
                },
                {
                   "key": {
                      "type": "variable",
                      "value": "hey"
                   },
                   "value": {
                      "type": "variable",
                      "value": "template"
                   }
                },
                {
                   "key": {
                      "value": "command"
                   },
                   "value": {
                      "type": "command",
                      "value": [
                         {
                            "command": "print",
                            "params": [
                               {
                                  "type": "string",
                                  "value": "comamnd result"
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
                   "key": {
                      "type": "template",
                      "value": [
                         {
                            "type": "string",
                            "value": "tell me "
                         },
                         {
                            "type": "variable",
                            "value": "why"
                         }
                      ]
                   },
                   "value": {
                      "type": "boolean",
                      "value": true
                   }
                },
                {
                   "key": {
                      "type": "command",
                      "value": [
                         {
                            "command": "print",
                            "params": [
                               {
                                  "type": "string",
                                  "value": "TheKey"
                               }
                            ],
                            "flags": {},
                            "input": {
                               "stdin": true
                            }
                         }
                      ]
                   },
                   "value": {
                      "type": "string",
                      "value": "wow"
                   }
                },
                {
                   "key": {
                      "value": "aFunctionObj"
                   },
                   "value": {
                      "type": "function",
                      "name": {
                         "value": "myfn"
                      }
                   }
                }
             ]
          }
       },
       {
          "type": "Assignment",
          "variable": "commandResult",
          "value": {
             "type": "command",
             "value": [
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
                            "command": "size",
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
          }
       },
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
                "variable": "template",
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
                "variable": "wok",
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
       },
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
  });
});
