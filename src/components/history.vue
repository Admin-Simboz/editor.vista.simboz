

<template>
  <div style="display: inline-block">
    <!-- Back -->
    <Tooltip :content="$t('history.revocation') + `(${undoStack.length})`">
      <Button @click="undo" type="text" size="small" :disabled="undoStack.length === 0">
        <Icon type="ios-undo" size="20" />
      </Button>
    </Tooltip>

    <!-- Redo -->
    <Tooltip :content="$t('history.redo') + `(${redoStack.length})`">
      <Button @click="redo" type="text" size="small" :disabled="redoStack.length === 0">
        <Icon type="ios-redo" size="20" />
      </Button>
    </Tooltip>

    <span class="time" v-if="history.length">
      {{ useDateFormat(history[0].timestamp, 'HH:mm:ss').value }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import useSelect from '@/hooks/select';
const { canvasEditor } = useSelect();
const { history, redoStack, undoStack } = reactive(canvasEditor.getHistory());

// Back
const undo = () => {
  canvasEditor.undo();
};
// Redo
const redo = () => {
  canvasEditor.redo();
};
</script>

<style scoped lang="less">
span.active {
  svg.icon {
    fill: #2d8cf0;
  }
}

.time {
  color: #c1c1c1;
}
</style>

<script lang="ts">
export default {
  name: 'ToolBar',
};
</script>
