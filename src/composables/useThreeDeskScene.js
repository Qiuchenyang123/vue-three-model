import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

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
const PHONE_MODEL_PATH = '/models/phone.glb'

const HOVERABLE_PATHS = [
	BOARD_PROJECT1_PATH,
	BOARD_PROJECT2_PATH,
	BOARD_PROJECT3_PATH,
	BOARD_PROJECT4_PATH,
	BOARD_PROJECT5_PATH,
	BOARD_PROJECT6_PATH,
	BOARD_PROJECT7_PATH,
	BOARD_PROJECT8_PATH,
	'/models/folder_pause.glb',
]

const FOLDER_PATHS = [
	'/models/Folder_project1.glb',
	'/models/Folder_project2.glb',
	'/models/Folder_project3.glb',
	'/models/Folder_project4.glb',
	'/models/Folder_project5.glb',
	'/models/Folder_project6.glb',
	'/models/Folder_project7.glb',
	'/models/Folder_project8.glb',
]

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
		position: new THREE.Vector3(-0.2, 1.01, -1.11),
		rotation: new THREE.Euler(0, 0.98, 0),
		anchor: 'bottom',
	},
	{
		path: '/models/CLIP.glb',
		targetSize: new THREE.Vector3(2.27, 0.6, 1.26),
		position: new THREE.Vector3(0.44, 1, 2.52),
		rotation: new THREE.Euler(0, 2.76, 0),
		anchor: 'bottom',
	},
	{
		path: '/models/folder_pause.glb',
		targetSize: new THREE.Vector3(3, 3, 3),
		position: new THREE.Vector3(0.3, 0.51, 0),
		rotation: new THREE.Euler(0, 1.62, 0),
		anchor: 'bottom',
	},
	{
		path: '/models/coffee.glb',
		targetSize: new THREE.Vector3(0.4, 0.4, 0.4),
		position: new THREE.Vector3(0.61, 1, -1.22),
		rotation: new THREE.Euler(0, -Math.PI / 2, 0),
		anchor: 'bottom',
	},
	{
		path: '/models/phone.glb',
		targetSize: new THREE.Vector3(1.21, 1.21, 1.21),
		position: new THREE.Vector3(-0.42, 1, 2.24),
		rotation: new THREE.Euler(0, 1.78, 0),
		anchor: 'bottom',
	},
	...FOLDER_PATHS.map((path) => ({
		path,
		targetSize: new THREE.Vector3(3, 3, 3),
		position: new THREE.Vector3(0.3, 0.49, 0),
		rotation: new THREE.Euler(0, 1.62, 0),
		anchor: 'bottom',
	})),
]

const folderCameraConfig = {
	position: {x: 0.47, y: 4.7, z: 0},
	target: {x: 0, y: -2.08, z: 0}
}

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

	let composer
	let outlinePass
	let raycaster
	let mouse
	let hoverableObjects = []

	let isAnimatingCamera = false
	let targetCameraPos = new THREE.Vector3()
	let targetControlsPos = new THREE.Vector3()
	let currentFolderIndex = null

	const mixers = []
	const clock = new THREE.Clock()

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
		if (composer) {
			composer.setSize(clientWidth, clientHeight)
		}
	}

	function onPointerMove(event) {
		if (!canvasContainer) return
		const rect = canvasContainer.getBoundingClientRect()
		mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
		mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
	}

	function onPointerDown(event) {
		if (!canvasContainer || !raycaster || !camera || hoverableObjects.length === 0) return

		raycaster.setFromCamera(mouse, camera)
		const intersects = raycaster.intersectObjects(hoverableObjects, true)

		if (intersects.length > 0) {
			let object = intersects[0].object
			let rootObject = null

			object.traverseAncestors((ancestor) => {
				if (hoverableObjects.includes(ancestor)) {
					rootObject = ancestor
				}
			})
			if (!rootObject && hoverableObjects.includes(object)) {
				rootObject = object
			}

			if (rootObject) {
				let clickedPath = null
				modelEntries.forEach((entry, path) => {
					if (entry.root === rootObject) clickedPath = path
				})

				if (clickedPath) {
					const match = clickedPath.match(/board_project(\d+)\.glb/)
					if (match) {
						const index = match[1]
						currentFolderIndex = index

						// Hide all folder projects
						FOLDER_PATHS.forEach((path) => {
							const entry = modelEntries.get(path)
							if (entry) entry.root.visible = false
						})

						// Show folder_pause model
						const folderPauseEntry = modelEntries.get('/models/folder_pause.glb')
						if (folderPauseEntry) {
							folderPauseEntry.root.visible = true

							// Play fall animation (0 to 24 frames)
							if (folderPauseEntry.mixer && folderPauseEntry.animations && folderPauseEntry.animations.length > 0) {
								const action = folderPauseEntry.mixer.clipAction(folderPauseEntry.animations[0])
								// Assuming 24 fps, 24 frames = 1 second
								action.time = 0
								action.setLoop(THREE.LoopOnce, 1)
								action.clampWhenFinished = true

								// Reset any previous state
								action.paused = false
								action.reset().play()

								folderPauseEntry.isFalling = true
							}

							// Set camera animation targets
							targetControlsPos.copy(new THREE.Vector3(folderCameraConfig.target.x, folderCameraConfig.target.y, folderCameraConfig.target.z))
							targetCameraPos.copy(new THREE.Vector3(folderCameraConfig.position.x, folderCameraConfig.position.y, folderCameraConfig.position.z))
							isAnimatingCamera = true
						}
					}

					// Click on folder_pause
					if (clickedPath === '/models/folder_pause.glb' && currentFolderIndex) {
						const folderPauseEntry = modelEntries.get('/models/folder_pause.glb')
						if (folderPauseEntry) {
							folderPauseEntry.root.visible = false
						}

						const folderPath = `/models/Folder_project${currentFolderIndex}.glb`
						const folderEntry = modelEntries.get(folderPath)

						if (folderEntry) {
							folderEntry.root.visible = true

							if (folderEntry.mixer && folderEntry.animations && folderEntry.animations.length > 0) {
								const action = folderEntry.mixer.clipAction(folderEntry.animations[0])
								// Start from frame 24 (1.0 second) and play to the end
								action.paused = false
								action.time = 1.0
								action.setLoop(THREE.LoopOnce, 1)
								action.clampWhenFinished = true
								action.play()
								folderEntry.isFalling = false
							}
						}
					}
				}
			}
		}
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
		controls.enablePan = true
		controls.minDistance = 0.8
		controls.maxDistance = 13
		controls.minPolarAngle = 0.1
		controls.maxPolarAngle = 3.38
		controls.target.copy(CAMERA_TARGET)

		controls.addEventListener('start', () => {
			isAnimatingCamera = false
		})

		// Post-processing
		composer = new EffectComposer(renderer)

		const renderPass = new RenderPass(scene, camera)
		composer.addPass(renderPass)

		outlinePass = new OutlinePass(new THREE.Vector2(container.clientWidth, container.clientHeight), scene, camera)
		outlinePass.edgeStrength = 4.0
		outlinePass.edgeGlow = 1.0
		outlinePass.edgeThickness = 2.0
		outlinePass.pulsePeriod = 0
		outlinePass.visibleEdgeColor.set('#ffffff')
		outlinePass.hiddenEdgeColor.set('#ffffff')
		composer.addPass(outlinePass)

		const outputPass = new OutputPass()
		composer.addPass(outputPass)

		raycaster = new THREE.Raycaster()
		mouse = new THREE.Vector2()

		addLights(scene)
		addEnvironment(scene)

		resizeObserver = new ResizeObserver(updateSize)
		resizeObserver.observe(container)
		window.addEventListener("resize", updateSize)
		container.addEventListener("pointermove", onPointerMove)
		container.addEventListener("pointerdown", onPointerDown)
		removeResizeListener = () => {
			window.removeEventListener("resize", updateSize)
			container.removeEventListener("pointermove", onPointerMove)
			container.removeEventListener("pointerdown", onPointerDown)
		}
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

		let action = null
		let prevTime = 0
		let prevMixerTime = 0
		let wasPlaying = false
		let wasPaused = false

		if (entry.mixer && entry.animations && entry.animations.length > 0) {
			action = entry.mixer.clipAction(entry.animations[0])
			wasPlaying = action.isRunning()
			wasPaused = action.paused
			prevTime = action.time
			prevMixerTime = entry.mixer.time

			// 快进到第 24 帧（1.0秒），使模型处于落地状态，从而计算准确的包围盒和落点
			action.paused = false
			action.play()
			entry.mixer.setTime(1.0)
		}

		fitModel(entry.root, entry.config)

		if (entry.mixer && action) {
			// 恢复动画原始状态
			if (!wasPlaying) {
				action.stop()
			}
			action.paused = wasPaused
			action.time = prevTime
			entry.mixer.setTime(prevMixerTime)
		}
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

	function createModelControls(folder, modelPath, ranges = {}, onChangeCallback = null) {
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

		const handleChange = onChangeCallback || (() => updateModelTransform(modelPath))

		const sizeFolder = folder.addFolder('Size')
		sizeFolder.add(config.targetSize, 'x', size.min, size.max, 0.01).name('width').onChange(handleChange)
		sizeFolder.add(config.targetSize, 'y', size.min, size.max, 0.01).name('height').onChange(handleChange)
		sizeFolder.add(config.targetSize, 'z', size.min, size.max, 0.01).name('depth').onChange(handleChange)
		sizeFolder.open()

		const positionFolder = folder.addFolder('Position')
		positionFolder.add(config.position, 'x', position.x[0], position.x[1], 0.01).name('x').onChange(handleChange)
		positionFolder.add(config.position, 'y', position.y[0], position.y[1], 0.01).name('y').onChange(handleChange)
		positionFolder.add(config.position, 'z', position.z[0], position.z[1], 0.01).name('z').onChange(handleChange)
		positionFolder.open()

		const rotationFolder = folder.addFolder('Rotation')
		rotationFolder.add(config.rotation, 'x', rotation.x[0], rotation.x[1], 0.01).name('x').onChange(handleChange)
		rotationFolder.add(config.rotation, 'y', rotation.y[0], rotation.y[1], 0.01).name('y').onChange(handleChange)
		rotationFolder.add(config.rotation, 'z', rotation.z[0], rotation.z[1], 0.01).name('z').onChange(handleChange)
	}

	function updateFolderTransforms() {
		const baseEntry = modelEntries.get(FOLDER_PATHS[0])
		if (!baseEntry) return

		FOLDER_PATHS.forEach(path => {
			const entry = modelEntries.get(path)
			if (entry) {
				entry.config.targetSize.copy(baseEntry.config.targetSize)
				entry.config.position.copy(baseEntry.config.position)
				entry.config.rotation.copy(baseEntry.config.rotation)
				updateModelTransform(path)
			}
		})
	}

	function createTransformGui() {
		if (!enableGui || gui) {
			return
		}

		gui = new GUI({ title: 'Scene Controls' })
		gui.domElement.style.zIndex = '30'

		const phoneFolder = gui.addFolder('Phone')
		createModelControls(phoneFolder, PHONE_MODEL_PATH, {
			size: { min: 0.01, max: 2 },
			position: { x: [-8, 8], y: [-2, 5], z: [-5, 5] },
			rotation: { x: [-Math.PI, Math.PI], y: [-Math.PI, Math.PI], z: [-Math.PI, Math.PI] },
		})
		phoneFolder.add({ print: () => logModelConfig(PHONE_MODEL_PATH) }, 'print').name('Copy phone config')
		phoneFolder.open()

		const folderProjectFolder = gui.addFolder('Folder Project')
		createModelControls(folderProjectFolder, FOLDER_PATHS[0], {
			size: { min: 0.01, max: 5 },
			position: { x: [-8, 8], y: [-2, 8], z: [-5, 5] },
			rotation: { x: [-Math.PI, Math.PI], y: [-Math.PI, Math.PI], z: [-Math.PI, Math.PI] },
		}, updateFolderTransforms)
		folderProjectFolder.add({ print: () => logModelConfig(FOLDER_PATHS[0]) }, 'print').name('Copy folder config')
		folderProjectFolder.open()

		const folderPauseFolder = gui.addFolder('Folder Pause')
		createModelControls(folderPauseFolder, '/models/folder_pause.glb', {
			size: { min: 0.01, max: 5 },
			position: { x: [-8, 8], y: [-2, 8], z: [-5, 5] },
			rotation: { x: [-Math.PI, Math.PI], y: [-Math.PI, Math.PI], z: [-Math.PI, Math.PI] },
		})
		folderPauseFolder.add({ print: () => logModelConfig('/models/folder_pause.glb') }, 'print').name('Copy folder pause config')
		folderPauseFolder.open()

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

				let mixer = null
				if (gltf.animations && gltf.animations.length > 0) {
					mixer = new THREE.AnimationMixer(root)
					mixers.push(mixer)
				}

				modelEntries.set(config.path, { root, config, mixer, animations: gltf.animations })

				// Use updateModelTransform instead of fitModel directly to handle animation bounding boxes correctly
				updateModelTransform(config.path)

				scene.add(root)

				if (HOVERABLE_PATHS.includes(config.path) || FOLDER_PATHS.includes(config.path)) {
					hoverableObjects.push(root)
				}

				if (FOLDER_PATHS.includes(config.path) || config.path === '/models/folder_pause.glb') {
					root.visible = false
				}
			}),
		)
	}

	function animate() {
		animationFrameId = window.requestAnimationFrame(animate)

		if (isAnimatingCamera) {
			camera.position.lerp(targetCameraPos, 0.05)
			controls.target.lerp(targetControlsPos, 0.05)

			if (camera.position.distanceTo(targetCameraPos) < 0.1 && controls.target.distanceTo(targetControlsPos) < 0.1) {
				isAnimatingCamera = false
			}
		}

		const delta = clock.getDelta()
		mixers.forEach((mixer) => {
			mixer.update(delta)
		})

		// Track animation progress to stop at frame 24
		modelEntries.forEach((entry) => {
			if (entry.isFalling && entry.mixer && entry.animations.length > 0) {
				const action = entry.mixer.clipAction(entry.animations[0])
				// Stop at 1 second (24 frames)
				if (action.time >= 1.0) {
					action.paused = true
					entry.isFalling = false
				}
			}
		})

		controls.update()
		emitCameraState()

		if (raycaster && mouse && camera && hoverableObjects.length > 0) {
			raycaster.setFromCamera(mouse, camera)
			const intersects = raycaster.intersectObjects(hoverableObjects, true)

			if (intersects.length > 0) {
				let object = intersects[0].object
				let rootObject = null

				object.traverseAncestors((ancestor) => {
					if (hoverableObjects.includes(ancestor)) {
						rootObject = ancestor
					}
				})

				if (!rootObject && hoverableObjects.includes(object)) {
					rootObject = object
				}

				if (rootObject) {
					outlinePass.selectedObjects = [rootObject]
				}
			} else {
				outlinePass.selectedObjects = []
			}
		}

		if (composer) {
			composer.render()
		} else {
			renderer.render(scene, camera)
		}
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
