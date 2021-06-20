**Still in the Alpha stage.** Please [sponsor me](https://github.com/sponsors/piglovesyou) to support this project.

---

# Fig

Fig is another “Figma to React” tool to generate and synchronize various template languages, designed to be AST-based, pluggable platform.

![Screen Recording 2021-06-20 at 11 19 13](https://user-images.githubusercontent.com/217530/122660189-4b288100-d1ba-11eb-83d8-f538775e4cca.gif)

## Sample output

[This website example](https://piglovesyou.github.io/fig/patagonia/public/Home_1%244.html) is generated from [a Figma file](https://www.figma.com/file/pC6EOjjdZpS7PVsPTgjNLL/Patagonia?node-id=1%3A4). Not perfect, but it seems okay.

## Try it out (Note: Alpha spec)

Make sure you have [Node.js](https://nodejs.org/) installed in your machine.

1. Prepare your **Figma access token** by following [this guide](https://www.figma.com/developers/api#access-tokens).
2. Find out your **fileKey** in your browser location bar. It should look like `https://www.figma.com/file/:fileKey/:title`.
Run this command in your terminal.
3. Run this command.

```bash
$ npx @piglovesyou/fig-cli@latest --token FIGMA_ACCESS_TOKEN FILE_KEY
```

You'll find files generated like these.

```
├── components
│   ├── Button_1$48.js
│   ├── Button_1$48.tsx
├── images
│   ├── 02d6c74b348c68bacf5b0a87d670e94f.jpeg
│   ├── 1b823b23208a6cf9ec484609d96aadcb.svg
│   ├── f893d788c09554ac3f7c80d6a9bfb22e.png
├── pages
│   ├── Home_1$4.js
│   └── Home_1$4.tsx
└── public
    └── Home_1$4.html
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

* I'd like you to [make an issue](https://github.com/piglovesyou/fig/issues/new) to report CSS bugs/improvements. I'm happy even more if you make the PR for it, but not necessary!
* [A new Plugin PR](https://github.com/piglovesyou/fig/tree/main/src/plugins) is not ready since the architecture's still unstable. Please [issue it](https://github.com/piglovesyou/fig/issues/new) instead, e.g. "I want Vue!"

## License

APACHE LICENSE, VERSION 2.0

## Author

[Soichi Takamura @piglovesyou](https://github.com/piglovesyou/)
