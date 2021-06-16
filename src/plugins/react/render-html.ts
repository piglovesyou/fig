import { join } from 'path';
import { format } from 'prettier';
import React, { ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export type RenderHtmlArgType = {
  pagesFullDir: string;
  name: string;
};

async function renderHtml({ pagesFullDir, name }: RenderHtmlArgType) {
  const pageComponentModule = await import(join(pagesFullDir, name + '.js'));
  const { [name]: PageComponent }: { [key: string]: ComponentType<any> } =
    pageComponentModule;

  const pageHtml = renderToStaticMarkup(
    React.createElement(PageComponent, null)
  );

  const html = `<html>
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

</style>
</head>
<body>${pageHtml}</body>
</html>`;

  return format(html, { parser: 'html' });
}

export default renderHtml;
