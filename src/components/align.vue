<!--
 * @Author: Qin Shaowei
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: Qin Shaowei
 * @LastEditTime: 2023-07-16 12:15:26
 * @Description: Alignment of combination elements
-->

<template>
  <div v-if="mixinState.mSelectMode === 'multiple'" class="box attr-item">
    <!-- Horizontal alignment -->
    <Tooltip :content="$t('group_align.left')">
      <Button :disabled="notMultiple" @click="left" size="small" type="text">
        <!-- SVG for left alignment -->
      </Button>
    </Tooltip>
    <Tooltip :content="$t('group_align.centerX')">
      <Button :disabled="notMultiple" @click="xcenter" size="small" type="text">
        <!-- SVG for center-X alignment -->
      </Button>
    </Tooltip>
    <Tooltip :content="$t('group_align.right')">
      <Button :disabled="notMultiple" @click="right" size="small" type="text">
        <!-- SVG for right alignment -->
      </Button>
    </Tooltip>
    <!-- Vertical alignment -->
    <Tooltip :content="$t('group_align.top')">
      <Button :disabled="notMultiple" @click="top" size="small" type="text">
        <!-- SVG for top alignment -->
      </Button>
    </Tooltip>
    <Tooltip :content="$t('group_align.centerY')">
      <Button :disabled="notMultiple" @click="ycenter" size="small" type="text">
        <!-- SVG for center-Y alignment -->
      </Button>
    </Tooltip>
    <Tooltip :content="$t('group_align.bottom')">
      <Button :disabled="notMultiple" @click="bottom" size="small" type="text">
        <!-- SVG for bottom alignment -->
      </Button>
    </Tooltip>
    <!-- Average alignment -->
    <Tooltip :content="$t('group_align.averageX')">
      <Button :disabled="notMultiple" @click="xequation" size="small" type="text">
        <!-- SVG for average-X alignment -->
      </Button>
    </Tooltip>
    <Tooltip :content="$t('group_align.averageY')">
      <Button :disabled="notMultiple" @click="yequation" size="small" type="text">
        <!-- SVG for average-Y alignment -->
      </Button>
    </Tooltip>
  </div>
</template>

<script setup name="Align">
import useSelect from '@/hooks/select';

const { mixinState, canvasEditor } = useSelect();
// Disable combination alignment when not in multiple select mode
const notMultiple = computed(() => mixinState.mSelectMode !== 'multiple');

// Left alignment
const left = () => {
  canvasEditor.left();
};
// Right alignment
const right = () => {
  canvasEditor.right();
};
// Horizontal center alignment
const xcenter = () => {
  canvasEditor.xcenter();
};
// Vertical center alignment
const ycenter = () => {
  canvasEditor.ycenter();
};
// Top alignment
const top = () => {
  canvasEditor.top();
};
// Bottom alignment
const bottom = () => {
  canvasEditor.bottom();
};
// Horizontal average alignment
const xequation = () => {
  canvasEditor.xequation();
};
// Vertical average alignment
const yequation = () => {
  canvasEditor.yequation();
};
</script>

<style scoped lang="less">
.box {
  display: flex;
  align-items: center;
  .ivu-tooltip {
    text-align: center;
    flex: 1;
  }
}
:deep(.ivu-btn) {
  &[disabled] {
    svg {
      opacity: 0.2;
    }
  }
}
</style>
