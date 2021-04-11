async function main() {
  // const outDir = join(process.cwd(), '__generated__');
  // await gen(outDir, fileKey);
}

main().catch((err) => {
  console.error(err);
  console.error(err.stack);
});
