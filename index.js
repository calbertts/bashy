const fs = require('fs');
const peg = require('pegjs');
const parser = require('./parser')

// define the grammar for the language
const grammar = `Program = Sentences?


Sentences =
  head:Sentence tail:(Sentence)* {
    return [head, ...tail]
  }

Sentence = 
  Comment
  / Commands
  / AssigmentVariable


/******************************* TYPE OF SENTENCES */
Comment "comment" = 
  MultiLineComment
  / SingleLineComment

Commands = 
  __ command:PipedCommand EOS?
  {
    return {
      type: "Commands",
      commands: [command[0], ...command[1]]
    }
  }

AssigmentVariable = 
  __ Def _ variable:Variable _? "=" _? value:VariableValue EOS
  {
    return {
      type: "Assignment",
      variable,
      value
    }
  }
/******************************* SENTENCES END */



/******************************* COMMENTS TYPES */
SingleLineComment
  = "//" (!LineTerminator SourceCharacter)*

MultiLineComment
  = "/*" (!"*/" SourceCharacter)* "*/"
/******************************* COMMENTS TYPES END */



/******************************* COMMANDS AND VARIABLE TYPES */
VariableValue =
  string:String { return { type: "string", value: string } }
  / number:Number { return { type: "int", value: parseInt(number.join(""))} }
  / command:PipedCommand {
    const [head, tail] = command
  	return { type: "command", value: [head, ...tail] }
  }

PipedCommand =
  __ head:SingleCommand 
  __ tail:(LineTerminatorSequence? _? Pipe _ item:SingleCommand { return item })*
  {
    return [ head, tail ]
  }

SingleCommand  = Run _ 
  printCommand:Print { return printCommand }
  / listCommand:List { return listCommand }
  / readCommand:Read { return readCommand }
  / filterCommand:Filter { return filterCommand }
  / replaceCommand:Replace { return replaceCommand }
  / countCommand:Count { return countCommand }
  / execCommand:Execute { return execCommand }
/******************************* COMMANDS TYPES END */



/******************************* COMMANDS SYNTAX */
List =
  command:"list" _ path:DirectoryFile {
  	return { command, path }
  }

Read = 
  command:"read" _ file:DirectoryFile {
  	return { command, file }
  }

Print = 
  command:"print" _ text:String {
  	return { command, text }
  }

Filter = 
  command:"filter" _ token:String {
  	return { command, token }
  }

Replace = 
  command:"replace" _ pattern:String _ "by" _ value:String {
    return { command, pattern, value }
  }

Cut = 
  command:"cut" _ "by" _? value:String {
  	return { command, value }
  }

Count = 
  command:"count" {
    return { command }
  }

Execute = 
  command:"execute" _? '"' value:PipedCommand '"' {
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

DoubleStringCharacter
  = !('"') SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }

SingleStringCharacter
  = !("'") SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
/******************************* TEXT TYPES END */



Command = Text
Token = t:Text

DirectoryFile  = n:PathOrFileRegx { return n.join("") }
PathOrFileRegx = [0-9a-zA-Z|~|\/]+

Variable = t:Text { return t.join("") }

// LITERAL CONSTANTS
Run = "run"
Def = "def"
Pipe = "|"

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
  = (WhiteSpace / MultiLineCommentNoLineTerminator)*`;

// compile the grammar into a parser
// const parser = peg.generate(grammar);

console.log('PARSER created');

// read the input file
const input = fs.readFileSync(__dirname + '/index.txt', 'utf8');

// parse the input and print the result
const result = parser.parse(input);
console.log(result);
