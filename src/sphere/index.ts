import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  IcosahedronGeometry,
  MeshStandardMaterial,
  Mesh,
  HemisphereLight,
  MeshBasicMaterial,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function setupCamera(width: number, height: number) {
  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;
  return camera;
}

function createPrimitive() {
  const geometry = new IcosahedronGeometry(1.0, 2);

  const material = new MeshStandardMaterial({ color: 0xfcfcfc, flatShading: true });
  const shape = new Mesh(geometry, material);

  const wireMaterial = new MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  const wire = new Mesh(geometry, wireMaterial);
  shape.add(wire);
  shape.scale.set(1.5, 1.5, 1.5);
  return { mesh: shape };
}

function createLight() {
  const hemisphereLight = new HemisphereLight(0x0099ff, 0xffff00, 2);
  return { hemisphereLight };
}

function createControls(camera: PerspectiveCamera, renderer: WebGLRenderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.03;
  return controls;
}

function createScene(target: HTMLElement) {
  const { clientWidth: width, clientHeight: height } = target;
  const renderer = new WebGLRenderer({ antialias: true });
  const scene = new Scene();
  const camera = setupCamera(width, height);
  const primitive = createPrimitive();
  const light = createLight();
  const controls = createControls(camera, renderer);

  renderer.setSize(width, height);
  scene.add(primitive.mesh);
  scene.add(light.hemisphereLight);
  renderer.render(scene, camera);

  target.appendChild(renderer.domElement);

  return { renderer, scene, camera, primitive, controls };
}

export function startScene(target: HTMLElement) {
  const { renderer, scene, camera, primitive, controls } = createScene(target);

  const animate = (t = 0) => {
    primitive.mesh.rotation.y = t * 0.0001;
    renderer.render(scene, camera);
    controls.update();
    return requestAnimationFrame(animate);
  };

  return animate();
}
