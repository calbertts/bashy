" Define the filetype for this syntax file
au BufNewFile,BufRead *.bashy set filetype=bashy

" Define the comment syntax
syn match mylangComment "//.*"
syn match mylangComment "/\*\_.\{-}\*/"

" Define the command syntax
syn match mylangCommand "\w\+\s"
syn match mylangCommand2 "\w\+\n"

" Define the function syntax
syn match mylangFunction "\w\+:.*"

" Define the variable syntax
syn match mylangVariable "\$\w\+"

" Define the string syntax
syn match mylangString "\".*\""

" Define the number syntax
syn match mylangNumber "\d\+"

" Exec syntax
syn match mylangOperator "\~\$"

" Eval syntax
syn match mylangOperator "\~\~"

" Define the special characters
"syn match mylangSpecial "\|\|"
syn match mylangSpecial ">"
syn match mylangSpecial "<"
syn match mylangSpecial "&"
syn match mylangSpecial "|"
syn match mylangSpecial "("
syn match mylangSpecial ")"

" Define the operator syntax
syn match mylangOperator "="
syn match mylangOperator "by"

" Highlight the comments
hi def link mylangComment Comment

" Highlight the commands
hi def link mylangCommand Keyword

" Highlight the variables
hi def link mylangVariable Identifier

" Highlight the strings
hi def link mylangString String

" Highlight the numbers
hi def link mylangNumber Number

" Highlight the special characters
hi def link mylangSpecial Special

" Highlight the operators
hi def link mylangOperator Operator

" Highlight the functions
hi def link mylangFunction Function
