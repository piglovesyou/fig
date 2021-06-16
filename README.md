**Still in the Alpha stage.** Please [sponsor me](https://github.com/sponsors/piglovesyou) to support this project.

---

# Fig

Fig is another “Figma to React” tool to generate and synchronize various template languages, designed to be AST-based, pluggable platform.

## Demo

Not perfect, but it seems pretty neat. [Give me a feedback](https://github.com/piglovesyou/fig/issues/new).

- [Website example](https://piglovesyou.github.io/fig/patagonia/public/Home_1%244.html), [Figma file](https://www.figma.com/file/pC6EOjjdZpS7PVsPTgjNLL/Patagonia?node-id=1%3A4)
- [Auto layout example](https://piglovesyou.github.io/fig/mini/public/Home_1$2.html), [Figma file](https://www.figma.com/file/MhB9ljAxaGlIk1IttXa09f/mini)
- [More pictures example](https://piglovesyou.github.io/fig/basic/public/Home_2$2.html), [Figma file](https://www.figma.com/file/QAIja81RKgYhQnIIJ0h9PJ/basic?node-id=0%3A1)

## Try it out (Note: Alpha spec)

Make sure you have [Node.js](https://nodejs.org/) installed in your machine.

Run this command in your terminal.

```bash
# Required options: --token token fileKey [fileKey ...]
$ npx @piglovesyou/fig-cli@latest --token YOUR_TOKEN FILE_KEY
```

- Get a **Figma access token** by following [this guide](https://www.figma.com/developers/api#access-tokens).
- **fileKey** is in your browser location bar when you open a Figma file. It should look as https://www.figma.com/file/:fileKey/:title.

Then you'll find files generated like this.

```
./images/f3d3bc2931ffab08c3df439b1392ed07.jpeg
./images/f893d788c09554ac3f7c80d6a9bfb22e.png
./components/Button_1$48.tsx
./components/Button_1$48.js
./pages/Home_1$4.tsx
./pages/Home_1$4.js
./public/Home_1$4.html
```

## Sponsors

[Sponsor me🍩🍦🥶](https://github.com/sponsors/piglovesyou)

## Milestones

- [x] Publish alpha release to generate simple React component source
- [ ] Support "synchronize" behavior
- [ ] Make it pluggable to generate multiple template language source
- [ ] Support another Stylesheet plugin perhaps to support Tailwind CSS
- [ ] Beta that supports another language, maybe Vue.js?

## Contributions

It's still in progress to design the plugin architecture. Please share this project and wait until it's prepared for the contribution!

## License

APACHE LICENSE, VERSION 2.0

## Author

[Soichi Takamura @piglovesyou](https://github.com/piglovesyou/)
