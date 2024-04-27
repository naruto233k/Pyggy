// Define a token type enumeration
const TokenType = {
    NUMBER: 'NUMBER',
    PLUS: 'PLUS',
    MINUS: 'MINUS',
    MULTIPLY: 'MULTIPLY',
    DIVIDE: 'DIVIDE',
    LPAREN: 'LPAREN', // Left Parenthesis
    RPAREN: 'RPAREN', // Right Parenthesis
    ID: 'ID',         // Identifier (for variables and functions)
    ASSIGN: 'ASSIGN', // Assignment operator
    IF: 'IF',         // If statement
    ELSE: 'ELSE',     // Else statement
    WHILE: 'WHILE',   // While loop
    FUNCTION: 'FUNCTION', // Function declaration
    COMMA: 'COMMA',   // Comma for argument separation
    RETURN: 'RETURN', // Return statement
    PRINT: 'PRINT',   // Print statement
    INPUT: 'INPUT',   // Input statement
    EOF: 'EOF',       // End of file
};

// Define a token class
class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

// Define a lexer to tokenize input strings
class Lexer {
    constructor(text) {
        this.text = text;
        this.pos = 0;
        this.currentChar = this.text[this.pos];
    }

    advance() {
        this.pos++;
        if (this.pos < this.text.length) {
            this.currentChar = this.text[this.pos];
        } else {
            this.currentChar = null;
        }
    }

    peek() {
        const peekPos = this.pos + 1;
        if (peekPos < this.text.length) {
            return this.text[peekPos];
        }
        return null;
    }

    skipWhitespace() {
        while (this.currentChar !== null && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    number() {
        let result = '';
        while (this.currentChar !== null && /\d/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return parseInt(result);
    }

    identifier() {
        let result = '';
        while (this.currentChar !== null && /\w/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return result;
    }

    getNextToken() {
        while (this.currentChar !== null) {
            if (/\s/.test(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }

            if (/\d/.test(this.currentChar)) {
                return new Token(TokenType.NUMBER, this.number());
            }

            if (/\w/.test(this.currentChar)) {
                return new Token(TokenType.ID, this.identifier());
            }

            if (this.currentChar === '+') {
                this.advance();
                return new Token(TokenType.PLUS, '+');
            }

            if (this.currentChar === '-') {
                this.advance();
                return new Token(TokenType.MINUS, '-');
            }

            if (this.currentChar === '*') {
                this.advance();
                return new Token(TokenType.MULTIPLY, '*');
            }

            if (this.currentChar === '/') {
                this.advance();
                return new Token(TokenType.DIVIDE, '/');
            }

            if (this.currentChar === '(') {
                this.advance();
                return new Token(TokenType.LPAREN, '(');
            }

            if (this.currentChar === ')') {
                this.advance();
                return new Token(TokenType.RPAREN, ')');
            }

            if (this.currentChar === '=') {
                this.advance();
                return new Token(TokenType.ASSIGN, '=');
            }

            if (this.currentChar === ',') {
                this.advance();
                return new Token(TokenType.COMMA, ',');
            }

            if (this.currentChar === 'i' && this.peek() === 'f') {
                this.advance();
                this.advance();
                return new Token(TokenType.IF, 'if');
            }

            if (this.currentChar === 'e' && this.peek() === 'l' && this.peek(2) === 's' && this.peek(3) === 'e') {
                this.advance();
                this.advance();
                this.advance();
                this.advance();
                return new Token(TokenType.ELSE, 'else');
            }

            if (this.currentChar === 'w' && this.peek() === 'h' && this.peek(2) === 'i' && this.peek(3) === 'l' && this.peek(4) === 'e') {
                this.advance();
                this.advance();
                this.advance();
                this.advance();
                this.advance();
                return new Token(TokenType.WHILE, 'while');
            }

            if (this.currentChar === 'f' && this.peek() === 'u' && this.peek(2) === 'n' && this.peek(3) === 'c' && this.peek(4) === 't' && this.peek(5) === 'i' && this.peek(6) === 'o' && this.peek(7) === 'n') {
                this.advance();
                this.advance();
                this.advance();
                this.advance();
                this.advance();
                this.advance();
                this.advance();
                this.advance();
                return new Token(TokenType.FUNCTION, 'function');
            }

            if (this.currentChar === 'r' && this.peek() === 'e' && this.peek(2) === 't' && this.peek(3) === 'u' && this.peek(4) === 'r' && this.peek(5) === 'n') {
                this.advance();
                this.advance();
                this.advance();
                this.advance();
                this.advance();
                return new Token(TokenType.RETURN, 'return');
            }

            if (this.currentChar === 'p' && this.peek() === 'r' && this.peek(2) === 'i' && this.peek(3) === 'n' && this.peek(4) === 't') {
                this.advance();
                this.advance();
                this.advance();
                this.advance();
                this.advance();
                return new Token(TokenType.PRINT, 'print');
            }

            if (this.currentChar === 'i' && this.peek() === 'n' && this.peek(2) === 'p' && this.peek(3) === 'u' && this.peek(4) === 't') {
                this.advance();
                this.advance();
                this.advance();
                this.advance();
                this.advance();
                return new Token(TokenType.INPUT, 'input');
            }

            throw new Error('Invalid character: ' + this.currentChar);
        }

        return new Token(TokenType.EOF, null);
    }
}

// Define a symbol table to store variables, functions, and their values
class SymbolTable {
    constructor() {
        this.symbols = {};
    }

    set(name, value) {
        this.symbols[name] = value;
    }

    get(name) {
        if (this.symbols.hasOwnProperty(name)) {
            return this.symbols[name];
        } else {
            throw new Error('Variable or function ' + name + ' is not defined');
        }
    }

    setFunction(name, params, body) {
        this.symbols[name] = { params, body };
    }

    getFunction(name) {
        if (this.symbols.hasOwnProperty(name)) {
            return this.symbols[name];
        } else {
            throw new Error('Function ' + name + ' is not defined');
        }
    }
}

// Define an interpreter to parse and evaluate expressions
class Interpreter {
    constructor(lexer, symbolTable) {
        this.lexer = lexer;
        this.currentToken = this.lexer.getNextToken();
        this.symbolTable = symbolTable;
    }

    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            throw new Error('Invalid syntax');
        }
    }

    factor() {
        const token = this.currentToken;
        if (token.type === TokenType.NUMBER) {
            this.eat(TokenType.NUMBER);
            return token.value;
        } else if (token.type === TokenType.ID) {
            const name = token.value;
            this.eat(TokenType.ID);
            return this.symbolTable.get(name);
        } else if (token.type === TokenType.LPAREN) {
            this.eat(TokenType.LPAREN);
            const result = this.expr();
            this.eat(TokenType.RPAREN);
            return result;
        } else if (token.type === TokenType.FUNCTION) {
            return this.functionDeclaration();
        } else {
            throw new Error('Invalid syntax');
        }
    }

    term() {
        let result = this.factor();

        while ([TokenType.MULTIPLY, TokenType.DIVIDE].includes(this.currentToken.type)) {
            const token = this.currentToken;
            if (token.type === TokenType.MULTIPLY) {
                this.eat(TokenType.MULTIPLY);
                result *= this.factor();
            } else if (token.type === TokenType.DIVIDE) {
                this.eat(TokenType.DIVIDE);
                result /= this.factor();
            }
        }

        return result;
    }

    expr() {
        let result = this.term();

        while ([TokenType.PLUS, TokenType.MINUS].includes(this.currentToken.type)) {
            const token = this.currentToken;
            if (token.type === TokenType.PLUS) {
                this.eat(TokenType.PLUS);
                result += this.term();
            } else if (token.type === TokenType.MINUS) {
                this.eat(TokenType.MINUS);
                result -= this.term();
            }
        }

        return result;
    }

    assignmentStatement() {
        const variableName = this.currentToken.value;
        this.eat(TokenType.ID);
        this.eat(TokenType.ASSIGN);
        const value = this.expr();
        this.symbolTable.set(variableName, value);
    }

    ifStatement() {
        this.eat(TokenType.IF);
        const condition = this.expr();
        if (condition) {
            const result = this.statement();
            if (this.currentToken.type === TokenType.ELSE) {
                this.eat(TokenType.ELSE);
                this.statement(); // skip else branch
            }
            return result;
        } else {
            while (this.currentToken.type !== TokenType.ELSE && this.currentToken.type !== TokenType.EOF) {
                this.currentToken = this.lexer.getNextToken(); // skip if branch
            }
            if (this.currentToken.type === TokenType.ELSE) {
                this.eat(TokenType.ELSE);
                return this.statement();
            }
        }
    }

    whileLoop() {
        this.eat(TokenType.WHILE);
        const condition = this.expr();
        let result;
        while (condition) {
            result = this.statement();
            condition = this.expr();
        }
        return result;
    }

    functionDeclaration() {
        this.eat(TokenType.FUNCTION);
        const functionName = this.currentToken.value;
        this.eat(TokenType.ID);
        this.eat(TokenType.LPAREN);
        const params = [];
        if (this.currentToken.type !== TokenType.RPAREN) {
            params.push(this.currentToken.value);
            this.eat(TokenType.ID);
            while (this.currentToken.type === TokenType.COMMA) {
                this.eat(TokenType.COMMA);
                params.push(this.currentToken.value);
                this.eat(TokenType.ID);
            }
        }
        this.eat(TokenType.RPAREN);
        this.eat(TokenType.LPAREN);
        const body = this.statement();
        this.eat(TokenType.RPAREN);
        this.symbolTable.setFunction(functionName, params, body);
    }

    functionCall(functionName, args) {
        const func = this.symbolTable.getFunction(functionName);
        if (args.length !== func.params.length) {
            throw new Error('Invalid number of arguments for function ' + functionName);
        }
        const localSymbolTable = new SymbolTable();
        for (let i = 0; i < func.params.length; i++) {
            localSymbolTable.set(func.params[i], args[i]);
        }
        const interpreter = new Interpreter(new Lexer(func.body), localSymbolTable);
        return interpreter.interpret();
    }

    printStatement() {
        this.eat(TokenType.PRINT);
        const value = this.expr();
        console.log(value);
    }

    statement() {
        if (this.currentToken.type === TokenType.ID) {
            return this.assignmentStatement();
        } else if (this.currentToken.type === TokenType.IF) {
            return this.ifStatement();
        } else if (this.currentToken.type === TokenType.WHILE) {
            return this.whileLoop();
        } else if (this.currentToken.type === TokenType.PRINT) {
            return this.printStatement();
        } else {
            return this.expr();
        }
    }

    interpret() {
        let result;
        while (this.currentToken.type !== TokenType.EOF) {
            result = this.statement();
        }
        return result;
    }
}

// Built-in functions
const builtInFunctions = {
    'print': (...args) => console.log(...args),
    'input': () => prompt(),
};

// Usage example
const text = `
    function add(x, y)
        return x + y

    function subtract(x, y)
        return x - y

    function divide(x, y)
        return x / y

    function multiply(x, y)
        return x * y

    function greet(name)
        print("Hello, " + name)

    x = 10
    y = 5
    result = add(x, y)
    print("Result:", result)
    greet("John")
`;

// Check if the user starts the program with a special keyword
const specialKeyword = 'hello_world';
const specialMessage = `
    function generateHelloWorld() {
        print("   _____       _       _     _   _       _         _____                 _ ");
        print("  / ____|     (_)     | |   | | (_)     | |       / ____|               | |");
        print(" | (___  _ __  _ _ __ | |_  | |_ _  __ _| | ___  | |  __ _ __ ___  _ __ | |");
        print("  \\___ \\| '_ \\| | '_ \\| __| | __| |/ _\\` | |/ _ \\ | | |_ | '__/ _ \\| '_ \\| |");
        print("  ____) | | | | | | | | |_  | |_| | (_| | |  __/ | |__| | | | (_) | | | |_|");
        print(" |_____/|_| |_|_|_| |_|\\__|  \\__|_|\\__,_|_|\\___|  \\_____|_|  \\___/|_| |_|(_)");
        print("");
        print("  _    _       _                          __ _       _ _            ");
        print(" | |  | |     | |                        / _(_)     (_) |           ");
        print(" | |__| | ___ | |_ ___  __ _ _ __ ___   | |_ _ _ __  _| |_ ___ _ __ ");
        print(" |  __  |/ _ \\| __/ _ \\/ _\` | '_ \` _ \\  |  _| | '_ \\| | __/ _ \\ '__|");
        print(" | |  | | (_) | ||  __/ (_| | | | | | | | | | | | | | | ||  __/ |   ");
        print(" |_|  |_|\\___/ \\__\\___|\\__, |_| |_| |_| |_| |_|_| |_|_|\\__\\___|_|   ");
        print("                        __/ |                                        ");
        print("                       |___/                                         ");
    }
    generateHelloWorld();
`;

let lexer, symbolTable, interpreter;

if (text.startsWith(specialKeyword)) {
    lexer = new Lexer(specialMessage + text.substring(specialKeyword.length));
} else {
    lexer = new Lexer(text);
}

symbolTable = new SymbolTable();
interpreter = new Interpreter(lexer, symbolTable);

// Add built-in functions to the symbol table
for (const functionName in builtInFunctions) {
    symbolTable.setFunction(functionName, [], builtInFunctions[functionName]);
}

const result = interpreter.interpret();
