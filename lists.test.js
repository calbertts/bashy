const {describe, expect, test} = require('@jest/globals')
const parser = require('./parser')

describe('lists', () => {
  test('should parse lists', () => {
    const test = 
      `
$arrayVar = [
  1,
  $he,
  "HEY",
  (
    hello $var 2 (
      print "OK"
    ) 4 5 < "input"
  ),
  (
    hello
  ),
  true,
  # 5 + 6 + $var,
  false,
  \`Template with $var\`,
]`

    const expectedOutput = [
       {
          "type": "Assignment",
          "variable": {
             "type": "new",
             "variable": "arrayVar"
          },
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
                   "type": "string",
                   "value": "HEY"
                },
                {
                   "type": "command",
                   "value": [
                      {
                         "command": "hello",
                         "params": [
                            {
                               "type": "variable",
                               "value": "var"
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
                                  }
                               ]
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
                   "type": "command",
                   "value": [
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
                   "type": "boolean",
                   "value": true
                },
                {
                   "type": "mathExpression",
                   "value": [
                      {
                         "type": "mathTerm",
                         "value": [
                            {
                               "type": "number",
                               "value": "5"
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
                                  "value": "6"
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
                },
                {
                   "type": "template",
                   "value": [
                      {
                         "type": "string",
                         "value": "Template with "
                      },
                      {
                         "type": "variable",
                         "value": "var"
                      }
                   ]
                },
                null
             ]
          }
       }
    ]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })
})
