" Define the filetype for this syntax file
au BufNewFile,BufRead *.bashy set filetype=bashy

" Define the comment syntax
syn match mylangComment "//.*"
syn match mylangComment "/\*\_.\{-}\*/"

" Define the command syntax
syn keyword mylangCommand print and or not list read filter replace cut count store execute sort merge

" Define the variable syntax
syn match mylangVariable "\w\+"

" Define the string syntax
syn match mylangString "\".*\""

" Define the number syntax
syn match mylangNumber "\d\+"

" Define the special characters
syn match mylangSpecial "\|\|"
syn match mylangSpecial ">"
syn match mylangSpecial "<"
syn match mylangSpecial "&"
syn match mylangSpecial "|"
syn match mylangSpecial "("
syn match mylangSpecial ")"

" Define the operator syntax
syn match mylangOperator "="
syn match mylangOperator "by"

" Define the function syntax
syn match mylangFunction "(\w\+)\s*("

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
