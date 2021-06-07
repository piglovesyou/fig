import { join } from 'path';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile } from '../utils/fs';

export function renderInHtml(element: JSX.Element) {
  return `<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
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
  overflow: hidden;
  min-width: 100vw;
  min-height: 100vh;
}

/*.vector svg {*/
/*  width: 100%;*/
/*  height: 100%;*/
/*  position: absolute;*/
/*}*/

/*a {*/
/*  cursor: pointer;*/
/*}*/

</style>
</head>
<body>${renderToStaticMarkup(element)}</body>
</html>`;
}

export async function readJson(...paths: string[]) {
  const fullPath = join(...paths);
  return JSON.parse(await readFile(fullPath, 'utf-8'));
}
