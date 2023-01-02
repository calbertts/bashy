const { describe, expect, test } = require('@jest/globals')
const parser = require('./parser')

describe("math", () => {
  test("should parse math expressions", () => {
    const test = 
    `var = # 1+3
print \`Hello: $var, an expression: \${ # $one + $two }, \${ print "command"}\`

myFunction: param1, param2
  variable = true
  v = # 1 + $variable - count < print "OK"
  filter $file < (
    print "OK" > list
  )

var = myFunction print "ab" "cd" > print`

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
                         "value": [
                            "1"
                         ]
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
                            "value": [
                               "3"
                            ]
                         }
                      ]
                   }
                }
             ]
          }
       },
       {
          "type": "Commands",
          "commands": [
             {
                "command": "print",
                "value": {
                   "type": "template",
                   "value": [
                      "Hello: ",
                      {
                         "type": "variable",
                         "value": "var"
                      },
                      ", an expression: ",
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
                      ", ",
                      {
                         "type": "command",
                         "value": [
                            {
                               "command": "print",
                               "value": {
                                  "type": "string",
                                  "value": "command"
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
          "type": "CustomCommand",
          "head": {
             "name": "myFunction",
             "params": [
                "param1",
                "param2"
             ]
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
                               "value": [
                                  "1"
                               ]
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
                                        "input": {
                                           "type": "command",
                                           "value": [
                                              {
                                                 "command": "print",
                                                 "value": {
                                                    "type": "string",
                                                    "value": "OK"
                                                 }
                                              }
                                           ]
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
                "type": "Commands",
                "commands": [
                   {
                      "command": "filter",
                      "token": {
                         "type": "variable",
                         "value": "file"
                      },
                      "input": {
                         "type": "command",
                         "value": [
                            {
                               "command": "print",
                               "value": {
                                  "type": "string",
                                  "value": "OK"
                               }
                            },
                            {
                               "command": "list",
                               "path": {
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
                   "type": "custom",
                   "params": [
                      {
                         "type": "command",
                         "value": [
                            {
                               "command": "print",
                               "value": {
                                  "type": "string",
                                  "value": "ab"
                               }
                            }
                         ]
                      },
                      {
                         "type": "string",
                         "value": "cd"
                      }
                   ],
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
       }
    ]

    const parseOutput = parser.parse(test);
    expect(parseOutput).toEqual(expectedOutput);
  })
})
