class Lox
{
  static hadError = false;

  static run(source)
  {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    console.log(tokens);

    for (const token of tokens)
    {
      printLine(`${token}`);
    }
  }

  static error(line, message)
  {
    this.report(line, '', message);
  }

  static report(line, where, message)
  {
    printLine(`[line ${line}] Error${where}: ${message}`);
    this.hadError = true;
  }
}
