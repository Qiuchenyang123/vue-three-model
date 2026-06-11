<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useThreeDeskScene } from '../composables/useThreeDeskScene'

const canvasHost = ref(null)
const isLoading = ref(true)
const loadError = ref('')
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
})

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
