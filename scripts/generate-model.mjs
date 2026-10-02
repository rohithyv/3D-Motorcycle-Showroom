import * as T from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { writeFileSync } from "node:fs";
// GLTFExporter uses the browser FileReader API for binary buffers.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((b) => {
      this.result = b;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((b) => {
      this.result = `data:application/octet-stream;base64,${Buffer.from(b).toString("base64")}`;
      this.onloadend?.();
    });
  }
};
const scene = new T.Scene();
const bike = new T.Group();
bike.name = "VOLT_R1";
scene.add(bike);
const mat = (color, metalness = 0.6, roughness = 0.3) =>
  new T.MeshStandardMaterial({ color, metalness, roughness });
const graphite = mat("#272b29"),
  black = mat("#111312", 0.35, 0.42),
  rubber = mat("#151616", 0.04, 0.86),
  silver = mat("#8b9290", 0.95, 0.24),
  body = mat("#b9c3aa", 0.7, 0.24),
  seat = mat("#242624", 0.05, 0.85),
  gold = mat("#8e896b", 0.8, 0.3),
  light = mat("#f8fff0", 0.1, 0.12);
light.emissive = new T.Color("#efffd5");
light.emissiveIntensity = 2;
function group(name) {
  const g = new T.Group();
  g.name = name;
  bike.add(g);
  return g;
}
const wheels = group("Wheels"),
  chassis = group("Frame"),
  panels = group("Body"),
  saddle = group("Seat"),
  battery = group("Battery"),
  lights = group("Headlight"),
  details = group("Details");
function mesh(g, n, geo, material, p = [0, 0, 0], r = [0, 0, 0]) {
  const m = new T.Mesh(geo, material);
  m.name = n;
  m.position.set(...p);
  m.rotation.set(...r);
  g.add(m);
  return m;
}
function box(g, n, p, s, m, r = [0, 0, 0]) {
  return mesh(g, n, new T.BoxGeometry(...s), m, p, r);
}
function cyl(g, n, a, b, r, m, r2 = r) {
  const av = new T.Vector3(...a),
    bv = new T.Vector3(...b);
  const o = mesh(
    g,
    n,
    new T.CylinderGeometry(r2, r, av.distanceTo(bv), 24),
    m,
    av.clone().add(bv).multiplyScalar(0.5).toArray(),
  );
  o.quaternion.setFromUnitVectors(
    new T.Vector3(0, 1, 0),
    bv.sub(av).normalize(),
  );
  return o;
}
function panel(g, n, points, depth, m) {
  const sh = new T.Shape();
  points.forEach(([x, y], i) => (i ? sh.lineTo(x, y) : sh.moveTo(x, y)));
  sh.closePath();
  const geo = new T.ExtrudeGeometry(sh, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.055,
    bevelSize: 0.055,
    bevelSegments: 3,
    steps: 1,
  });
  geo.translate(0, 0, -depth / 2);
  return mesh(g, n, geo, m);
}
for (const [x, label] of [
  [-1.34, "Rear"],
  [1.36, "Front"],
]) {
  mesh(
    wheels,
    `${label}_Tire`,
    new T.TorusGeometry(0.53, 0.155, 18, 80),
    rubber,
    [x, 0.69, 0],
  );
  mesh(
    wheels,
    `${label}_Rim`,
    new T.TorusGeometry(0.405, 0.047, 12, 64),
    graphite,
    [x, 0.69, 0],
  );
  for (const z of [-0.11, 0.11]) {
    mesh(
      wheels,
      `${label}_Rim_Lip`,
      new T.TorusGeometry(0.43, 0.012, 8, 64),
      silver,
      [x, 0.69, z],
    );
    mesh(wheels, `${label}_Brake`, new T.RingGeometry(0.24, 0.34, 64), silver, [
      x,
      0.69,
      z * 1.4,
    ]);
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5;
      const sp = box(
        wheels,
        `${label}_Spoke`,
        [x + Math.cos(a) * 0.24, 0.69 + Math.sin(a) * 0.24, z],
        [0.37, 0.032, 0.038],
        graphite,
      );
      sp.rotation.z = a + 0.22;
    }
  }
  cyl(wheels, `${label}_Axle`, [x, 0.69, -0.2], [x, 0.69, 0.2], 0.105, black);
  for (let i = 0; i < 48; i++) {
    const a = (i * Math.PI) / 24;
    const tread = box(
      wheels,
      `${label}_Tread`,
      [x + Math.cos(a) * 0.678, 0.69 + Math.sin(a) * 0.678, 0],
      [0.012, 0.015, 0.19],
      black,
    );
    tread.rotation.z = a;
  }
  box(
    details,
    `${label}_Caliper`,
    [x + 0.26, 0.77, 0.19],
    [0.12, 0.21, 0.07],
    gold,
    [0, 0, -0.3],
  );
}
// Sculpted battery enclosure, aluminum perimeter frame and floating tail.
panel(
  battery,
  "Battery_Core",
  [
    [-0.7, 0.66],
    [0.52, 0.66],
    [0.68, 1.27],
    [0.39, 1.5],
    [-0.5, 1.47],
    [-0.85, 1.1],
  ],
  0.48,
  black,
);
for (let i = 0; i < 15; i++)
  box(
    battery,
    "Battery_Cooling_Fin",
    [-0.58 + i * 0.073, 1.01, 0],
    [0.024, 0.51, 0.515],
    graphite,
  );
for (const z of [-0.34, 0.34]) {
  cyl(chassis, "Frame_Upper", [-0.89, 1.42, z], [0.71, 1.64, z], 0.065, silver);
  cyl(chassis, "Frame_Down", [0.71, 1.64, z], [0.36, 0.63, z], 0.064, graphite);
  cyl(
    chassis,
    "Frame_Lower",
    [-0.79, 0.66, z],
    [0.36, 0.63, z],
    0.06,
    graphite,
  );
  cyl(chassis, "Swingarm", [-1.34, 0.69, z], [-0.44, 0.83, z], 0.085, graphite);
  cyl(
    chassis,
    "Tail_Support",
    [-1.3, 1.64, z],
    [-0.57, 1.1, z],
    0.045,
    graphite,
  );
  cyl(details, "Front_Fork", [1.36, 0.69, z], [0.89, 1.8, z], 0.045, silver);
  cyl(details, "Fork_Sleeve", [1.15, 1.15, z], [0.89, 1.8, z], 0.064, black);
  cyl(
    details,
    "Footpeg",
    [-0.55, 0.8, z],
    [-0.55, 0.8, z * 1.5],
    0.033,
    silver,
  );
}
panel(
  panels,
  "Body_Tank",
  [
    [-0.72, 1.46],
    [-0.5, 1.76],
    [0.07, 1.95],
    [0.55, 1.83],
    [0.69, 1.59],
    [0.31, 1.44],
  ],
  0.55,
  body,
);
panel(
  panels,
  "Body_Tail",
  [
    [-1.64, 1.69],
    [-1.48, 1.85],
    [-0.73, 1.77],
    [-0.52, 1.55],
    [-1.18, 1.56],
  ],
  0.36,
  body,
);
panel(
  saddle,
  "Seat_Surface",
  [
    [-1.47, 1.83],
    [-1.25, 1.88],
    [-0.69, 1.8],
    [-0.45, 1.72],
    [-0.52, 1.65],
    [-1.36, 1.72],
  ],
  0.39,
  seat,
);
panel(
  panels,
  "Body_Belly",
  [
    [-0.74, 0.61],
    [0.4, 0.57],
    [0.6, 0.72],
    [-0.65, 0.77],
  ],
  0.43,
  body,
);
for (const x of [-1.34, 1.36]) {
  mesh(
    panels,
    "Body_Fender",
    new T.TorusGeometry(0.72, 0.035, 8, 48, Math.PI * 0.72),
    body,
    [x, 0.69, 0],
    [0, 0, 0.45],
  );
}
cyl(
  details,
  "Rear_Shock",
  [-1.04, 0.86, -0.02],
  [-0.62, 1.43, -0.02],
  0.065,
  gold,
);
for (let i = 0; i < 9; i++) {
  mesh(
    details,
    "Shock_Spring",
    new T.TorusGeometry(0.08, 0.016, 6, 18),
    silver,
    [-0.99 + i * 0.04, 0.95 + i * 0.05, -0.02],
    [Math.PI / 2, 0, -0.5],
  );
}
cyl(
  details,
  "Handlebar",
  [0.77, 1.96, -0.52],
  [0.77, 1.96, 0.52],
  0.029,
  black,
);
for (const z of [-0.49, 0.49]) {
  cyl(
    details,
    "Handle_Grip",
    [0.77, 1.96, z - 0.1],
    [0.77, 1.96, z + 0.1],
    0.043,
    rubber,
  );
  cyl(
    details,
    "Mirror_Arm",
    [0.76, 1.98, z],
    [0.66, 2.18, z * 1.25],
    0.012,
    black,
  );
  box(details, "Mirror", [0.65, 2.2, z * 1.25], [0.13, 0.07, 0.18], graphite);
}
box(
  details,
  "Dashboard",
  [0.71, 1.96, 0],
  [0.18, 0.025, 0.24],
  black,
  [0, 0, 0.2],
);
box(
  details,
  "Headlight_Housing",
  [1.04, 1.66, 0],
  [0.19, 0.24, 0.45],
  black,
  [0, 0, 0.2],
);
box(
  lights,
  "Headlight_Lens",
  [1.143, 1.68, 0],
  [0.014, 0.07, 0.37],
  light,
  [0, 0, 0.2],
);
box(
  lights,
  "Headlight_Lower",
  [1.16, 1.6, 0],
  [0.014, 0.025, 0.28],
  light,
  [0, 0, 0.2],
);
const red = mat("#c73722");
red.emissive = new T.Color("#ff2200");
red.emissiveIntensity = 1;
box(details, "Tail_Light", [-1.64, 1.73, 0], [0.02, 0.04, 0.28], red);
for (const z of [-0.4, 0.4])
  for (const x of [-0.65, 0.35]) {
    mesh(details, "Frame_Bolt", new T.SphereGeometry(0.025, 8, 8), silver, [
      x,
      1.43,
      z,
    ]);
  }
// Canonical replacement contract. Preserve mesh world transforms when introducing pivots.
bike.name = "Bike";
function regroup(name, source, predicate, pivot = [0, 0, 0]) {
  const g = group(name);
  g.position.set(...pivot);
  bike.updateMatrixWorld(true);
  for (const child of [...source.children])
    if (predicate(child.name)) g.attach(child);
  return g;
}
regroup("FrontWheel", wheels, (n) => n.startsWith("Front_"), [1.36, 0.69, 0]);
regroup("RearWheel", wheels, (n) => n.startsWith("Rear_"), [-1.34, 0.69, 0]);
regroup("TankCover", panels, (n) => n === "Body_Tank");
regroup(
  "FrontFairing",
  panels,
  (n) => n === "Body_Belly" || n === "Body_Fender",
);
regroup("RearFairing", panels, (n) => n === "Body_Tail");
regroup("FrontFork", details, (n) => n.includes("Fork"));
regroup("RearSuspension", details, (n) => n.includes("Shock"));
regroup("Brakes", details, (n) => n.includes("Caliper"));
regroup("TailLight", details, (n) => n === "Tail_Light");
regroup("Display", details, (n) => n === "Dashboard");
regroup(
  "Accessories",
  details,
  (n) => n.includes("Mirror") || n.includes("Grip"),
);
const motor = group("Motor");
cyl(
  motor,
  "Motor_Casing",
  [-0.65, 0.73, -0.25],
  [-0.65, 0.73, 0.25],
  0.21,
  graphite,
);
for (const z of [-0.26, 0.26])
  mesh(motor, "Motor_Endcap", new T.CircleGeometry(0.16, 32), silver, [
    -0.65,
    0.73,
    z,
  ]);
function batteryPart(name, predicate) {
  const g = new T.Group();
  g.name = name;
  battery.add(g);
  for (const child of [...battery.children])
    if (child !== g && predicate(child.name)) g.attach(child);
  return g;
}
batteryPart("BatteryHousing", (n) => n === "Battery_Core");
batteryPart("BatteryCooling", (n) => n.includes("Cooling_Fin"));
const modules = batteryPart("BatteryModules", () => false);
for (let i = 0; i < 4; i++)
  box(
    modules,
    "Energy_Module",
    [-0.45 + i * 0.26, 1.05, 0],
    [0.23, 0.4, 0.4],
    mat("#67745a", 0.6, 0.4),
  );
const controller = batteryPart("BatteryController", () => false);
box(controller, "Power_Controller", [0, 1.39, 0], [0.7, 0.1, 0.42], silver);
const display = bike.getObjectByName("Dashboard");
display.material = mat("#15211a", 0.1, 0.2);
display.material.emissive = new T.Color("#a4e8c4");
display.material.emissiveIntensity = 0.1;
const result = await new GLTFExporter().parseAsync(scene, { binary: true });
writeFileSync("public/models/volt-r1.glb", Buffer.from(result));
console.log(`Generated VOLT R1: ${(result.byteLength / 1024).toFixed(0)} KB`);
