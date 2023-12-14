<template>
  <div>
    <Divider plain orientation="left">{{ $t('common_elements') }}</Divider>
    <div class="tool-box">
      <span @click="() => addText()" :draggable="true" @dragend="onDragend('text')">
        <svg t="1650875455324" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="5401" width="26" height="26">
          <path
            d="M213.333333 209.92v128h85.333334v-42.666667h170.666666v433.493334H384.853333v85.333333h256v-85.333333H554.666667V295.253333h170.666666v42.666667h85.333334v-128H213.333333z"
            p-id="5402"></path>
        </svg>
      </span>

      <span @click="() => addRect()" :draggable="true" @dragend="onDragend('rect')">
        <svg t="1650855811131" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="18499" width="26" height="26">
          <path
            d="M864 896H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h704a32 32 0 0 1 32 32v704a32 32 0 0 1-32 32zM192 832h640V192H192v640z"
            p-id="18500"></path>
        </svg>
      </span>
      <span @click="() => addCircle()" :draggable="true" @dragend="onDragend('circle')">
        <svg t="1650855860236" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="19440" width="26" height="26">
          <path
            d="M512 928C282.624 928 96 741.376 96 512S282.624 96 512 96s416 186.624 416 416-186.624 416-416 416z m0-768C317.92 160 160 317.92 160 512s157.92 352 352 352 352-157.92 352-352S706.08 160 512 160z"
            p-id="19441"></path>
        </svg>
      </span>
      <span @click="() => addTriangle()" :draggable="true" @dragend="onDragend('triangle')">
        <svg t="1650874633978" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="2032" width="26" height="26">
          <path
            d="M928.64 896a2.144 2.144 0 0 1-0.64 0H96a32.032 32.032 0 0 1-27.552-48.288l416-704c11.488-19.456 43.552-19.456 55.104 0l413.152 699.2A31.936 31.936 0 0 1 928.64 896zM152.064 832h719.84L512 222.912 152.064 832z"
            p-id="2033"></path>
        </svg>
      </span>
      <!-- polygon button -->
      <span @click="() => addPolygon()" :draggable="true" @dragend="onDragend('polygon')">
        <svg t="1650874633978" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="2032" width="26" height="26">
          <path
            d="M161.152 398.016l134.016 412.416h433.664l134.016-412.416L512 143.104 161.152 398.08zM512 64l426.048 309.568-162.752 500.864H248.704L85.952 373.568 512 64z"
            p-id="2033"></path>
        </svg>
      </span>
    </div>
    <Divider plain orientation="left">{{ $t('draw_elements') }}</Divider>
    <div class="tool-box">
      <span @click="drawingLineModeSwitch(false)" :class="state.isDrawingLineMode && !state.isArrow && 'bg'">
        <svg t="1673022047861" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="4206" width="20" height="20">
          <path
            d="M187.733333 1024h-170.666666c-10.24 0-17.066667-6.826667-17.066667-17.066667v-170.666666c0-10.24 6.826667-17.066667 17.066667-17.066667h170.666666c10.24 0 17.066667 6.826667 17.066667 17.066667v170.666666c0 10.24-6.826667 17.066667-17.066667 17.066667zM34.133333 989.866667h136.533334v-136.533334H34.133333v136.533334zM1006.933333 204.8h-170.666666c-10.24 0-17.066667-6.826667-17.066667-17.066667v-170.666666c0-10.24 6.826667-17.066667 17.066667-17.066667h170.666666c10.24 0 17.066667 6.826667 17.066667 17.066667v170.666666c0 10.24-6.826667 17.066667-17.066667 17.066667zM853.333333 170.666667h136.533334V34.133333h-136.533334v136.533334z"
            fill="" p-id="4207"></path>
          <path
            d="M187.733333 853.333333c-3.413333 0-10.24 0-13.653333-3.413333-6.826667-6.826667-6.826667-17.066667 0-23.893333l648.533333-648.533334c6.826667-6.826667 17.066667-6.826667 23.893334 0s6.826667 17.066667 0 23.893334l-648.533334 648.533333c0 3.413333-6.826667 3.413333-10.24 3.413333z"
            fill="" p-id="4208"></path>
        </svg>
      </span>
      <span @click="drawingLineModeSwitch(true)" :class="state.isDrawingLineMode && state.isArrow && 'bg'">
        <!-- <svg t="1673022047861" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4206" width="20" height="20"><path d="M187.733333 1024h-170.666666c-10.24 0-17.066667-6.826667-17.066667-17.066667v-170.666666c0-10.24 6.826667-17.066667 17.066667-17.066667h170.666666c10.24 0 17.066667 6.826667 17.066667 17.066667v170.666666c0 10.24-6.826667 17.066667-17.066667 17.066667zM34.133333 989.866667h136.533334v-136.533334H34.133333v136.533334zM1006.933333 204.8h-170.666666c-10.24 0-17.066667-6.826667-17.066667-17.066667v-170.666666c0-10.24 6.826667-17.066667 17.066667-17.066667h170.666666c10.24 0 17.066667 6.826667 17.066667 17.066667v170.666666c0 10.24-6.826667 17.066667-17.066667 17.066667zM853.333333 170.666667h136.533334V34.133333h-136.533334v136.533334z" fill="" p-id="4207"></path><path d="M187.733333 853.333333c-3.413333 0-10.24 0-13.653333-3.413333-6.826667-6.826667-6.826667-17.066667 0-23.893333l648.533333-648.533334c6.826667-6.826667 17.066667-6.826667 23.893334 0s6.826667 17.066667 0 23.893334l-648.533334 648.533333c0 3.413333-6.826667 3.413333-10.24 3.413333z" fill="" p-id="4208"></path></svg> -->
        <svg t="1673026778912" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="2659" width="20" height="20">
          <path
            d="M320 738.133333L827.733333 230.4l-29.866666-29.866667L290.133333 708.266667v-268.8h-42.666666v341.333333h341.333333v-42.666667H320z"
            fill="#444444" p-id="2660"></path>
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup name="Tools">
import { v4 as uuid } from 'uuid';
// import initializeLineDrawing from '@/core/remove/initializeLineDrawing';
import { getPolygonVertices } from '@/utils/math';
import useSelect from '@/hooks/select';
import { useI18n } from 'vue-i18n';

// Default properties
const defaultPosition = { shadow: '', fontFamily: 'arial' };
// Drag properties
const dragOption = {
  left: 0,
  top: 0,
};
const { t } = useI18n();
const { fabric, canvasEditor } = useSelect();
const state = reactive({
  isDrawingLineMode: false,
  isArrow: false,
});
// let drawHandler = null;

const addText = (option) => {
  const text = new fabric.IText(t('Text'), {
    ...defaultPosition,
    ...option,
    fontSize: 80,
    id: uuid(),
  });
  canvasEditor.canvas.add(text);
  if (!option) {
    text.center();
  }
  canvasEditor.canvas.setActiveObject(text);
};

// const addImg = (e) => {
//   const imgEl = e.target.cloneNode(true);
//   const imgInstance = new fabric.Image(imgEl, {
//     ...defaultPosition,
//     id: uuid(),
//     name: '图片default',
//   });
//   canvasEditor.canvas.add(imgInstance);
//   canvasEditor.canvas.renderAll();
// };

const addTriangle = (option) => {
  const triangle = new fabric.Triangle({
    ...defaultPosition,
    ...option,
    width: 400,
    height: 400,
    fill: 'transparent', // Set fill to transparent
    stroke: '#000000', // Border color (black in this case)
    strokeWidth: 2, // Border thickness (adjust as needed)
    id: uuid(),
    name: 'Triangle',
  });
  canvasEditor.canvas.add(triangle);
  if (!option) {
    triangle.center();
  }
  canvasEditor.canvas.setActiveObject(triangle);
};


const addPolygon = (option) => {
  const polygon = new fabric.Polygon(getPolygonVertices(5, 200), {
    ...defaultPosition,
    ...option,
    fill: 'transparent', // Set fill to transparent
    stroke: '#000000', // Border color (black in this case)
    strokeWidth: 2, // Border thickness (adjust as needed)
    id: uuid(),
    name: 'Polygon',
  });
  polygon.set({
    width: 400,
    height: 400,
    pathOffset: {
      x: 0,
      y: 0,
    },
  });
  canvasEditor.canvas.add(polygon);
  if (!option) {
    polygon.center();
  }
  canvasEditor.canvas.setActiveObject(polygon);
};


const addCircle = (option) => {
  const circle = new fabric.Circle({
    ...defaultPosition,
    ...option,
    radius: 150,
    fill: 'transparent', // Set fill to transparent
    stroke: '#000000', // Border color (black in this case)
    strokeWidth: 2, // Border thickness (adjust as needed)
    id: uuid(),
    name: 'Round',
  });
  canvasEditor.canvas.add(circle);
  if (!option) {
    circle.center();
  }
  canvasEditor.canvas.setActiveObject(circle);
};

const addRect = (option) => {
  const outerRect = new fabric.Rect({
    ...defaultPosition,
    ...option,
    fill: '#F57274', // Fill color for the outer rectangle
    width: 400,
    height: 400,
    id: uuid(),
    name: 'RectangleOuter',
  });

  const innerRect = new fabric.Rect({
    ...defaultPosition,
    ...option,
    fill: 'transparent', // Transparent fill for the inner rectangle
    width: 200,          // Adjust the inner rectangle size as needed
    height: 200,
    id: uuid(),
    name: 'RectangleInner',
  });

  canvasEditor.canvas.add(outerRect);
  canvasEditor.canvas.add(innerRect);

  innerRect.center(); // Center the inner rectangle

  if (!option) {
    outerRect.center();
  }

  canvasEditor.canvas.setActiveObject(outerRect);
};
const drawingLineModeSwitch = (isArrow) => {
  state.isArrow = isArrow;
  state.isDrawingLineMode = !state.isDrawingLineMode;
  canvasEditor.setMode(state.isDrawingLineMode);
  canvasEditor.setArrow(isArrow);

  // this.canvasEditor.setMode(this.isDrawingLineMode);
  // this.canvasEditor.setArrow(isArrow);
  canvasEditor.canvas.forEachObject((obj) => {
    if (obj.id !== 'workspace') {
      obj.selectable = !state.isDrawingLineMode;
      obj.evented = !state.isDrawingLineMode;
    }
  });
};

// When dragging starts, record the type of element currently intended to be created.
const onDragend = (type) => {
  // todo Drag and drop optimization this.canvas.editor.dragAddItem(event, item);
  switch (type) {
    case 'text':
      addText(dragOption);
      break;
    case 'rect':
      addRect(dragOption);
      break;
    case 'circle':
      addCircle(dragOption);
      break;
    case 'triangle':
      addTriangle(dragOption);
      break;
    case 'polygon':
      addPolygon(dragOption);
      break;
    default:
  }
};

onMounted(() => {
  nextTick(() => {
    // line drawing
    // drawHandler = initializeLineDrawing(canvasEditor.canvas, defaultPosition);

    canvasEditor.canvas.on('drop', (opt) => {
      // The distance of the canvas element from the left and top of the browser
      const offset = {
        left: canvasEditor.canvas.getSelectionElement().getBoundingClientRect().left,
        top: canvasEditor.canvas.getSelectionElement().getBoundingClientRect().top,
      };

      // Mouse coordinates are converted to canvas coordinates (coordinates without scaling and translation)
      const point = {
        x: opt.e.x - offset.left,
        y: opt.e.y - offset.top,
      };

      //The converted coordinates, restorePointerVpt are not affected by the window transformation
      const pointerVpt = canvasEditor.canvas.restorePointerVpt(point);
      dragOption.left = pointerVpt.x;
      dragOption.top = pointerVpt.y;
    });
  });
});
</script>

<style scoped lang="less">
.tool-box {
  display: flex;
  justify-content: space-around;

  span {
    flex: 1;
    text-align: center;
    padding: 5px 0;
    background: #f6f6f6;
    margin-left: 2px;
    cursor: pointer;

    &:hover {
      background: #edf9ff;

      svg {
        fill: #2d8cf0;
      }
    }
  }

  .bg {
    background: #d8d8d8;

    &:hover {
      svg {
        fill: #2d8cf0;
      }
    }
  }
}

.img {
  width: 20px;
}
</style>
