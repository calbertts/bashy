Program = Sentences?

Sentences =
  head:Sentence tail:(Sentence)* {
    return [head, ...tail]
  }

Sentence = 
  !."\n"
  / Comment
  / CommandDefinition
  / Commands
  / AssigmentVariable  
  / Parallel
  / MathExpression
  / BooleanExpression

/******************************* TYPE OF SENTENCES */
Comment "comment" = 
  MultiLineComment
  / SingleLineComment

Commands = 
  L command:PipedCommand EOS?
  {
    return {
      type: "CommandExecution",
      commands: [command[0], ...command[1]]
    }
  }

AssigmentVariable = 
  __ variable:VariableSymbol _ "=" __ value:VariableValue EOS?
  {
    return {
      type: "Assignment",
      variable: variable,
      value
    }
  }
/******************************* SENTENCES END */



/******************************* COMMENTS TYPES */
SingleLineComment
  = "//" (!LineTerminator SourceCharacter)* {return}

MultiLineComment
  = "/*" (!"*/" SourceCharacter)* "*/" {return}
/******************************* COMMENTS TYPES END */


/******************************* Commands */
CommandDefinition = 
  head:CommandHead
  body:CommandBody
  {
    return {
      type: "CommandDefinition",
      head,
      body
    }
  }

CommandHead = 
  L name:CommandName ":" _ params:CommandArgs? _ "-"? _ flags:Map? EOS L {
    if (params && (new Set(params)).size !== params.length) {
      error("There's a duplicated param name here: "+ JSON.stringify(params))
    }
    return {
      name,
      params: params || [],
      flags: flags || {}
    }
  }

CommandArgs =
  head:CommandParam tail:("," _ fp:CommandParam { return fp })* {
    return [head, ...tail]
  }

CommandParam = Variable { return text() }
  
CommandName = Variable { return text() }

CommandBody = (Indent _ L fl:Sentence L { return fl })*
/******************************* FUNCTIONS END */


/******************************* CONDITIONALS */
BooleanExpression =
  _ "("? __ head:BooleanTerm tail:(_ op:("and" / "or") _ term:BooleanTerm {return {op, term}})* __ ")"? _ "?" __ {
      return {
        type: "BooleanExpression",
        value: [head, ...tail]
      }
    }

BooleanTerm = 
  head:Factor tail:(_ op:("not" / "xor")? _ factor:Factor {return {op, factor}})* {
      return {
        type: "BooleanTerm",
        value: [head, ...tail]
      }
    }

BooleanFactor = 
  "(" _ expr:BooleanExpression _ ")" { return expr; }
  / boolean:Boolean { return { type: "boolean", value: boolean} }
  / command:PipedCommand { return {type: "command", command} }
  / __ "(" __ command:PipedCommand __ ")" { return {type: "command", command} }
  / variable:VariableSymbol { return {type: "variable", value: variable} }
/******************************* CONDITIONALS END */


/******************************* PARALLELS */
Parallel = 
  L head:ParallelHead L
  L body:ParallelBody L
  {
    if (head.outputType === "variables" && (new Set(head.outputVars)).size !== head.outputVars.length) {
      error("There's a duplicated variable name here: "+ JSON.stringify(head.outputVars))
    }
    if (head.outputType === "variables" && body.length !== head.outputVars.length) {
      error(
        "The amout of vars: " + JSON.stringify(head.outputVars) + ", don't correspond to the amout of commands: " + body.length 
      )
    }
    else if (head.outputType === "list" && head.outputList.concurrency > body.length) {
      error(
        "The variable: '" +
        head.outputList.outputVar + 
        "', has concurrency = "+ head.outputList.concurrency +" which is greater than the body commands"
      )
    }
    
    return {
      type: "ParallelCommands",
      ...head,
      commands: [
        ...body
      ]
    }
  }

ParallelBody =
  (Indent _ L ParallelOp _ L fl:Command L { return fl })*

ParallelHead =
  outputVars:ParallelOutputs __ "=" EOS L {
    return {
      outputType: "variables",
      outputVars: outputVars || []
    }
  }
  / outputList:ParallelListOutput __ "=" EOS {
    return {
      outputType: "list",
      outputList
    }
  }

ParallelOutputs =
  head:ParallelOutputVar tail:("," _ fp:ParallelOutputVar { return fp })* {
    return [head, ...tail]
  }
  
ParallelListOutput =
  "[" outputVar:ParallelOutputVar ":"? concurrency:Integer? "]" {
    return {
      concurrency: concurrency ? concurrency.join("") : 1,
      outputVar
    }
  }

ParallelOutputVar = VariableSymbol { return text() }
  
Indent = "  "
ParallelOp = "|"

/******************************* PARALLELS END */

/******************************* COMMANDS AND VARIABLE TYPES */
VariableValue =
  decimal:Decimal { return { type: "decimal", value: decimal} }
  / integer:Integer { return { type: "integer", value: parseInt(integer.join(""))} }
  / boolean:Boolean { return { type: "boolean", value: boolean} }
  / backtickString:BacktickString { return { type: "template", value: backtickString } }
  / string:String { return { type: "string", value: string } }
  / variable:VariableSymbol { return { type: "variable", value: variable } }
  / mathExpr:MathExpression
  / list:List
  / map:Map
  / fn:FunctionObj
  / booleanExpression:BooleanExpression
  / "(" __ command:PipedCommand __ ")" {
    const [head, tail] = command
  	return { type: "command", value: [head, ...tail] }
  }
  
FunctionObj = "!" name:Variable {
  return {
    type: "function",
    name
  }
}

VariableSymbol = "$" variable:Variable { return variable.value }

PipedCommand =
  head:SingleCommand 
  tail:(LineTerminatorSequence? __ Pipe " " item:SingleCommand { return item })*

SingleCommand  = 
  executeCommand:Execute { return executeCommand }
  / genericCommand:Command { return genericCommand }
/******************************* COMMANDS TYPES END */



/******************************* COMMANDS SYNTAX */
CommandInput =
  In _ input:VariableValue { return input }

CommandParams =
  head:VariableValue tail:(" " _ cp:VariableValue { return cp })* {
    return [head, ...tail]
  }
  
CommandEnd = EOS

FlagName = t:[a-zA-Z_-]+ { return {value: t.join("")} }

Flag = 
  "-"flag:Variable { return {flag, value: true} }
  / "--"flag:FlagName "="? value:VariableValue? { return {flag, value} }

Flags = flags:(flag:Flag _? {return flag})* {
  return flags.reduce((obj, flag) => {
    obj[flag.flag.value] = flag.value ? flag.value : !flag.value;
    return obj;
  }, {});
}

Command = 
  command:Variable _? flags:Flags? CommandEnd {
    return {
      command: command.value,
      params: null,
      flags,
      input: {stdin: true}
    }
  }
  / command:Variable _? flags:Flags? _ params:CommandParams? _ input:CommandInput? CommandEnd {
  	return {
      command: command.value,
      params,
      flags,
      input: input ? input : {stdin: true}
    }
  }

Return = command:"return" _ value:VariableValue? {
  	return { command, value: !value ? {stdin: true} : value }
  }

Execute = 
  command:"execute" _ interpreter:ExecuteOpts? _ value:VariableValue? _ input:CommandInput? {
    return {
    	command, 
        interpreter: !interpreter ? { type: "string", value: "bashy" } : interpreter, 
        value: !value ? input : value
    }
  }
  
ExecInterpreter = [a-zA-Z0-9-_\/\.]+ {return text()}
ExecuteOpts = 
  "-"cp:ExecInterpreter {
  	return {
      type: "string",
      value: cp
    }
  }
  / "-"variable:VariableValue { return variable }
/******************************* COMMANDS SYNTAX END */
  


/******************************* TEXT TYPES */
Text = [a-zA-Z0-9_]+

String = StringLiteral

Integer = [0-9]+

Decimal
  = DecimalIntegerLiteral "." DecimalDigit* {
      return parseFloat(text())
    }
  / "." DecimalDigit+ {
      return parseFloat(text())
    }

Number =
  Integer
  / Decimal

DecimalIntegerLiteral
  = "0"
  / NonZeroDigit DecimalDigit*

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

Boolean =
  "true" { return true }
  / "false" { return false }

StringLiteral "string"
  = '"' chars:DoubleStringCharacter* '"' {
      return chars.join("");
    }
  / "'" chars:SingleStringCharacter* "'" {
      return chars.join("");
    }

BacktickString =
  "`" content:BacktickStringContent* "`" {
    return content;
  }
  
BacktickStringContent =
  interpolation:InterpolationExpression { return interpolation }
  / escapedBacktick:EscapedBacktick { return escapedBacktick }
  / escapedVarSymbol:EscapedVarSymbol { return escapedVarSymbol }
  / characters:[^\\`$]+ { return {type: "string", value: characters.join("")} }

InterpolationExpression =
  "${" __ variable:VariableValue __ "}" { return variable }
  / variable:VariableSymbol { return {type: "variable", value: variable} }
  
EscapedBacktick = 
  "\\`" { return "`" }

EscapedVarSymbol = 
  "\\$" { return {type: "string", value: "$"} }

DoubleStringCharacter
  = !('"') SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }

SingleStringCharacter
  = !("'") SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
/******************************* TEXT TYPES END */



// Command = Text
Token = t:Text

DirectoryFile = 
  DirectoryRegex
  / variable:Variable { return { type: "variable", value: variable.value } }

DirectoryRegex = '"' directory:[a-zA-Z0-9|~|\/|$|\.]+ '"' { return directory.join("") }

Variable = t:Text { return {value: t.join("")} }

// LITERAL CONSTANTS
Pipe = ">"
In = "<"
OpenScope = "("
CloseScope = ")"

EscapeSequence
  = CharacterEscapeSequence
  / "0" !DecimalDigit { return "\0"; }
  / HexEscapeSequence
  / UnicodeEscapeSequence

CharacterEscapeSequence
  = SingleEscapeCharacter
  / NonEscapeCharacter

SingleEscapeCharacter
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b"; }
  / "f"  { return "\f"; }
  / "n"  { return "\n"; }
  / "r"  { return "\r"; }
  / "t"  { return "\t"; }
  / "v"  { return "\v"; }

NonEscapeCharacter
  = !(EscapeCharacter) SourceCharacter { return text(); }

EscapeCharacter
  = SingleEscapeCharacter
  / DecimalDigit
  / "x"
  / "u"

HexEscapeSequence
  = "x" digits:$(HexDigit HexDigit) {
      return String.fromCharCode(parseInt(digits, 16));
    }

UnicodeEscapeSequence
  = "u" digits:$(HexDigit HexDigit HexDigit HexDigit) {
      return String.fromCharCode(parseInt(digits, 16));
    }

SourceCharacter
  = .
  
HexDigit
  = [0-9a-f]i
  
EOS
  = 
  _ SingleLineComment? LineTerminatorSequence
  / __ EOF

EOF
  = !.

MultiLineCommentNoLineTerminator
  = "/*" (!("*/" / LineTerminator) SourceCharacter)* "*/"

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

WhiteSpace "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"
  / Zs
  
// Separator, Space
Zs = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]

// Skipped
__
  = (WhiteSpace / LineTerminatorSequence / Comment)*
_
  = (WhiteSpace / MultiLineCommentNoLineTerminator)*

L = 
	(LineTerminatorSequence / Comment)*


/******************************* MATH EXPR */
MathExpression =
  "#" _ head:Term tail:(_ op:("+" / "-") _ term:Term {return {op, term}})* EOS? {
      return {
        type: "mathExpression",
        value: [head, ...tail]
      }
    }

Term = 
  head:Factor tail:(_ op:("*" / "/") _ factor:Factor {return {op, factor}})* {
      return {
        type: "mathTerm",
        value: [head, ...tail]
      }
    }

Factor = 
  "(" _ expr:MathExpression _ ")" { return expr; }
  / number:Number { return {type: "number", value: number.join("")} }
  / command:PipedCommand { return {type: "command", command} }
  / __ "(" __ command:PipedCommand __ ")" { return {type: "command", command} }
  / variable:VariableSymbol { return {type: "variable", value: variable} }
/******************************* MATH EXPR END */


/******************************* LISTS */
List =
  __ "[" __ head:ListItem? tail:("," __ item:ListItem? {return item})* ","? __ "]" {
    return {
      type: "List",
      value: !head || !tail ? [] : [head, ...tail]
    }
  }
  
ListItem =
  VariableValue
/******************************* LISTS END */


/******************************* MAPS */
Map =
  "{" __ items:(MapItem)* __ "}" {
    return {
      type: "Map",
      value: items
    }
  }

MapItem =
  key:Variable ":" __ value:MapValue ","? __ {
    return {
      key, value
    }
  }
  / "[" __ key:MapValue __ "]" ":" __ value:MapValue ","? __ {
    return {
      key, value
    }
  }
  
MapValue = VariableValue
/******************************* MAPS END */

  
