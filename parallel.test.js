const {describe, expect, test} = require('@jest/globals')
const parser = require('./parser')

describe('parallel', () => {
  test('parallel assigments', () => {
    const test = 
      `
[outputs:2] = 
  | [
      request "GET" "http://google.com",
      request "GET" "http://facebook.com",
      print "OK",
      read file
    ]

[array] = 
  | print "OK"
  | request "GET" "http://google.com"

out1, out2 = 
  | print "OK"
  | request "GET" "http://google.com"
`

    const expectedOutput = [
       {
          "type": "ParallelCommands",
          "outputType": "list",
          "outputList": {
             "concurrency": "2",
             "outputVar": "outputs"
          },
          "commands": [
             {
                "type": "List",
                "value": [
                   {
                      "type": "command",
                      "value": [
                         {
                            "command": "request",
                            "type": "custom",
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
                            "input": {
                               "stdin": true
                            }
                         }
                      ]
                   },
                   {
                      "type": "command",
                      "value": [
                         {
                            "command": "request",
                            "type": "custom",
                            "params": [
                               {
                                  "type": "string",
                                  "value": "GET"
                               },
                               {
                                  "type": "string",
                                  "value": "http://facebook.com"
                               }
                            ],
                            "input": {
                               "stdin": true
                            }
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
                         }
                      ]
                   },
                   {
                      "type": "command",
                      "value": [
                         {
                            "command": "read",
                            "file": {
                               "type": "command",
                               "value": [
                                  {
                                     "command": "file",
                                     "type": "custom",
                                     "params": [
                                        null
                                     ],
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
             }
          ]
       },
       {
          "type": "ParallelCommands",
          "outputType": "list",
          "outputList": {
             "concurrency": 1,
             "outputVar": "array"
          },
          "commands": [
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
                      "command": "request",
                      "type": "custom",
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
                      "input": {
                         "stdin": true
                      }
                   }
                ]
             }
          ]
       },
       {
          "type": "ParallelCommands",
          "outputType": "variables",
          "outputVars": [
             "out1",
             "out2"
          ],
          "commands": [
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
                      "command": "request",
                      "type": "custom",
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
                      "input": {
                         "stdin": true
                      }
                   }
                ]
             }
          ]
       }
    ]

    const parseOutput = parser.parse(test)
    expect(parseOutput).toStrictEqual(expectedOutput)
  })
});
