const { describe, expect, test } = require('@jest/globals')
const parser = require('./parser')

describe("math", () => {
  test("should parse math expressions", () => {
    const test = 
    `$var = # 1+3
print \`Hello: $var, an expression: \${ # $one + $two }, \${(
  print "command"
)}\`

myFunction: param1, param2
  $variable = true
  $v = # 1 + $variable - (
    count
  )
  filter $file < (
    print "OK"
    > list
  )

$var = (
  myFunction "ab" "cd"
  > print
)`

    const expectedOutput = [
       {
          "type": "Assignment",
          "variable": "var",
          "value": {
             "type": "mathExpression",
             "value": [
                {
                   "type": "mathTerm",
                   "value": [
                      {
                         "type": "number",
                         "value": "1"
                      }
                   ]
                },
                {
                   "op": "+",
                   "term": {
                      "type": "mathTerm",
                      "value": [
                         {
                            "type": "number",
                            "value": "3"
                         }
                      ]
                   }
                }
             ]
          }
       },
       {
          "type": "CommandExecution",
          "commands": [
             {
                "command": "print",
                "params": [
                   {
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
                            "type": "mathExpression",
                            "value": [
                               {
                                  "type": "mathTerm",
                                  "value": [
                                     {
                                        "type": "variable",
                                        "value": "one"
                                     }
                                  ]
                               },
                               {
                                  "op": "+",
                                  "term": {
                                     "type": "mathTerm",
                                     "value": [
                                        {
                                           "type": "variable",
                                           "value": "two"
                                        }
                                     ]
                                  }
                               }
                            ]
                         },
                         {
                            "type": "string",
                            "value": ", "
                         },
                         {
                            "type": "command",
                            "value": [
                               {
                                  "command": "print",
                                  "params": [
                                     {
                                        "type": "string",
                                        "value": "command"
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
          "type": "CommandDefinition",
          "head": {
             "name": "myFunction",
             "params": [
                "param1",
                "param2"
             ],
             "flags": {}
          },
          "body": [
             {
                "type": "Assignment",
                "variable": "variable",
                "value": {
                   "type": "boolean",
                   "value": true
                }
             },
             {
                "type": "Assignment",
                "variable": "v",
                "value": {
                   "type": "mathExpression",
                   "value": [
                      {
                         "type": "mathTerm",
                         "value": [
                            {
                               "type": "number",
                               "value": "1"
                            }
                         ]
                      },
                      {
                         "op": "+",
                         "term": {
                            "type": "mathTerm",
                            "value": [
                               {
                                  "type": "variable",
                                  "value": "variable"
                               }
                            ]
                         }
                      },
                      {
                         "op": "-",
                         "term": {
                            "type": "mathTerm",
                            "value": [
                               {
                                  "type": "command",
                                  "command": [
                                     {
                                        "command": "count",
                                        "params": null,
                                        "flags": {},
                                        "input": {
                                           "stdin": true
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
                "type": "CommandExecution",
                "commands": [
                   {
                      "command": "filter",
                      "params": [
                         {
                            "type": "variable",
                            "value": "file"
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
                                     "value": "OK"
                                  }
                               ],
                               "flags": {},
                               "input": {
                                  "stdin": true
                               }
                            },
                            {
                               "command": "list",
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
       },
       {
          "type": "Assignment",
          "variable": "var",
          "value": {
             "type": "command",
             "value": [
                {
                   "command": "myFunction",
                   "params": [
                      {
                         "type": "string",
                         "value": "ab"
                      },
                      {
                         "type": "string",
                         "value": "cd"
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
       }
    ]

    const parseOutput = parser.parse(test);
    expect(parseOutput).toEqual(expectedOutput);
  })
})
