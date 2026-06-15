import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const BOARD_MODEL_PATH = '/models/board_background.glb'
const CLIP_MODEL_PATH = '/models/CLIP.glb'
const LAMP_MODEL_PATH = '/models/lamp.glb'
const BOARD_PROJECT1_PATH = '/models/board_project1.glb'
const BOARD_PROJECT2_PATH = '/models/board_project2.glb'
const BOARD_PROJECT3_PATH = '/models/board_project3.glb'
const BOARD_PROJECT4_PATH = '/models/board_project4.glb'
const BOARD_PROJECT5_PATH = '/models/board_project5.glb'
const BOARD_PROJECT6_PATH = '/models/board_project6.glb'
const BOARD_PROJECT7_PATH = '/models/board_project7.glb'
const BOARD_PROJECT8_PATH = '/models/board_project8.glb'
const COFFEE_MODEL_PATH = '/models/coffee.glb'
const CAMERA_BASE_POSITION = new THREE.Vector3(7.12, 7.16, -0.06)
const CAMERA_TARGET = new THREE.Vector3(0, 0.7, 0)
const CAMERA_FORWARD_OFFSET = 1.25

const modelPlacements = [
	{
		path: '/models/board_background.glb',
		targetSize: new THREE.Vector3(3.88, 4.82, 5.6),
		position: new THREE.Vector3(-2.65, 2.43, 0.75),
		rotation: new THREE.Euler(0, 0, 0),
		anchor: 'center',
	},
	{
		path: '/models/board_project1.glb',
		targetSize: new THREE.Vector3(1.05, 1.6, 1),
		position: new THREE.Vector3(-2.69, 3.45, 3.19),
		rotation: new THREE.Euler(0, 0, 0),
		anchor: 'center',
	},
	{
		path: '/models/board_project2.glb',
		targetSize: new THREE.Vector3(1.05, 1.6, 2.8),
		position: new THREE.Vector3(-2.63, 0.93, 2.13),
		rotation: new THREE.Euler(0, 0, 0),
		anchor: 'center',
	},
	{
		path: '/models/board_project3.glb',
		targetSize: new THREE.Vector3(1.05, 1.6, 1.46),
		position: new THREE.Vector3(-2.67, 1.18, -0.14),
		rotation: new THREE.Euler(0, 0, 0),
		anchor: 'center',
	},
	{
		path: '/models/board_project4.glb',
		targetSize: new THREE.Vector3(1.05, 1.6, 1.09),
		position: new THREE.Vector3(-2.67, 1.63, -1.56),
		rotation: new THREE.Euler(0, 0, 0),
		anchor: 'center',
	},
	{
		path: '/models/board_project5.glb',
		targetSize: new THREE.Vector3(1.05, 1.6, 1.44),
		position: new THREE.Vector3(-2.66, 2.95, -1.89),
		rotation: new THREE.Euler(0, 0, 0),
		anchor: 'center',
	},
	{
		path: '/models/board_project6.glb',
		targetSize: new THREE.Vector3(1.05, 1.6, 1.99),
		position: new THREE.Vector3(-2.68, 3.6, 0.15),
		rotation: new THREE.Euler(0, 0, 0.03),
		anchor: 'center',
	},
	{
		path: '/models/board_project7.glb',
		targetSize: new THREE.Vector3(1.05, 1.6, 1.08),
		position: new THREE.Vector3(-2.66, 2.49, -0.18),
		rotation: new THREE.Euler(0, 0, 0.01),
		anchor: 'center',
	},
	{
		path: '/models/board_project8.glb',
		targetSize: new THREE.Vector3(1.05, 1.6, 1.36),
		position: new THREE.Vector3(-2.62, 2.29, 1.71),
		rotation: new THREE.Euler(0, 0, -0.01),
		anchor: 'center',
	},
	{
		path: '/models/antique_desk.glb',
		targetSize: new THREE.Vector3(8.4, 3.4, 5.2),
		position: new THREE.Vector3(0, -1.65, 0.65),
		rotation: new THREE.Euler(0, Math.PI / 2, 0),
		anchor: 'bottom',
	},
	{
		path: '/models/lamp.glb',
		targetSize: new THREE.Vector3(1.2, 2.7, 2.3),
		position: new THREE.Vector3(0.03, 1.01, -1.11),
		rotation: new THREE.Euler(0, 0.98, 0),
		anchor: 'bottom',
	},
	{
		path: '/models/CLIP.glb',
		targetSize: new THREE.Vector3(2.27, 0.6, 1.26),
		position: new THREE.Vector3(0.24, 1, 2.46),
		rotation: new THREE.Euler(0, 2.46, 0),
		anchor: 'bottom',
	},
	{
		path: '/models/folder_pause.glb',
		targetSize: new THREE.Vector3(1.05, 0.45, 0.85),
		position: new THREE.Vector3(0, 0.86, 0),
		rotation: new THREE.Euler(0, 0.15, 0),
		anchor: 'bottom',
	},
	{
		path: '/models/coffee.glb',
		targetSize: new THREE.Vector3(0.4, 0.4, 0.4),
		position: new THREE.Vector3(1.5, 0.9, 1.5),
		rotation: new THREE.Euler(0, 0, 0),
		anchor: 'bottom',
	},
]

export function useThreeDeskScene(options = {}) {
	const { enableGui = import.meta.env.DEV, onCameraChange } = options

	let renderer
	let scene
	let camera
	let controls
	let resizeObserver
	let animationFrameId = 0
	let canvasContainer = null
	let removeResizeListener = null
	let gui = null

	const disposables = new Set()
	const modelEntries = new Map()
	const cameraDirection = new THREE.Vector3()

	function getInitialCameraPosition() {
		return CAMERA_BASE_POSITION.clone().lerp(CAMERA_TARGET, CAMERA_FORWARD_OFFSET / CAMERA_BASE_POSITION.distanceTo(CAMERA_TARGET))
	}

	function registerDisposable(resource) {
		if (resource?.dispose) {
			disposables.add(resource)
		}
	}

	function trackMaterial(material) {
		registerDisposable(material)
		registerDisposable(material?.map)
	}

	function updateSize() {
		if (!canvasContainer || !renderer || !camera) {
			return
		}

		const { clientWidth, clientHeight } = canvasContainer

		if (!clientWidth || !clientHeight) {
			return
		}

		camera.aspect = clientWidth / clientHeight
		camera.updateProjectionMatrix()
		renderer.setSize(clientWidth, clientHeight)
	}

	function createScene(container) {
		canvasContainer = container

		scene = new THREE.Scene()
		scene.background = new THREE.Color('#040303')
		scene.fog = new THREE.Fog('#040303', 11, 20)

		camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
		camera.position.copy(getInitialCameraPosition())

		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
		})
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		renderer.setSize(container.clientWidth, container.clientHeight)
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = THREE.PCFSoftShadowMap
		renderer.toneMapping = THREE.ACESFilmicToneMapping
		renderer.toneMappingExposure = 1.35
		renderer.outputColorSpace = THREE.SRGBColorSpace

		container.appendChild(renderer.domElement)

		controls = new OrbitControls(camera, renderer.domElement)
		controls.enableDamping = true
		controls.enablePan = false
		controls.minDistance = 0.8
		controls.maxDistance = 13
		controls.minPolarAngle = 0.1
		controls.maxPolarAngle = 3.38
		controls.target.copy(CAMERA_TARGET)

		addLights(scene)
		addEnvironment(scene)

		resizeObserver = new ResizeObserver(updateSize)
		resizeObserver.observe(container)
		window.addEventListener("resize", updateSize)
		removeResizeListener = () => window.removeEventListener("resize", updateSize)
		emitCameraState()
	}

	function addLights(targetScene) {
		const ambientLight = new THREE.AmbientLight('#9a7a50', 1.4)
		targetScene.add(ambientLight)

		const hemisphereLight = new THREE.HemisphereLight('#d6e2ff', '#160d08', 1.35)
		hemisphereLight.position.set(0, 8, 0)
		targetScene.add(hemisphereLight)

		const boardFill = new THREE.SpotLight('#dba15c', 90, 18, Math.PI / 5, 0.55, 1.2)
		boardFill.position.set(-4.2, 5.1, 2.8)
		boardFill.target.position.set(-1.8, 1.9, -2.8)
		targetScene.add(boardFill, boardFill.target)

		const lampGlow = new THREE.PointLight('#ffcf74', 24, 7, 1.9)
		lampGlow.position.set(0.2, 2.56, -0.98)
		lampGlow.castShadow = false
		targetScene.add(lampGlow)

		const deskLight = new THREE.SpotLight('#ffd67c', 120, 12, Math.PI / 6.8, 0.7, 1.6)
		deskLight.position.set(0.28, 2.72, -0.92)
		deskLight.target.position.set(-0.15, 1.04, -1.92)
		deskLight.castShadow = true
		deskLight.shadow.mapSize.set(1024, 1024)
		deskLight.shadow.bias = -0.0002
		deskLight.shadow.normalBias = 0.02
		deskLight.shadow.radius = 8
		targetScene.add(deskLight, deskLight.target)

		const rimLight = new THREE.DirectionalLight('#75a3ff', 1.6)
		rimLight.position.set(-5, 3.5, -3)
		targetScene.add(rimLight)
	}

	function addEnvironment(targetScene) {
		const backWall = new THREE.Mesh(
			new THREE.PlaneGeometry(18, 11),
			new THREE.MeshStandardMaterial({
				color: '#0b0908',
				roughness: 0.95,
				metalness: 0,
			}),
		)
		backWall.position.set(0, 2.1, -4.7)
		targetScene.add(backWall)
		registerDisposable(backWall.geometry)
		trackMaterial(backWall.material)

		const deskShadow = new THREE.Mesh(
			new THREE.PlaneGeometry(16, 10),
			new THREE.ShadowMaterial({ color: '#000000', opacity: 0.28 }),
		)
		deskShadow.rotation.x = -Math.PI / 2
		deskShadow.position.set(0, -0.98, 0.4)
		deskShadow.receiveShadow = true
		targetScene.add(deskShadow)
		registerDisposable(deskShadow.geometry)
		trackMaterial(deskShadow.material)

		const lightCone = new THREE.Mesh(
			new THREE.CircleGeometry(2.4, 64),
			new THREE.MeshBasicMaterial({
				color: '#f0b23f',
				transparent: true,
				opacity: 0.12,
				blending: THREE.AdditiveBlending,
				depthWrite: false,
			}),
		)
		lightCone.rotation.x = -Math.PI / 2
		lightCone.position.set(0.05, -0.94, -1.12)
		targetScene.add(lightCone)
		registerDisposable(lightCone.geometry)
		trackMaterial(lightCone.material)
	}

	function fitModel(model, config) {
		model.position.set(0, 0, 0)
		model.scale.set(1, 1, 1)
		model.rotation.copy(config.rotation)
		model.updateMatrixWorld(true)

		const initialBox = new THREE.Box3().setFromObject(model)
		const initialSize = initialBox.getSize(new THREE.Vector3())
		const safeSize = ['x', 'y', 'z'].map((axis) => Math.max(initialSize[axis], 0.001))
		const scale = Math.min(
			config.targetSize.x / safeSize[0],
			config.targetSize.y / safeSize[1],
			config.targetSize.z / safeSize[2],
		)

		model.scale.setScalar(scale)
		model.updateMatrixWorld(true)

		const scaledBox = new THREE.Box3().setFromObject(model)
		const scaledCenter = scaledBox.getCenter(new THREE.Vector3())

		model.position.x += config.position.x - scaledCenter.x
		model.position.z += config.position.z - scaledCenter.z

		if (config.anchor === 'bottom') {
			model.position.y += config.position.y - scaledBox.min.y
			return
		}

		model.position.y += config.position.y - scaledCenter.y
	}

	function updateModelTransform(modelPath) {
		const entry = modelEntries.get(modelPath)

		if (!entry) {
			return
		}

		fitModel(entry.root, entry.config)
	}

	function emitCameraState() {
		if (!camera || !controls || !onCameraChange) {
			return
		}

		camera.getWorldDirection(cameraDirection)

		onCameraChange({
			position: {
				x: Number(camera.position.x.toFixed(2)),
				y: Number(camera.position.y.toFixed(2)),
				z: Number(camera.position.z.toFixed(2)),
			},
			rotation: {
				x: Number(camera.rotation.x.toFixed(2)),
				y: Number(camera.rotation.y.toFixed(2)),
				z: Number(camera.rotation.z.toFixed(2)),
			},
			target: {
				x: Number(controls.target.x.toFixed(2)),
				y: Number(controls.target.y.toFixed(2)),
				z: Number(controls.target.z.toFixed(2)),
			},
			direction: {
				x: Number(cameraDirection.x.toFixed(2)),
				y: Number(cameraDirection.y.toFixed(2)),
				z: Number(cameraDirection.z.toFixed(2)),
			},
		})
	}

	function formatVector3(vector) {
		return `new THREE.Vector3(${vector.x.toFixed(2)}, ${vector.y.toFixed(2)}, ${vector.z.toFixed(2)})`
	}

	function formatEuler(euler) {
		return `new THREE.Euler(${euler.x.toFixed(2)}, ${euler.y.toFixed(2)}, ${euler.z.toFixed(2)})`
	}

	function logModelConfig(modelPath) {
		const entry = modelEntries.get(modelPath)

		if (!entry) {
			return
		}

		const { config } = entry
		const modelName = modelPath.split('/').pop()

		console.log(
			[
				`${modelName} config:`,
				`{`,
				`  path: '${config.path}',`,
				`  targetSize: ${formatVector3(config.targetSize)},`,
				`  position: ${formatVector3(config.position)},`,
				`  rotation: ${formatEuler(config.rotation)},`,
				`  anchor: '${config.anchor}',`,
				`},`,
			].join('\n'),
		)
	}

	function createModelControls(folder, modelPath, ranges = {}) {
		const entry = modelEntries.get(modelPath)

		if (!entry) {
			return
		}

		const { config } = entry
		const {
			size = { min: 0.1, max: 10 },
			position = { x: [-10, 10], y: [-10, 10], z: [-10, 10] },
			rotation = { x: [-Math.PI, Math.PI], y: [-Math.PI, Math.PI], z: [-Math.PI, Math.PI] },
		} = ranges

		const sizeFolder = folder.addFolder('Size')
		sizeFolder.add(config.targetSize, 'x', size.min, size.max, 0.01).name('width').onChange(() => updateModelTransform(modelPath))
		sizeFolder.add(config.targetSize, 'y', size.min, size.max, 0.01).name('height').onChange(() => updateModelTransform(modelPath))
		sizeFolder.add(config.targetSize, 'z', size.min, size.max, 0.01).name('depth').onChange(() => updateModelTransform(modelPath))
		sizeFolder.open()

		const positionFolder = folder.addFolder('Position')
		positionFolder.add(config.position, 'x', position.x[0], position.x[1], 0.01).name('x').onChange(() => updateModelTransform(modelPath))
		positionFolder.add(config.position, 'y', position.y[0], position.y[1], 0.01).name('y').onChange(() => updateModelTransform(modelPath))
		positionFolder.add(config.position, 'z', position.z[0], position.z[1], 0.01).name('z').onChange(() => updateModelTransform(modelPath))
		positionFolder.open()

		const rotationFolder = folder.addFolder('Rotation')
		rotationFolder.add(config.rotation, 'x', rotation.x[0], rotation.x[1], 0.01).name('x').onChange(() => updateModelTransform(modelPath))
		rotationFolder.add(config.rotation, 'y', rotation.y[0], rotation.y[1], 0.01).name('y').onChange(() => updateModelTransform(modelPath))
		rotationFolder.add(config.rotation, 'z', rotation.z[0], rotation.z[1], 0.01).name('z').onChange(() => updateModelTransform(modelPath))
	}

	function createTransformGui() {
		if (!enableGui || gui) {
			return
		}

		gui = new GUI({ title: 'Scene Controls' })
		gui.domElement.style.zIndex = '30'

		const coffeeFolder = gui.addFolder('Coffee')
		createModelControls(coffeeFolder, COFFEE_MODEL_PATH, {
			size: { min: 0.01, max: 5 },
			position: { x: [-8, 8], y: [-2, 5], z: [-5, 5] },
			rotation: { x: [-Math.PI, Math.PI], y: [-Math.PI, Math.PI], z: [-Math.PI, Math.PI] },
		})
		coffeeFolder.add({ print: () => logModelConfig(COFFEE_MODEL_PATH) }, 'print').name('Copy coffee config')
		coffeeFolder.open()

		const cameraFolder = gui.addFolder('Camera')
		cameraFolder.add(camera.position, 'x', -20, 20, 0.01).name('position.x').onChange(() => controls.update())
		cameraFolder.add(camera.position, 'y', -20, 20, 0.01).name('position.y').onChange(() => controls.update())
		cameraFolder.add(camera.position, 'z', -20, 20, 0.01).name('position.z').onChange(() => controls.update())
		cameraFolder.add(controls.target, 'x', -20, 20, 0.01).name('target.x').onChange(() => controls.update())
		cameraFolder.add(controls.target, 'y', -20, 20, 0.01).name('target.y').onChange(() => controls.update())
		cameraFolder.add(controls.target, 'z', -20, 20, 0.01).name('target.z').onChange(() => controls.update())
		cameraFolder.add({ print: () => {
				console.log(`Camera position: new THREE.Vector3(${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)})`)
				console.log(`Camera target: new THREE.Vector3(${controls.target.x.toFixed(2)}, ${controls.target.y.toFixed(2)}, ${controls.target.z.toFixed(2)})`)
			}}, 'print').name('Copy camera config')
		cameraFolder.open()
	}

	async function loadModels() {
		const loader = new GLTFLoader()

		await Promise.all(
			modelPlacements.map(async (config) => {
				const gltf = await loader.loadAsync(config.path)
				const root = gltf.scene

				root.traverse((child) => {
					if (!child.isMesh) {
						return
					}

					child.castShadow = true
					child.receiveShadow = true

					registerDisposable(child.geometry)

					if (Array.isArray(child.material)) {
						child.material.forEach(trackMaterial)
						return
					}

					trackMaterial(child.material)
				})

				fitModel(root, config)
				modelEntries.set(config.path, { root, config })
				scene.add(root)
			}),
		)
	}

	function animate() {
		animationFrameId = window.requestAnimationFrame(animate)
		controls.update()
		emitCameraState()
		renderer.render(scene, camera)
	}

	async function mount(container) {
		createScene(container)
		await loadModels()
		createTransformGui()
		animate()
	}

	function dispose() {
		window.cancelAnimationFrame(animationFrameId)
		resizeObserver?.disconnect()
		removeResizeListener?.()
		controls?.dispose()
		renderer?.dispose()
		gui?.destroy()
		gui = null
		modelEntries.clear()

		for (const resource of disposables) {
			resource.dispose()
		}

		if (renderer?.domElement?.parentNode) {
			renderer.domElement.parentNode.removeChild(renderer.domElement)
		}
	}

	return {
		mount,
		dispose,
	}
}
