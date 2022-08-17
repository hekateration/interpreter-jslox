const viewSourceCode = document.getElementById('source-code');
const viewProgressBar = document.getElementById('progress-bar');
const viewOutput = document.getElementById('out');

let tLastKeyPressed = null;
let tProgressBar = null;
viewSourceCode.addEventListener('keyup', () =>
{
  clearTimeout(tLastKeyPressed);
  tLastKeyPressed = setTimeout(interpretSourceCode, 2900);

  clearTimeout(tProgressBar);
  viewProgressBar.classList.remove('animate');
  tProgressBar = setTimeout(() =>
  {
    viewProgressBar.classList.add('animate');
  }, 100);
});

function interpretSourceCode()
{
  viewOutput.innerHTML = viewSourceCode.value;
}
