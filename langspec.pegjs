Program = Sentences?

Sentences =
  head:Sentence tail:(Sentence)* {
    return [head, ...tail]
  }

Sentence = 
  !."\n"
  / Comment
  / Commands
  / AssigmentVariable


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
  L variable:Variable _? "=" _? value:VariableValue EOS?
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



/******************************* COMMANDS AND VARIABLE TYPES */
VariableValue =
  command:PipedCommand {
    const [head, tail] = command
  	return { type: "command", value: [head, ...tail] }
  }
  / string:String { return { type: "string", value: string } }
  / number:Number { return { type: "int", value: parseInt(number.join(""))} }
  / variable:Variable { return { type: "variable", value: variable.value } }
  / backtickString:BacktickString { return { type: "template", value: backtickString } }

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
  command:"sort" _ opt:SortOpts _ input:CommandInput? {
    return { command, opt, input: !input ? {stdin: true} : input }
  }

SortOpts =
  "des"
  / "asc"
  / CommandParam

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
  command:"execute" _ value:CommandParam {
    return { command, value }
  }
/******************************* COMMANDS SYNTAX END */
  


/******************************* TEXT TYPES */
Text = [a-zA-Z0-9_]+

String = StringLiteral

Number = [0-9]+

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
  
DecimalDigit
  = [0-9]
  
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
