
<template>
  <Tooltip :content="$t('Lock')" v-if="mixinState.mSelectMode === 'one'">
    <Button v-if="isLock" @click="doLock(false)" icon="md-lock" type="text"></Button>
    <Button v-else @click="doLock(true)" icon="md-unlock" type="text"></Button>
  </Tooltip>
</template>

<script setup name="Lock">
import useSelect from '@/hooks/select';
import { onBeforeUnmount, onMounted } from 'vue';

const event = inject('event');
const { mixinState, canvasEditor } = useSelect();
const lockAttrs = [
  'lockMovementX',
  'lockMovementY',
  'lockRotation',
  'lockScalingX',
  'lockScalingY',
];
const isLock = ref(false);
const lock = () => {
  // Modify custom properties
  mixinState.mSelectActive.hasControls = false;
  // Modify default properties
  lockAttrs.forEach((key) => {
    mixinState.mSelectActive[key] = true;
  });

  mixinState.mSelectActive.selectable = false;

  isLock.value = true;
  canvasEditor.canvas.renderAll();
};
const unLock = () => {
  // Modify custom properties

  mixinState.mSelectActive.hasControls = true;
  // Modify default properties
  lockAttrs.forEach((key) => {
    mixinState.mSelectActive[key] = false;
  });
  mixinState.mSelectActive.selectable = true;

  isLock.value = false;
  canvasEditor.canvas.renderAll();
};

const doLock = (isLock) => {
  isLock ? lock() : unLock();
};

const handleSelected = (items) => {
  isLock.value = !items[0].hasControls;
  // eslint-disable-next-line prefer-destructuring
  mixinState.mSelectActive = items[0];
};

onMounted(() => {
  event.on('selectOne', handleSelected);
});

onBeforeUnmount(() => {
  event.off('selectOne', handleSelected);
});
</script>

<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}</style>
