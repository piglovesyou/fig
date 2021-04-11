import { readFile } from 'fs/promises';
import { join } from 'path';
import { renderToStaticMarkup } from 'react-dom/server';

export function renderInHtml(element: JSX.Element) {
  return `<html>
  <head>
  <style>
  
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  position: absolute;
  width: 100vw;
  min-height: 100vh;
}

body > * {
  min-width: 100vw;
  min-height: 100vh;
}

/*.master {*/
/*  position: absolute;*/
/*  overflow: hidden;*/
/*  width: 100%;*/
/*  min-height: 100%;*/
/*}*/

/*input {*/
/*  font: inherit;*/
/*  border: inherit;*/
/*  padding: inherit;*/
/*  background-color: inherit;*/
/*  color: inherit;*/
/*}*/

/*input:focus {*/
/*  outline: none;*/
/*}*/

/*.outerDiv {*/
/*  position: relative;*/
/*  display: flex;*/
/*  width: 100%;*/
/*  pointer-events: none;*/
/*}*/

/*.innerDiv {*/
/*  position: relative;*/
/*  box-sizing: border-box;*/
/*  pointer-events: auto;*/
/*}*/

/*.centerer {*/
/*  position: absolute;*/
/*  height: 100%;*/
/*  top: 0;*/
/*  left: 0;*/
/*}*/

/*.maxer {*/
/*  align-items: flex-end;*/
/*  position: absolute;*/
/*  bottom: 0;*/
/*  */
/*  !* XXX: comes from visitor *!*/
/*  width: 100%;*/
/*  pointer-events: none;*/
/*}*/

.vector svg {
  width: 100%;
  height: 100%;
  position: absolute;
}

/*a {*/
/*  cursor: pointer;*/
/*}*/

</style>
</head>
<body>${renderToStaticMarkup(element)}</body>
</html>`;
}

export async function readFixtureJson(rel: string) {
  return JSON.parse(await readFile(join(process.cwd(), 'src', rel), 'utf-8'));
}
