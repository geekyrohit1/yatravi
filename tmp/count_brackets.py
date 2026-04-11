
file_path = r'c:\Users\rohit\Downloads\yatravi\app\admin\seo\edit\[type]\[id]\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

open_braces = content.count('{')
close_braces = content.count('}')
open_parens = content.count('(')
close_parens = content.count(')')
open_tags = content.count('<div')
close_tags = content.count('</div')

print(f"Braces: {{: {open_braces}, }}: {close_braces}")
print(f"Parens: (: {open_parens}, ): {close_parens}")
print(f"Divs: <div: {open_tags}, </div: {close_tags}")
