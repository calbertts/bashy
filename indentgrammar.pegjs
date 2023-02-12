{
    let prevIndentCount = 0;
    function print(...s) { console.log(...s); }
}

Program = sentences?

sentences =
  FunctionDeclaration
  / word

Indent 'indent'
    = i:("  "+) { 
        let currentIndentCount = i.toString().replace(/,/g, "").length;
        if (currentIndentCount === prevIndentCount + 2) { 
            // DEBUG //
            print("=== Indent ===");
            print("    current:"+currentIndentCount); 
            print("    previous:"+prevIndentCount);
            print("    lineNumber:"+location().start.line); 
            // DEBUG //
            prevIndentCount += 2;
            return "[indent]";
        }
        error("error: expected a 2-space indentation here!")
    } // 2 spaces 

Samedent 'samedent'
    = s:("  "+ / "") &{
        let currentIndentCount = s.toString().replace(/,/g, "").length;
        if (currentIndentCount === prevIndentCount) {
            print("=== Samedent ===");
            return true;
        }
        return false
    }

Dedent 'dedent'
    = d:("  "+ / "") {
        let currentIndentCount = d.toString().replace(/,/g, "").length;
        if (currentIndentCount < prevIndentCount) {
            // DEBUG //
            print("=== Dedent ===");
            print("    current:"+currentIndentCount); 
            print("    previous:"+prevIndentCount);
            print("    lineNumber:"+location().start.line); 
            // DEBUG //
            prevIndentCount -= 2;
            return "[dedent]";
        }
        error("error: expected a 2-space dedentation here!");
    }

word = 
  l:[a-z]+ {return l.join("")}
  / l:"\n" {return undefined}
L "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"
_ = " "


FunctionDeclaration 
    = name:word ":" body:FunctionBody L? {
      return {
        name, body
      }
    }

FunctionBody
    = L? Indent? s0:word s1:(L? Samedent s1:sentences {return s1})* Dedent {
      return [
        s0, ...s1
      ]
    }

/*
oe:
  ok
  op
  oi
  h
  omg:
    ohno
    ok
    ddddd:
      ww
    q
  yes
  dd
*/

/*
{
   "name": "oe",
   "body": [
      "ok",
      "op",
      "oi",
      "h",
      {
         "name": "omg",
         "body": [
            "ohno",
            "ok",
            {
               "name": "ddddd",
               "body": [
                  "ww"
               ]
            },
            "q"
         ]
      },
      "yes",
      "dd"
   ]
}
*/
