<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useThreeDeskScene } from '../composables/useThreeDeskScene'

const canvasHost = ref(null)
const isLoading = ref(true)
const loadError = ref('')
const uiState = ref('desk')
const cameraInfo = ref({
	position: { x: 0, y: 0, z: 0 },
	rotation: { x: 0, y: 0, z: 0 },
	target: { x: 0, y: 0, z: 0 },
	direction: { x: 0, y: 0, z: 0 },
})

const deskScene = useThreeDeskScene({
	onCameraChange: (nextCameraInfo) => {
		cameraInfo.value = nextCameraInfo
	},
	onStateChange: (state) => {
		uiState.value = state
	}
})

function handleViewProject() {
	console.log('Navigate to project details...')
	// TODO: router.push('/project')
}

onMounted(async () => {
	if (!canvasHost.value) {
		return
	}

	try {
		await deskScene.mount(canvasHost.value)
		isLoading.value = false
	} catch (error) {
		console.error(error)
		loadError.value = '模型加载失败，请检查 public/models 下的 glb 文件是否完整。'
		isLoading.value = false
	}
})

onBeforeUnmount(() => {
	deskScene.dispose()
})
</script>

<template>
	<section class="three-model-view">
		<div ref="canvasHost" class="canvas-host"></div>

		<div class="overlay vignette"></div>
		<div class="overlay highlights"></div>

		<div class="camera-panel">
			<p class="panel-title">Camera</p>
			<p>pos: {{ cameraInfo.position.x }}, {{ cameraInfo.position.y }}, {{ cameraInfo.position.z }}</p>
			<p>rot: {{ cameraInfo.rotation.x }}, {{ cameraInfo.rotation.y }}, {{ cameraInfo.rotation.z }}</p>
			<p>target: {{ cameraInfo.target.x }}, {{ cameraInfo.target.y }}, {{ cameraInfo.target.z }}</p>
			<p>dir: {{ cameraInfo.direction.x }}, {{ cameraInfo.direction.y }}, {{ cameraInfo.direction.z }}</p>
		</div>

		<div v-if="isLoading" class="status-card">正在加载模型...</div>
		<div v-else-if="loadError" class="status-card error">{{ loadError }}</div>

		<div class="action-buttons" v-if="uiState === 'folder_closed' || uiState === 'folder_open'">
			<button v-if="uiState === 'folder_closed'" class="icon-btn" @click="deskScene.returnToDesk()" title="返回桌面">
				<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
			</button>
			
			<template v-if="uiState === 'folder_open'">
				<button class="icon-btn" @click="deskScene.closeFolder()" title="关闭文件夹">
					<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
				</button>
				<button class="icon-btn eye-btn" @click="handleViewProject" title="查看项目详情">
					<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
				</button>
			</template>
		</div>
	</section>
</template>

<style scoped>
.three-model-view {
	position: relative;
	width: 100%;
	min-height: 100vh;
	overflow: hidden;
	background:
		radial-gradient(circle at 82% 24%, rgba(255, 202, 98, 0.2), transparent 18%),
		radial-gradient(circle at 12% 16%, rgba(104, 141, 255, 0.08), transparent 22%),
		linear-gradient(180deg, #050404 0%, #090604 42%, #120907 100%);
}

.canvas-host {
	position: absolute;
	inset: 0;
}

.overlay {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.vignette {
	background:
		radial-gradient(circle at center, transparent 48%, rgba(0, 0, 0, 0.28) 75%, rgba(0, 0, 0, 0.75) 100%),
		linear-gradient(180deg, rgba(0, 0, 0, 0.18), transparent 28%, transparent 72%, rgba(0, 0, 0, 0.24));
}

.highlights {
	background:
		radial-gradient(circle at 83% 30%, rgba(255, 210, 110, 0.13), transparent 14%),
		radial-gradient(circle at 27% 33%, rgba(255, 119, 72, 0.06), transparent 12%);
}

.camera-panel {
	position: absolute;
	top: 20px;
	left: 20px;
	z-index: 2;
	min-width: 270px;
	padding: 12px 14px;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 14px;
	background: rgba(6, 6, 8, 0.6);
	color: rgba(241, 229, 212, 0.88);
	font-size: 12px;
	line-height: 1.65;
	backdrop-filter: blur(12px);
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
}

.camera-panel p {
	margin: 0;
}

.panel-title {
	margin-bottom: 6px !important;
	color: rgba(255, 204, 129, 0.9);
	font-size: 11px;
	letter-spacing: 0.22em;
	text-transform: uppercase;
}

.hud {
	position: absolute;
	top: 32px;
	left: 32px;
	z-index: 2;
	max-width: 360px;
	padding: 20px 22px;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 18px;
	background: rgba(5, 5, 6, 0.45);
	backdrop-filter: blur(12px);
	box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
}

.eyebrow {
	margin-bottom: 10px;
	color: rgba(255, 204, 129, 0.86);
	font-size: 12px;
	letter-spacing: 0.32em;
}

.hud h1 {
	margin: 0;
	color: #f7ead8;
	font-size: clamp(28px, 4vw, 46px);
	font-weight: 700;
	line-height: 1.05;
}

.description {
	margin-top: 12px;
	color: rgba(239, 226, 211, 0.82);
	font-size: 14px;
	line-height: 1.7;
}

.status-card {
	position: absolute;
	right: 28px;
	bottom: 28px;
	z-index: 2;
	padding: 10px 16px;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 999px;
	background: rgba(10, 10, 10, 0.65);
	color: #f3dcc0;
	font-size: 13px;
	letter-spacing: 0.04em;
	backdrop-filter: blur(8px);
}

.error {
	color: #ffb3aa;
}

.action-buttons {
	position: absolute;
	bottom: 48px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	gap: 24px;
	z-index: 20;
}

.icon-btn {
	width: 54px;
	height: 54px;
	border-radius: 50%;
	background: rgba(10, 10, 10, 0.65);
	border: 1px solid rgba(255, 255, 255, 0.15);
	color: rgba(255, 255, 255, 0.85);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	backdrop-filter: blur(12px);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.icon-btn:hover {
	background: rgba(30, 30, 30, 0.8);
	color: #fff;
	transform: scale(1.1) translateY(-2px);
	border-color: rgba(255, 255, 255, 0.3);
}

.icon-btn:active {
	transform: scale(0.95);
}

.eye-btn {
	background: rgba(74, 144, 226, 0.45);
	border-color: rgba(74, 144, 226, 0.3);
}

.eye-btn:hover {
	background: rgba(74, 144, 226, 0.7);
	border-color: rgba(74, 144, 226, 0.6);
	box-shadow: 0 8px 24px rgba(74, 144, 226, 0.3);
}

@media (max-width: 768px) {
	.camera-panel {
		top: 14px;
		left: 14px;
		min-width: 0;
		max-width: calc(100vw - 110px);
		padding: 10px 12px;
		font-size: 11px;
	}

	.hud {
		top: 18px;
		left: 18px;
		right: 18px;
		max-width: none;
		padding: 16px 18px;
	}

	.status-card {
		right: 18px;
		bottom: 18px;
	}
}
</style>
