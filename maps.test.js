const {describe, expect, test} = require('@jest/globals')
const parser = require('./parser')

describe('maps', () => {
  test('maps declaration', () => {
    const test = 
      `$obj = {
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
  [1]: (
    comma "one"
  )
}`

    const expectedOutput = [
       {
          "type": "Assignment",
          "variable": {
             "type": "new",
             "variable": "obj"
          },
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
                },
                {
                   "key": {
                      "type": "integer",
                      "value": 1
                   },
                   "value": {
                      "type": "command",
                      "value": [
                         {
                            "command": "comma",
                            "params": [
                               {
                                  "type": "string",
                                  "value": "one"
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
       }
    ]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })
})
