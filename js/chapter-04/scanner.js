class Scanner
{
  tokens = [];
  start = 0;
  current = 0;
  line = 1;

  keywords =
  {
    'and': tokenType.AND,
    'class': tokenType.CLASS,
    'else': tokenType.ELSE,
    'false': tokenType.FALSE,
    'for': tokenType.FOR,
    'fun': tokenType.FUN,
    'if': tokenType.IF,
    'nil': tokenType.NIL,
    'or': tokenType.OR,
    'print': tokenType.PRINT,
    'return': tokenType.RETURN,
    'super': tokenType.SUPER,
    'this': tokenType.THIS,
    'true': tokenType.TRUE,
    'var': tokenType.VAR,
    'while': tokenType.WHILE,
  };

  constructor(source)
  {
    this.source = source;
  }

  scanTokens()
  {
    while (!this.isAtEnd())
    {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(tokenType.EOF, '', null, this.line));
    return this.tokens;
  }

  scanToken()
  {
    const c = this.advance();
    switch (c)
    {
      case '(': this.addToken(tokenType.LEFT_PAREN); break;
      case ')': this.addToken(tokenType.RIGHT_PAREN); break;
      case '{': this.addToken(tokenType.LEFT_BRACE); break;
      case '}': this.addToken(tokenType.RIGHT_BRACE); break;
      case ',': this.addToken(tokenType.COMMA); break;
      case '.': this.addToken(tokenType.DOT); break;
      case '-': this.addToken(tokenType.MINUS); break;
      case '+': this.addToken(tokenType.PLUS); break;
      case ';': this.addToken(tokenType.SEMICOLON); break;
      case '*': this.addToken(tokenType.START); break;
      case '!':
        this.addToken(this.match('=') ? tokenType.BANG_EQUAL : tokenType.BANG);
        break;
      case '=':
        this.addToken(this.match('=') ? tokenType.EQUAL_EQUAL : tokenType.EQUAL);
        break;
      case '<':
        this.addToken(this.match('=') ? tokenType.LESS_EQUAL : tokenType.LESS);
        break;
      case '>':
        this.addToken(this.match('=') ? tokenType.GREATER_EQUAL : tokenType.GREATER);
        break;
      case '/':
        if (this.match('/'))
        {
          // A comment goes until the end of the line.
          while (this.peek() !== '\n' && !this.isAtEnd())
          {
            this.advance();
          }
        }
        else
        {
          this.addToken(tokenType.SLASH);
        }
        break;

      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break;

      case '\n':
        ++this.line;
        break;

      case '"': this.string(); break;

      default:
        if (this.isDigit(c))
        {
          this.number();
        }
        else if(this.isAlpha(c))
        {
          this.identifier();
        }
        else
        {
          Lox.error(this.line, 'Unexpected character.');
        }
        break;
    }
  }

  identifier()
  {
    while (this.isAlphaNumeric(this.peek()))
    {
      this.advance();
    }
    const text = this.source.substring(this.start, this.current);
    let type = this.keywords[text];
    if (type === undefined || type === null)
    {
      type = tokenType.IDENTIFIER;
    }

    this.addToken(type);
  }

  number()
  {
    while (this.isDigit(this.peek()))
    {
      this.advance();
    }

    // Look for a fractional part.
    if (this.peek() === '.' && this.isDigit(this.peekNext()))
    {
      // Consume the '.'
      this.advance();

      while (this.isDigit(this.peek()))
      {
        this.advance();
      }
    }

    this.addToken(tokenType.NUMBER, parseFloat(this.source.substring(this.start, this.current)));
  }

  string()
  {
    while (this.peek() !== '"' && !this.isAtEnd())
    {
      if (this.peek() === '\n')
      {
        ++this.line;
      }
      this.advance();
    }

    if (!this.isAtEnd())
    {
      Lox.error(this.line, "Unterminated string.");
      return;
    }

    // The closing ".
    this.advance();

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(tokenType.STRING, value);
  }

  match(expected)
  {
    if (this.isAtEnd()) { return false; }
    if (this.source.charAt(this.current) !== expected) { return false; }

    ++this.current;
    return true;
  }

  peek()
  {
    if (this.isAtEnd())
    {
      return '\0';
    }
    return this.source.charAt(this.current);
  }

  peekNext()
  {
    if (this.current + 1 >= this.source.length)
    {
      return '\0';
    }
    return this.source.charAt(this.current + 1);
  }

  isAlpha(c)
  {
    return (c >= 'a' && c <= 'z') ||
           (c >= 'A' && c <= 'Z') ||
            c === '_';
  }

  isAlphaNumeric(c)
  {
    return this.isAlpha(c) || this.isDigit(c);
  }

  isDigit(c)
  {
    return c >= '0' && c <= '9';
  }

  isAtEnd()
  {
    return this.current >= this.source.length;
  }

  advance()
  {
    return this.source.charAt(this.current++);
  }

  addToken(type, literal = null)
  {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }
}
