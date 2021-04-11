export type GenContext = {
  componentsMap: Map<string, { name: string; written: boolean }>;
  imagesMap: Map<string, string>;
  vectorsMap: Map<string, string>;
  outDir: string;
  // mode: 'generate' | 'edit'
};
