const viewSourceCode = document.getElementById('source-code');
const viewProgressBar = document.getElementById('progress-bar');
const viewOutputLines = document.getElementById('output-lines');

let tLastKeyPressed = null;
let tProgressBar = null;
viewSourceCode.addEventListener('keyup', () =>
{
  clearTimeout(tLastKeyPressed);
  tLastKeyPressed = setTimeout(interpretSourceCode, 1000);

  clearTimeout(tProgressBar);
  viewProgressBar.classList.remove('animate');
  tProgressBar = setTimeout(() =>
  {
    viewProgressBar.classList.add('animate');
  }, 100);
});

function interpretSourceCode()
{
  // Clear output from the last run
  viewOutputLines.innerHTML = '';

  Lox.run(viewSourceCode.value);
}

function printLine(line)
{
  viewOutputLines.insertAdjacentHTML('beforeend', `<div>${line}</div>`);
}
