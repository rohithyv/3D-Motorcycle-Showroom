export type CameraPose = {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
};
export const cameraPresets = {
  hero: { position: [2.5, 1.6, 6.8], target: [0, 0.45, 0], fov: 35 },
  frontWheel: { position: [3.1, 0.9, 3.2], target: [1, 0.15, 0], fov: 35 },
  rearWheel: { position: [-3.1, 1, 3.4], target: [-1, 0.2, 0], fov: 35 },
  body: { position: [0.5, 2.2, 4.8], target: [0, 0.75, 0], fov: 36 },
  battery: { position: [2.3, 1.8, 5.8], target: [0, 0.45, 0.4], fov: 39 },
  motor: { position: [-2.8, 1, 3.8], target: [-0.6, 0.15, 0], fov: 35 },
  exploded: { position: [3.4, 2.4, 8.2], target: [0, 0.7, 0], fov: 42 },
  configurator: { position: [3, 1.9, 6.8], target: [0, 0.4, 0], fov: 35 },
  nightRide: { position: [3.5, 1.1, 4.1], target: [0.2, 0.45, 0], fov: 42 },
} satisfies Record<string, CameraPose>;
export type CameraState = keyof typeof cameraPresets;
