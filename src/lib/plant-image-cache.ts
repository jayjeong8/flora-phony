const cache = new Map<string, HTMLImageElement>();
const loading = new Map<string, Promise<HTMLImageElement>>();

export function loadPlantImage(svgPath: string): Promise<HTMLImageElement> {
  const cached = cache.get(svgPath);
  if (cached) return Promise.resolve(cached);

  const pending = loading.get(svgPath);
  if (pending) return pending;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      cache.set(svgPath, img);
      loading.delete(svgPath);
      resolve(img);
    };
    img.onerror = () => {
      loading.delete(svgPath);
      reject(new Error(`Failed to load plant image: ${svgPath}`));
    };
    img.src = svgPath;
  });

  loading.set(svgPath, promise);
  return promise;
}
