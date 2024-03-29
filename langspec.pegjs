{
    let prevIndentCount = 0;
    function print(...s) { console.log(...s); }
}

Program = Sentences?

Sentences =
  head:Sentence tail:(Sentence)* {
    return [head, ...tail]
  }

Sentence = 
  !."\n"
  / Comment
  / IfExpression
  / CommandDefinition
  / Commands
  / AssigmentVariable
  / Parallel
  / MathExpression
  
CommandSentence = 
  !."\n"
  / Comment
  / CommandDefinition {
    error("Nested commands definition isn't allowed")
  }
  / Commands
  / AssigmentVariable
  / Parallel
  / MathExpression
  / BooleanExpression

/******************************* TYPE OF SENTENCES */
Comment = 
  MultiLineComment
  / SingleLineComment

Commands = 
  __ command:PipedCommand EOS?
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
      variable: {
        type: "new",
        variable
      },
      value
    }
  }
  / __ variable:VariableProperty _ "=" __ value:VariableValue EOS?
  {
    return {
      type: "Assignment",
      variable,
      value
    }
  }
  
VariableProperty "property access" = 
  variable:VariableSymbol "[" property:VariableValue "]" {
    return {
      type: "property",
      variable,
      property
    }
  }
/******************************* SENTENCES END */



/******************************* COMMENTS TYPES */
SingleLineComment "single line comment"
  = "//" (!LineTerminator SourceCharacter)* {return}

MultiLineComment "multiline comment"
  = "/*" (!"*/" SourceCharacter)* "*/" {return}
/******************************* COMMENTS TYPES END */


/******************************* Commands */
CommandDefinition "command definition" = 
  head:CommandHead
  body:CommandBody
  {
    return {
      type: "CommandDefinition",
      head,
      body
    }
  }

CommandHead "command head" = 
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

CommandArgs "command arguments" =
  head:CommandArg tail:("," _ fp:CommandArg { return fp })* {
    return [head, ...tail]
  }

CommandArg "command argument" = Variable { return text() }
  
CommandName "command name" = Variable { return text() }

CommandBody "command body" = (Indent L fl:CommandSentence L { return fl })*
/******************************* FUNCTIONS END */


/******************************* CONDITIONALS */
Indentx 'indentx'
    = i:("  "+) { 
        let currentIndentCount = i.toString().replace(/,/g, "").length;
        if (currentIndentCount === prevIndentCount + 2) { 
            // DEBUG //
            print("=== Indent === line:"+location().start.line);
            print("    current:"+currentIndentCount); 
            print("    previous:"+prevIndentCount);
            // DEBUG //
            prevIndentCount += 2;
            return "[indentx]";
        }
        error("error: expected a 2-space indentation here!")
    } // 2 spaces 

Samedent 'samedent'
    = s:("  "+ / "") &{
        let currentIndentCount = s.toString().replace(/,/g, "").length;
        if (currentIndentCount === prevIndentCount) {
            print("=== Samedent === line:"+location().start.line);
            return true;
        }
        return false;
    }

Dedent 'dedent'
    = d:("  "+ / "") {
        let currentIndentCount = d.toString().replace(/,/g, "").length;
        if (currentIndentCount < prevIndentCount) {
            // DEBUG //
            print("=== Dedent === line:"+location().start.line);
            print("    current:"+currentIndentCount); 
            print("    previous:"+prevIndentCount);
            // DEBUG //
            prevIndentCount -= 2;
            return "[dedent]";
        }
        error("error: expected a 2-space dedentation here!");
    }

IfExpression = 
  __ ifif:If
  __ elif:(L elif:IfElse {return elif})*
  __ ifelse:Else? {
    return {
      type: "Conditional",
      ifif,
      elif,
      ifelse
    }
  }
 
If = "[" condition:BooleanExpression "]" _ "?" _ "{" L
  L? Indentx s0:Sentence sentences:(L? Samedent sentence:Sentence {return sentence})* Dedent
  "}" {
   return {
   	 condition,
     sentences: [
       s0,
       ...sentences
     ]
   }
 }

IfElse = "[" condition:BooleanExpression "]" _ "??" _ "{" L
  L? Indentx s0:Sentence sentences:(L? Samedent sentence:Sentence {return sentence})* Dedent
  "}" {
   return {
   	 condition,
     sentences: [
       s0,
       ...sentences
     ]
   }
 }

Else = "else" L
  L? Indentx s0:Sentence sentences:(L? Samedent sentence:Sentence {return sentence})* Dedent
  {
   return [
     s0,
     ...sentences
   ]
 }

BooleanExpression "boolean expression" =
  head:BooleanTerm tail:(_ op:("and" / "or") _ term:BooleanTerm {return {op, term}})* {
      return {
        type: "BooleanExpression",
        value: [head, ...tail]
      }
    }

BooleanTerm "boolean term" = 
  head:BooleanFactor tail:(_ op:("not")? _ factor:BooleanFactor {return {op, factor}})* {
      return {
        type: "BooleanTerm",
        value: [head, ...tail]
      }
    }

BooleanFactor "boolean factor" = 
  boolean:Boolean { return { type: "boolean", value: boolean} }
  // expr:BooleanExpression { return expr; }  / command:PipedCommand { return {type: "command", command} }
  // command:VariableValue { return {type: "command", command} }
  / variable:VariableSymbol { return {type: "variable", value: variable} }
/******************************* CONDITIONALS END */


/******************************* PARALLELS */
Parallel "parallel section" = 
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

ParallelBody "parallel body" =
  (Indent _ L ParallelOp _ L fl:Command L { return fl })*

ParallelHead "parallel head" =
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

ParallelOutputs "parallel heads" =
  head:ParallelOutputVar tail:("," _ fp:ParallelOutputVar { return fp })* {
    return [head, ...tail]
  }
  
ParallelListOutput "parallel list output" =
  "[" outputVar:ParallelOutputVar ":"? concurrency:Integer? "]" {
    return {
      concurrency: concurrency ? concurrency.join("") : 1,
      outputVar
    }
  }

ParallelOutputVar "parallel output variable" = VariableSymbol { return text() }
  
Indent "indent" = "  "
ParallelOp "parallel operator" = "|"

/******************************* PARALLELS END */

/******************************* COMMANDS AND VARIABLE TYPES */
VariableValue "variable value" =
  decimal:Decimal { return { type: "decimal", value: decimal} }
  / integer:Integer { return { type: "integer", value: parseInt(integer.join(""))} }
  / boolean:Boolean { return { type: "boolean", value: boolean} }
  / backtickString:BacktickString { return { type: "template", value: backtickString } }
  / string:String { return { type: "string", value: string } }
  / variableProp:VariablePropertyAccess
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
  
VariablePropertyAccess "property access" = 
  variable:VariableSymbol "[" value:VariableValue "]" {
    return {
      type: "propertyValue",
      variable,
      value
    }
  }
  
FunctionObj "function object" = "!" name:Variable {
  return {
    type: "function",
    name
  }
}

VariableSymbol "variable symbol" = "$" variable:Variable { return variable.value }

PipedCommand =
  head:SingleCommand 
  tail:(LineTerminatorSequence? __ Pipe " " item:SingleCommand { return item })*

SingleCommand  = 
  evaluate:Evaluate { return evaluate }
  / executeCommand:Execute { return executeCommand }
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

FlagName "flag name" = t:[a-zA-Z_-]+ { return {value: t.join("")} }

Flag "command flag" = 
  "-"flag:Variable {
    return {
      flag,
      value: true
    }
  }
  / "--"flag:FlagName "="? value:VariableValue? {
    return {
      flag,
      value: value ? value : {type: "boolean", value: !value}
    }
  }

Flags "command flags" = flags:(flag:Flag _? {return flag})* {
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

Return "return sentence" = command:"return" _ value:VariableValue? {
  	return { command, value: !value ? {stdin: true} : value }
  }

Execute "execute command" = 
  command:"~$" _ flags:Flags? _ value:VariableValue? _ input:CommandInput? {
    return {
    	command: "execute", 
        flags,
        value: !value ? input : value
    }
  }

EvaluateFile = [a-zA-Z0-9-_\/\.]+ {return text()}
Evaluate "bashy evaluation" = 
  command:"~~" _ file:EvaluateFile {
    return {
      command: "eval",
      value: {
        type: "string",
        value: file
      }
    }
  }
  / command:"~~" _ file:VariableValue {
    return {
      type: "eval",
      value: file
    }
  }
  
ExecInterpreter "command execution interpreter" = [a-zA-Z0-9-_\/\.]+ {return text()}
ExecuteOpts "command execution options" = 
  "-"cp:ExecInterpreter {
  	return {
      type: "string",
      value: cp
    }
  }
  / "-"variable:VariableValue { return variable }
/******************************* COMMANDS SYNTAX END */
  


/******************************* TEXT TYPES */
Text "text" = [a-zA-Z0-9_]+

String "string literal" = StringLiteral

Integer "integer" = [0-9]+

Decimal "decimal"
  = DecimalIntegerLiteral "." DecimalDigit* {
      return parseFloat(text())
    }
  / "." DecimalDigit+ {
      return parseFloat(text())
    }

Number "number" =
  Integer
  / Decimal

DecimalIntegerLiteral "decimal integer literal"
  = "0"
  / NonZeroDigit DecimalDigit*

DecimalDigit "decimal digit"
  = [0-9]

NonZeroDigit "non zero digit"
  = [1-9]

Boolean "boolean" =
  "true" { return true }
  / "false" { return false }

StringLiteral "string"
  = '"' chars:DoubleStringCharacter* '"' {
      return chars.join("");
    }
  / "'" chars:SingleStringCharacter* "'" {
      return chars.join("");
    }

BacktickString "backtick string" =
  "`" content:BacktickStringContent* "`" {
    return content;
  }
  
BacktickStringContent "string backtick content" =
  interpolation:InterpolationExpression { return interpolation }
  / escapedBacktick:EscapedBacktick { return escapedBacktick }
  / escapedVarSymbol:EscapedVarSymbol { return escapedVarSymbol }
  / characters:[^\\`$]+ { return {type: "string", value: characters.join("")} }

InterpolationExpression =
  "${" __ variable:VariableValue __ "}" { return variable }
  / variable:VariablePropertyAccess
  / variable:VariableSymbol { return {type: "variable", value: variable} }
  
EscapedBacktick "escaped backtick" = 
  "\\`" { return "`" }

EscapedVarSymbol "escaped var symbol" = 
  "\\$" { return {type: "string", value: "$"} }

DoubleStringCharacter "double string character"
  = !('"') SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }

SingleStringCharacter "single string character"
  = !("'") SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
/******************************* TEXT TYPES END */

Variable "variable text" = t:Text { return {value: t.join("")} }

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

SingleEscapeCharacter "single escape character"
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b"; }
  / "f"  { return "\f"; }
  / "n"  { return "\n"; }
  / "r"  { return "\r"; }
  / "t"  { return "\t"; }
  / "v"  { return "\v"; }

NonEscapeCharacter "non escape character"
  = !(EscapeCharacter) SourceCharacter { return text(); }

EscapeCharacter "escape character"
  = SingleEscapeCharacter
  / DecimalDigit
  / "x"
  / "u"

HexEscapeSequence "hexadeimal escape sequence"
  = "x" digits:$(HexDigit HexDigit) {
      return String.fromCharCode(parseInt(digits, 16));
    }

UnicodeEscapeSequence "unicode escape sequence"
  = "u" digits:$(HexDigit HexDigit HexDigit HexDigit) {
      return String.fromCharCode(parseInt(digits, 16));
    }

SourceCharacter "source character"
  = .
  
HexDigit "hexadecimal digit"
  = [0-9a-f]i
  
EOS "end of sentence"
  = 
  _ SingleLineComment? LineTerminatorSequence
  / __ EOF

EOF "end of file"
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

L "new line" = 
	(LineTerminatorSequence / Comment)*


/******************************* MATH EXPR */
MathExpression "math expression" =
  "#" _ head:Term tail:(_ op:("+" / "-") _ term:Term {return {op, term}})* EOS? {
      return {
        type: "mathExpression",
        value: [head, ...tail]
      }
    }

Term "term" = 
  head:Factor tail:(_ op:("*" / "/") _ factor:Factor {return {op, factor}})* {
      return {
        type: "mathTerm",
        value: [head, ...tail]
      }
    }

Factor "factor" = 
  "(" _ expr:MathExpression _ ")" { return expr; }
  / number:Number { return {type: "number", value: number.join("")} }
  / command:PipedCommand { return {type: "command", command} }
  / __ "(" __ command:PipedCommand __ ")" { return {type: "command", command} }
  / variable:VariableSymbol { return {type: "variable", value: variable} }
/******************************* MATH EXPR END */


/******************************* LISTS */
List "list" =
  __ "[" __ head:ListItem? tail:("," __ item:ListItem? {return item})* ","? __ "]" {
    return {
      type: "List",
      value: !head || !tail ? [] : [head, ...tail]
    }
  }
  
ListItem "list item" =
  VariableValue
/******************************* LISTS END */


/******************************* MAPS */
Map "map" =
  "{" __ items:(MapItem)* __ "}" {
    return {
      type: "Map",
      value: items
    }
  }

MapItem "map item" =
  key:Variable ":" __ value:MapValue ","? __ {
    return {
      key: {
        type: "string",
        value: key.value
      },
      value
    }
  }
  / "[" __ key:MapValue __ "]" ":" __ value:MapValue ","? __ {
    return {
      key, value
    }
  }
  
MapValue "map value" = VariableValue
/******************************* MAPS END */

  
