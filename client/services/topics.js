const programmingLanguages = `
Python, JavaScript, Java, C#, C++, C, Go, R, PHP, Swift, Kotlin, TypeScript, Ruby, Rust, Scala, SQL, HTML, CSS, Objective-C, Assembly, Visual Basic, Pascal, Perl, Lua, Haskell, MATLAB, Groovy, Dart, Elixir, Clojure, Erlang, F#, Prolog, Lisp, Scheme, Ada, Forth, APL, Smalltalk, Tcl, Pike, Raku, VHDL, Verilog, COBOL, Fortran, PL/I, Pascal, Modula-2, ALGOL, Simula, BASIC, Logo, SnoBOL, Icon, REXX, Awk, Sed, Transact-SQL, PL/SQL, NoSQL, XPath, XQuery, Cypher, OCaml, Standard ML, Idris, Agda, Coq, Nim, Crystal, Julia, D, Zig, B, BCPL, ActionScript, PostScript, Wolfram Language, LabVIEW, Scratch, Alice, Eiffel, Euphoria, Inform, J, K, Q, MUMPS, Natural, OpenEdge ABL, RPG, SAS, Stata, SPARK, UnrealScript, GDScript, Haxe, Ring, Vala
`;
const frameworksAndTech = `
React, Angular, Vue, Next, Nuxt, Svelte, jQuery, Express, Koa, NestJS, Spring, Spring Boot, Hibernate, Jakarta EE, Django, Flask, FastAPI, Ruby on Rails, Sinatra, Laravel, Symfony, CodeIgniter, ASP.NET Core, Xamarin, .NET MAUI, Flutter, React Native, Ktor, Grails, Phoenix, Vapor, Kitura, Gin, Echo, PyTorch, TensorFlow, Keras, Scikit-learn, Pandas, NumPy, Unity, Unreal Engine, Godot, Bootstrap, Tailwind CSS, Material-UI (MUI), Ant Design, Electron, Tauri
`;

const parseToList = (str) => str.split(',').map(s => s.trim()).filter(s => s.length > 0);

export const allTopics = [
    ...parseToList(programmingLanguages),
    ...parseToList(frameworksAndTech),
];

export const allTopicsLowerCase = allTopics.map(t => t.toLowerCase());