const {describe, expect, test} = require('@jest/globals')
const parser = require('./parser')

describe('lists', () => {
  test('should parse lists', () => {
    const test = 
      `myList = [
         otherFn 1 print "OK" read $file,
         $var,
         "value",
         2.4,
         3,
         true,
         fn 4.5 "value",
         \`Template with $var\`,
         print "OK" > list,
         $myVariable,
         # 5 + 6 + $var,
         false
      ]

print [1, 2, print "OK", fn $p1 $p2]`

    const expectedOutput = [
       {
          "type": "Assignment",
          "variable": "myList",
          "value": {
             "type": "List",
             "value": [
                {
                   "type": "command",
                   "value": [
                      {
                         "command": "otherFn",
                         "type": "custom",
                         "params": [
                            {
                               "type": "integer",
                               "value": 1
                            },
                            {
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
                            },
                            {
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
                         ],
                         "input": {
                            "stdin": true
                         }
                      }
                   ]
                },
                {
                   "type": "variable",
                   "value": "var"
                },
                {
                   "type": "string",
                   "value": "value"
                },
                {
                   "type": "decimal",
                   "value": 2.4
                },
                {
                   "type": "integer",
                   "value": 3
                },
                {
                   "type": "boolean",
                   "value": true
                },
                {
                   "type": "command",
                   "value": [
                      {
                         "command": "fn",
                         "type": "custom",
                         "params": [
                            {
                               "type": "decimal",
                               "value": 4.5
                            },
                            {
                               "type": "string",
                               "value": "value"
                            }
                         ],
                         "input": {
                            "stdin": true
                         }
                      }
                   ]
                },
                {
                   "type": "template",
                   "value": [
                      "Template with ",
                      {
                         "type": "variable",
                         "value": "var"
                      }
                   ]
                },
                {
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
                },
                {
                   "type": "variable",
                   "value": "myVariable"
                },
                {
                   "type": "mathExpression",
                   "value": [
                      {
                         "type": "mathTerm",
                         "value": [
                            {
                               "type": "number",
                               "value": [
                                  "5"
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
                                     "6"
                                  ]
                               }
                            ]
                         }
                      },
                      {
                         "op": "+",
                         "term": {
                            "type": "mathTerm",
                            "value": [
                               {
                                  "type": "variable",
                                  "value": "var"
                               }
                            ]
                         }
                      }
                   ]
                },
                {
                   "type": "boolean",
                   "value": false
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
                   "type": "List",
                   "value": [
                      {
                         "type": "integer",
                         "value": 1
                      },
                      {
                         "type": "integer",
                         "value": 2
                      },
                      {
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
                      },
                      {
                         "type": "command",
                         "value": [
                            {
                               "command": "fn",
                               "type": "custom",
                               "params": [
                                  {
                                     "type": "variable",
                                     "value": "p1"
                                  },
                                  {
                                     "type": "variable",
                                     "value": "p2"
                                  }
                               ],
                               "input": {
                                  "stdin": true
                               }
                            }
                         ]
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
