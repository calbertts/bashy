Program = Sentences?

Sentences =
  head:Sentence tail:(Sentence)* {
    return [head, ...tail]
  }

Sentence = 
  !."\n"
  / Comment
  / Function
  / Commands
  / AssigmentVariable
  / Parallel

/******************************* TYPE OF SENTENCES */
Comment "comment" = 
  MultiLineComment
  / SingleLineComment

Commands = 
  L command:PipedCommand EOS?
  {
    return {
      type: "Commands",
      commands: [command[0], ...command[1]]
    }
  }

AssigmentVariable = 
  L variable:Variable __ "=" __ value:CommandParam EOS?
  {
    return {
      type: "Assignment",
      variable: variable.value,
      value
    }
  }
  / L variable:Variable __ "=" __ "(" __ value:CommandParam __ ")" EOS?
  {
    return {
      type: "Assignment",
      variable: variable.value,
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


/******************************* FUNCTIONS */
Function = 
  head:FunctionHead
  body:FunctionBody
  {
    return {
      type: "CustomCommand",
      head,
      body
    }
  }

FunctionHead = 
  L name:FunctionName ":" _ params:FunctionParams? EOS L {
    return {
      name,
      params: params || []
    }
  }

FunctionParams =
  head:FunctionParam tail:("," _ fp:FunctionParam { return fp })* {
    return [head, ...tail]
  }

FunctionParam = Variable { return text() }
  
FunctionName = Variable { return text() }

FunctionBody = (Indent _ L fl:Sentence L EOS? { return fl })*

FunctionArgs =
  head:CommandParam tail:("," _ cp:CommandParam { return cp })* {
    return [head, ...tail]
  }
/******************************* FUNCTIONS END */


/******************************* CONDITIONALS */

/******************************* CONDITIONALS END */


/******************************* PARALLELS */
Parallel = 
  L head:ParallelHead L
  body:(Indent _ ParallelOp _ L fl:CommandParam L EOS? { return fl })*
  {
    return {
      type: "ParallelCommands",
      ...head,
      commands: [
        ...body
      ]
    }
  }

ParallelHead =
  outputVars:ParallelOutputs __ "=" EOS {
    return {
      outputVars: outputVars || []
    }
  }

ParallelOutputs =
  head:ParallelOutputVar tail:("," _ fp:ParallelOutputVar { return fp })* {
    return [head, ...tail]
  }

ParallelOutputVar = Variable { return text() }
  
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
  / "$" variable:Variable { return { type: "variable", value: variable.value } }
  / command:PipedCommand {
    const [head, tail] = command
  	return { type: "command", value: [head, ...tail] }
  }

PipedCommand =
  head:SingleCommand 
  tail:(LineTerminatorSequence? __ Pipe _? item:SingleCommand { return item })*
  {
    return [ head, tail ]
  }

SingleCommand  = 
  printCommand:Print { return printCommand }
  / listCommand:List { return listCommand }
  / readCommand:Read { return readCommand }
  / filterCommand:Filter { return filterCommand }
  / replaceCommand:Replace { return replaceCommand }
  / cutCommand:Cut { return cutCommand }
  / countCommand:Count { return countCommand }
  / storeCommand:Store { return storeCommand }
  / execCommand:Execute { return execCommand }
  / sortCommand:Sort { return sortCommand }
  / mergeCommand:Merge { return mergeCommand }
  / genericCommand:Generic { return genericCommand }
/******************************* COMMANDS TYPES END */



/******************************* COMMANDS SYNTAX */
CommandParam =
  EOS {return null}
  / param:VariableValue { return param }
  / "(" __ param:VariableValue __ ")" { return param }

CommandInput =
  EOS { return {stdin: true} }
  / __ In _ param:VariableValue { return param }
  / __ In _ "(" __ input:VariableValue __ ")" { return input }

Generic = 
  command:Variable _ params:FunctionArgs _ input:CommandInput? {
  	return {
      command: command.value,
      type: "custom",
      params, input: !input ? {stdin: true} : input
    }
  }

List =
  command:"list" _ path:CommandParam? {
  	return { command, path: !path ? {stdin: true} : path }
  }

Read = 
  command:"read" _ file:CommandParam? {
  	return { command, file: !file ? {stdin: true} : file }
  }

Print = command:"print" _ value:PrintInput? {
  	return { command, value: !value ? {stdin: true} : value }
  }

PrintInput =
  CommandParam
  / CommandInput

Filter = 
  command:"filter" _ token:CommandParam _ input:CommandInput? {
  	return { command, token, input: !input ? {stdin: true} : input }
  }

Replace = 
  command:"replace" _ pattern:CommandParam _ "by" _ replace:CommandParam _ input:CommandInput? {
    return { command, pattern, replace, input: !input ? {stdin: true} : input }
  }

Cut = 
  command:"cut" _ "by" _ value:CommandParam _ input:CommandInput? {
  	return { command, value, input: !input ? {stdin: true} : input }
  }

Count = 
  command:"count" _ input:CommandInput? {
    return { command, input: !input ? {stdin: true} : input }
  }
  
Store =
  command:"store" _ filename:CommandParam _ input:CommandInput? {
  	return { command, filename, input }
  }

Sort =
  command:"sort" _ opt:SortOpts? _ input:CommandInput? {
    return {
      command, 
      opt: !opt ? { type: "string", value: "asc" } : opt, 
      input: !input ? {stdin: true} : input
    }
  }

SortOpts =
  "-des" { return { type: "string", value: "des" } }
  / "-asc" { return { type: "string", value: "asc" } }
  / "-"cp:CommandParam { return cp }

Merge =
  command:"merge" _ inputs:MergeInputs {
    return { command, inputs }
  }

MergeInputs =
  __ head:CommandParam 
  __ tail:(LineTerminatorSequence? __ "," __ item:CommandParam { return item })*
  {
    return [ head, ...tail ]
  }


Execute = 
  command:"execute"_ interpreter:ExecuteOpts? _ value:CommandParam? _ input:CommandInput? {
    return {
    	command, 
        interpreter: !interpreter ? { type: "string", value: "bashy" } : interpreter, 
        value: !value ? input : value
    }
  }
  
ExecuteOpts = 
  "-bashy" { return { type: "string", value: "bashy" } }
  / "-bash" { return { type: "string", value: "bash" } }
  / "-sh" { return { type: "string", value: "sh" } }
  / "-"cp:CommandParam { return cp }
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
  / characters:[^\\`$]+ { return characters.join("") }

InterpolationExpression =
  "${" variable:VariableValue "}" { return variable }
  
EscapedBacktick = 
  "\\`" { return "`" }

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

Expression
  = head:Term tail:(_ ("+" / "-") _ Term)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "+") { return result + element[3]; }
        if (element[1] === "-") { return result - element[3]; }
      }, head);
    }

Term
  = head:Factor tail:(_ ("*" / "/") _ Factor)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "*") { return result * element[3]; }
        if (element[1] === "/") { return result / element[3]; }
      }, head);
    }

Factor
  = "(" _ expr:Expression _ ")" { return expr; }
  / Integer



