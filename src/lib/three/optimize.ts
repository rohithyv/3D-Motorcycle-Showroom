import {
  Mesh,
  MeshStandardMaterial,
  Texture,
  type Object3D,
  type WebGLRenderer,
} from "three";
/** Called once per clone. GPU-native KTX2 textures can use the same material pipeline. */
export function optimizeTextures(
  root: Object3D,
  renderer: WebGLRenderer,
  mobile: boolean,
) {
  const limit = Math.min(
    mobile ? 2 : 4,
    renderer.capabilities.getMaxAnisotropy(),
  );
  root.traverse((node) => {
    if (!(node instanceof Mesh)) return;
    const materials = Array.isArray(node.material)
      ? node.material
      : [node.material];
    for (const material of materials) {
      if (!(material instanceof MeshStandardMaterial)) continue;
      for (const key of [
        "map",
        "normalMap",
        "roughnessMap",
        "metalnessMap",
      ] as const) {
        const texture = material[key];
        if (texture instanceof Texture && texture.anisotropy !== limit) {
          texture.anisotropy = limit;
          texture.needsUpdate = true;
        }
      }
    }
  });
}
