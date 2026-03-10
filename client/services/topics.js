const programmingLanguages = `
Python, JavaScript, Java, C#, C++, C, Go, R, PHP, Swift, Kotlin, TypeScript, Ruby, Rust, Scala, SQL, HTML, CSS, Objective-C, Assembly, Visual Basic, Pascal, Perl, Lua, Haskell, MATLAB, Groovy, Dart, Elixir, Clojure, Erlang, F#, Prolog, Lisp, Scheme, Ada, Forth, APL, Smalltalk, Tcl, Pike, Raku, VHDL, Verilog, COBOL, Fortran, PL/I, Pascal, Modula-2, ALGOL, Simula, BASIC, Logo, SnoBOL, Icon, REXX, Awk, Sed, Transact-SQL, PL/SQL, NoSQL, XPath, XQuery, Cypher, OCaml, Standard ML, Idris, Agda, Coq, Nim, Crystal, Julia, D, Zig, B, BCPL, ActionScript, PostScript, Wolfram Language, LabVIEW, Scratch, Alice, Eiffel, Euphoria, Inform, J, K, Q, MUMPS, Natural, OpenEdge ABL, RPG, SAS, Stata, SPARK, UnrealScript, GDScript, Haxe, Ring, Vala
`;
const spokenLanguages = `
Английский, Испанский, Китайский, Хинди, Арабский, Французский, Немецкий, Японский, Португальский, Бенгальский, Урду, Индонезийский, Итальянский, Корейский, Турецкий, Вьетнамский, Польский, Нидерландский, Тайский, Шведский, Украинский, Персидский/Фарси, Румынский, Греческий, Филиппинский/Тагальский, Суахили, Финский, Чешский, Венгерский, Иврит, Норвежский, Датский, Сербский, Хорватский, Болгарский, Словацкий, Литовский, Латышский, Эстонский, Албанский, Армянский, Грузинский, Тамильский, Телугу, Маратхи, Гуджарати, Панджаби, Малайский, Бирманский, Кхмерский, Лаосский, Непальский, Сингальский, Пушту, Курдский, Узбекский, Казахский, Туркменский, Азербайджанский, Таджикский, Киргизский, Монгольский, Исландский, Ирландский, Валлийский, Баскский, Каталанский, Галисийский, Креольский, Йоруба, Игбо, Хауса, Зулу, Амхарский, Оромо, Сомалийский, Малагасийский, Кантонский, Мяо, Уйгурский, Тибетский, Яванский, Сунданский, Себуано, Тагалог, Македонский, Словенский, Боснийский, Коса, Сесото, Тсвана, Гана, Волоф, Майя, Науатль, Гуарани, Кечуа, Аймара
`;
const frameworksAndTech = `
React, Angular, Vue, Next, Nuxt, Svelte, jQuery, Express, Koa, NestJS, Spring, Spring Boot, Hibernate, Jakarta EE, Django, Flask, FastAPI, Ruby on Rails, Sinatra, Laravel, Symfony, CodeIgniter, ASP.NET Core, Xamarin, .NET MAUI, Flutter, React Native, Ktor, Grails, Phoenix, Vapor, Kitura, Gin, Echo, PyTorch, TensorFlow, Keras, Scikit-learn, Pandas, NumPy, Unity, Unreal Engine, Godot, Bootstrap, Tailwind CSS, Material-UI (MUI), Ant Design, Electron, Tauri
`;

const parseToList = (str) => str.split(',').map(s => s.trim()).filter(s => s.length > 0);

export const allTopics = [
    ...parseToList(programmingLanguages),
    ...parseToList(spokenLanguages),
    ...parseToList(frameworksAndTech),
];

export const allTopicsLowerCase = allTopics.map(t => t.toLowerCase());