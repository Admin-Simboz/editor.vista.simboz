
<template>
  <div class="box">
    <!-- color switch -->
    <iSwitch v-model="isGradient" size="large" class="switch">
      <template #open>
        <span id="gradient-button">Gradient</span>
      </template>
      <template #close>
        <span>Solid Color</span>
      </template>
    </iSwitch>
    <!-- Gradient -->
    <div v-if="isGradient">
      <div class="gradient-bar" :style="bgStr"></div>
      <!-- color plugin -->

      <gradientColorPicker :is-gradient="true" :gradient="currentGradient" @change="changeGradientColor"
        :cancel-text="$t('cancel')" :confirm-text="$t('ok')" />
    </div>

    <!-- solid color selector -->
    <div v-show="!isGradient">
      <div class="content">
        <div class="cmyk-inputs">

          <ColorPicker v-model="fill" @on-change="changePureColor" basic />
        </div>

        <div class="custom-slider">
          <div class="slider-component">
            <label for="cInput"> <b>C</b> </label>
          </div>
          <div class="slider-component-cyan">
            <input class="slider" type="range" min="0" max="100" @change="changeFontColor" v-model.number="cFont"
              show-input />
          </div>
          <div class="slider-component">
            <input class="slider-input" type="number" min="0" max="100" @change="changeFontColor" v-model.number="cFont"
              show-input />
            <span><b> %</b></span>
          </div>
        </div>
        <div class="custom-slider">
          <div class="slider-component">
            <label for="mInput"><b>M</b> </label>
          </div>
          <div class="slider-component-magenta">
            <input class="slider" type="range" min="0" max="100" @change="changeFontColor" v-model.number="mFont"
              show-input />
          </div>
          <div class="slider-component">
            <input class="slider-input" type="number" min="0" max="100" @change="changeFontColor" v-model.number="mFont"
              show-input />
            <span><b> %</b></span>
          </div>
        </div>
        <div class="custom-slider">
          <div class="slider-component">
            <label for="yInput"><b>Y</b> </label>
          </div>
          <div class="slider-component-yellow">
            <input class="slider" type="range" min="0" max="100" @change="changeFontColor" v-model.number="yFont"
              show-input />
          </div>
          <div class="slider-component">
            <input class="slider-input" type="number" min="0" max="100" @change="changeFontColor" v-model.number="yFont"
              show-input />
            <span><b> %</b></span>
          </div>
        </div>

        <div class="custom-slider">
          <div class="slider-component">
            <label for="kInput"><b>K</b> </label>
          </div>
          <div class="slider-component-key">
            <input class="slider" type="range" min="0" max="100" @change="changeFontColor" v-model.number="kFont"
              show-input />
          </div>
          <div class="slider-component">
            <input class="slider-input" type="number" min="0" max="100" @change="changeFontColor" v-model.number="kFont"
              show-input />
            <span><b> %</b></span>
          </div>
        </div>
        <div>
          <button class="no-color-button" @click="restBackgroundCMYK">
            <p>Remove</p>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup name="ColorSelector">
import 'color-gradient-picker-vue3/dist/style.css';
import gradientColorPicker from 'color-gradient-picker-vue3';
import { fabric } from 'fabric';
import useSelect from '@/hooks/select';
import { debounce } from 'lodash-es';





var cFont = ref(0);
var mFont = ref(0);
var yFont = ref(0);
var kFont = ref(0);

const changeFontColor = () => {
  const cValue = cFont.value / 100;
  const mValue = mFont.value / 100;
  const yValue = yFont.value / 100;
  const kValue = kFont.value / 100;

  const r = Math.round(255 * (1 - cValue) * (1 - kValue));
  const g = Math.round(255 * (1 - mValue) * (1 - kValue));
  const b = Math.round(255 * (1 - yValue) * (1 - kValue));

  let value = `rgb(${r},${g},${b})`;
  // Example usage:
  const hexColor = rgbToHex(r, g, b); // Replace with your RGB values
  // sliderFontColor(value);
  fill = hexColor;
  emitChange('change', hexColor);
};

const sliderFontColor = (val) => {
  //console.log(fill.value);
  const rgbColor = hexToRgb(val);
  // Extracting individual RGB values from the rgbColor object
  const r = rgbColor.r;
  const g = rgbColor.g;
  const b = rgbColor.b;
  // Checking if RGB values are valid numbers and greater than 0
  const red = (typeof r === 'number' && r >= 0) ? r / 255 : 0;
  const green = (typeof g === 'number' && g >= 0) ? g / 255 : 0;
  const blue = (typeof b === 'number' && b >= 0) ? b / 255 : 0;
  const black = Math.min(1 - red, 1 - green, 1 - blue);
  // Assuming c, m, y, k are variables accessible within this scope
  cFont.value = Math.round(((1 - red - black) / (1 - black)) * 100);
  mFont.value = Math.round(((1 - green - black) / (1 - black)) * 100);
  yFont.value = Math.round(((1 - blue - black) / (1 - black)) * 100);
  kFont.value = Math.round(black * 100);
};
const restBackgroundCMYK = () => {
  cFont.value = 0;
  mFont.value = 0;
  yFont.value = 0;
  kFont.value = 0;
  fill = '#ffffff'; // Replace with your RGB values
  emitChange('change', '#ffffff');
};

const rgbToHex = (r, g, b) => {
  // Convert each RGB component to its hexadecimal representation
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex; // Ensure two digits in the result
  };

  // Ensure values are within valid range (0 to 255)
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  // Convert each component to hexadecimal and concatenate them
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

function hexToRgb(hex) {
  // Remove '#' if present and handle shorthand notation
  hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  // Convert the hexadecimal values to decimal
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
    : null;
}





const { canvasEditor } = useSelect();
const generateFabricGradientFromColorStops = (handlers, width, height, orientation, angle) => {
  // Angle conversion coordinates
  const gradAngleToCoords = (paramsAngle) => {
    const anglePI = -parseInt(paramsAngle, 10) * (Math.PI / 180);
    return {
      x1: Math.round(50 + Math.sin(anglePI) * 50) / 100,
      y1: Math.round(50 + Math.cos(anglePI) * 50) / 100,
      x2: Math.round(50 + Math.sin(anglePI + Math.PI) * 50) / 100,
      y2: Math.round(50 + Math.cos(anglePI + Math.PI) * 50) / 100,
    };
  };

  // Generate linear gradient
  const generateLinear = (colorStops) => {
    const angleCoords = gradAngleToCoords(angle);
    return new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: angleCoords.x1 * width,
        y1: angleCoords.y1 * height,
        x2: angleCoords.x2 * width,
        y2: angleCoords.y2 * height,
      },
      colorStops,
    });
  };

  // Generate radial gradient
  const generateRadial = (colorStops) => {
    return new fabric.Gradient({
      type: 'radial',
      coords: {
        x1: width / 2,
        y1: height / 2,
        r1: 0,
        x2: width / 2,
        y2: height / 2,
        r2: width / 2,
      },
      colorStops,
    });
  };

  let bgGradient = {};
  const colorStops = [...handlers];
  if (orientation === 'linear') {
    bgGradient = generateLinear(colorStops);
  } else if (orientation === 'radial') {
    bgGradient = generateRadial(colorStops);
  }

  return bgGradient;
};
const props = defineProps({
  angleKey: {
    type: String,
    default: 'gradientAngle',
  },
  color: {
    type: [Object, String],
    default: '',
  },
});
const emitChange = defineEmits(['change']);
// const poptipCreated = ref(false);
// Gradient or not
const isGradient = ref(false);
// solid color
let fill = ref('');
// Gradient
const bgStr = ref('background: linear-gradient(124deg, rgb(28, 27, 27) 0%, rgb(255, 0, 0) 100%);');
const currentGradient = reactive({
  type: 'linear',
  degree: 0,
  points: [
    {
      left: 0,
      red: 0,
      green: 0,
      blue: 0,
      alpha: 1,
    },
    {
      left: 100,
      red: 255,
      green: 0,
      blue: 0,
      alpha: 1,
    },
  ],
});
// const onPoptipCreated = () => {
// poptipCreated.value = true;
// };
// 回显颜色
const checkColor = (val) => {
  if (typeof val === 'string') {
    isGradient.value = false;
    fill.value = val;
  } else {
    // Gradient
    isGradient.value = true;
    const activeObject = canvasEditor.canvas.getActiveObjects()[0];
    if (activeObject) {
      // Control property settings
      fabricGradientToCss(val, activeObject);
      // bar  settings
      fabricGradientToBar(val);
    }
  }
};
const changeGradientColor = debounce(function (val) {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  const { gradient } = val;
  if (activeObject) {
    const currentGradient = cssToFabricGradient(gradient, activeObject);
    // TODO:
    emitChange('change', currentGradient);

    // Save the angle for the next selected display
    activeObject.set(props.angleKey, gradient.degree);
    setGradientBar(val);
  }
}, 500);
// Set gradient color bar
const setGradientBar = (val) => {
  if (val.gradient.type === 'linear') {
    bgStr.value = `background: ${val.style};`;
  } else {
    bgStr.value = `background: ${val.style.replace('radial', 'linear')};`;
  }
};
// Fabric gradient bar background settings
const fabricGradientToBar = (val) => {
  // Percentage sorting
  val.colorStops.sort((a, b) => a.offset - b.offset);
  const str = val.colorStops.map((item) => `${item.color} ${item.offset * 100}%`);
  bgStr.value = `background: linear-gradient(124deg, ${str});`;
};
// Fabric gradient to css
const fabricGradientToCss = (val, activeObject) => {
  // gradient type
  currentGradient.type = val.type;
  currentGradient.degree = activeObject.get(props.angleKey, val.degree);
  currentGradient.points = val.colorStops.map((item) => {
    const [red, green, blue, alpha] = item.color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
    return {
      left: item.offset * 100,
      red: Number(red),
      green: Number(green),
      blue: Number(blue),
      alpha: Number(alpha),
    };
  });
};
// css to Fabric gradient
const cssToFabricGradient = (val, activeObject) => {
  const handlers = val.points.map((item) => ({
    offset: item.left / 100,
    color: `rgba(${item.red}, ${item.green}, ${item.blue}, ${item.alpha})`,
  }));
  return generateFabricGradientFromColorStops(
    handlers,
    activeObject.width,
    activeObject.height,
    val.type,
    val.degree
  );
};
// solid color
const changePureColor = (val) => {
  sliderFontColor(val);
  emitChange('change', val);
};

onMounted(() => {
  checkColor(props.color);
});
</script>

<style scoped lang="less">
// @import url('vue-color-gradient-picker/dist/index.css');
:deep(.ivu-color-picker) {
  display: block;
}

:deep(.ivu-input-number) {
  display: block;
  width: 100%;
}

:deep(.ivu-divider-plain) {
  &.ivu-divider-with-text-left {
    margin: 10px 0;
    font-weight: bold;
    font-size: 16px;
    color: #000000;
  }
}

.box {
  width: 100%;
}

.button-group {
  display: flex;
  width: 100%;

  .ivu-btn,
  .ivu-radio-wrapper {
    flex: 1;
  }
}

.slider-input {
  width: 45px;
}

.no-color-img {
  width: 20px;
  height: 20px;
}

.slider-component {}

.color-box {
  width: 200px;
  height: 200px;
  border: 1px solid #000;
  transition: background-color 0.3s ease;
  /* Default color if RGB values are not set */
  background-color: red;
}

.color-box-div {
  display: flex;
  flex-direction: column-reverse;
  align-content: center;
  flex-wrap: wrap;
}

.custom-slider {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin: 5px;
}


.slider {
  width: 116%;

}

.img {
  width: 50px;
  padding: 5px;
  background: #f5f5f5;
  margin-left: 2px;
  height: 70px;
  cursor: pointer;
}

.color-box {
  width: 200px;
  height: 200px;
  border: 1px solid #000;
  transition: background-color 0.3s ease;
  /* Default color if RGB values are not set */
  color: black];
}

.color-list {
  padding: 10px 0;

  .item {
    padding-bottom: 5px;
  }

  span {
    display: inline-block;
    margin-left: 6px;
    background: #f5f5f5;
    height: 20px;
    width: 20px;
    font-size: 12px;
    line-height: 20px;
    vertical-align: middle;
    cursor: pointer;
  }
}

:deep(.ivu-divider-plain) {
  &.ivu-divider-with-text-left {
    margin: 10px 0;
    font-weight: bold;
  }
}

.ivu-input ivu-input-small {
  display: none;
}

.cmyk-inputs {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin-top: 10px;
  margin-bottom: 10px;
}

.custom-slider {
  --trackHeight: 0.5rem;
  --thumbRadius: 1rem;
}

/* style the input element with type "range" */
.custom-slider input[type="range"] {
  position: relative;
  appearance: none;
  /* pointer-events: none; */
  border-radius: 999px;
  z-index: 0;
}

.custom-slider label {
  font-size: 15px;
}

/* ::before element to replace the slider track */
.slider-component-cyan input[type="range"]::before {
  content: "";
  position: absolute;
  width: var(--ProgressPercent, 100%);
  height: 100%;
  background: linear-gradient(to right, #ffff 0%, #00FFFF 100%);
  /* Use linear-gradient with 'to right' to create a gradient from left to right */
  /* Adjust the color stops and positions as needed */
  pointer-events: none;
  border-radius: 999px;
}

.slider-component-magenta input[type="range"]::before {
  content: "";
  position: absolute;
  width: var(--ProgressPercent, 100%);
  height: 100%;
  background: linear-gradient(to right, #ffff 0%, #FF00FF 100%);
  /* Use linear-gradient with 'to right' to create a gradient from left to right */
  /* Adjust the color stops and positions as needed */
  pointer-events: none;
  border-radius: 999px;
}

.slider-component-yellow input[type="range"]::before {
  content: "";
  position: absolute;
  width: var(--ProgressPercent, 100%);
  height: 100%;
  background: linear-gradient(to right, #ffff 0%, #FFFF00 100%);
  /* Use linear-gradient with 'to right' to create a gradient from left to right */
  /* Adjust the color stops and positions as needed */
  pointer-events: none;
  border-radius: 999px;
}

.slider-component-key input[type="range"]::before {
  content: "";
  position: absolute;
  width: var(--ProgressPercent, 100%);
  height: 100%;
  background: linear-gradient(to right, #ffff 0%, #000000 100%);
  /* Use linear-gradient with 'to right' to create a gradient from left to right */
  /* Adjust the color stops and positions as needed */
  pointer-events: none;
  border-radius: 999px;
}

/* `::-webkit-slider-runnable-track` targets the track (background) of a range slider in chrome and safari browsers. */
.custom-slider input[type="range"]::-webkit-slider-runnable-track {
  appearance: none;
  background: #005a3c;
  height: var(--trackHeight);
  border-radius: 999px;
}

/* `::-moz-range-track` targets the track (background) of a range slider in Mozilla Firefox. */
.custom-slider input[type="range"]::-moz-range-track {
  appearance: none;
  background: #005a3c;
  height: var(--trackHeight);
  border-radius: 999px;
}

.slider-component-cyan input[type="range"]::-webkit-slider-thumb {
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
  width: var(--thumbRadius);
  height: var(--thumbRadius);
  /* margin-top: calc((var(--trackHeight) - var(--thumbRadius)) / 2); */
  background: #02d3de;
  border-radius: 999px;
  pointer-events: all;
  appearance: none;
  z-index: 1;
}



.slider-component-magenta input[type="range"]::-webkit-slider-thumb {
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
  width: var(--thumbRadius);
  height: var(--thumbRadius);
  /* margin-top: calc((var(--trackHeight) - var(--thumbRadius)) / 2); */
  background: #da03d3;
  border-radius: 999px;
  pointer-events: all;
  appearance: none;
  z-index: 1;
}

.slider-component-yellow input[type="range"]::-webkit-slider-thumb {
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
  width: var(--thumbRadius);
  height: var(--thumbRadius);
  /* margin-top: calc((var(--trackHeight) - var(--thumbRadius)) / 2); */
  background: #ffea03;
  border-radius: 999px;
  pointer-events: all;
  appearance: none;
  z-index: 1;
}

.slider-component-key input[type="range"]::-webkit-slider-thumb {
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
  width: var(--thumbRadius);
  height: var(--thumbRadius);
  /* margin-top: calc((var(--trackHeight) - var(--thumbRadius)) / 2); */
  background: #231821;
  border-radius: 999px;
  pointer-events: all;
  appearance: none;
  z-index: 1;
}


.flex-view {
  width: 100%;
  margin-bottom: 5px;
  padding: 5px;
  display: inline-flex;
  justify-content: space-between;
  border-radius: 5px;
  background: #f6f7f9;
}

.flex-item {
  display: inline-flex;
  flex: 1;

  .label {
    width: 32px;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    font-size: 14px;
    // color: #333333;
  }

  .content {
    width: 60px;
  }

  .slider-box {
    width: calc(100% - 50px);
    margin-left: 10px;
  }

  .left {
    flex: 1;
  }

  .right {
    flex: 1;
    margin-left: 10px;

    :deep(.ivu-input-number) {
      display: block;
      width: 100%;
    }
  }

  :deep(.ivu-slider-wrap) {
    margin: 13px 0;
  }

  :deep(.ivu-radio-group-button) {
    & .ivu-radio-wrapper {
      width: 48px;
      line-height: 40px;
      text-align: center;

      svg {
        vertical-align: baseline;
      }
    }
  }

  :deep(.ivu-btn-group-large) {
    &>.ivu-btn {
      font-size: 24px;
    }
  }

  :deep(.ivu-radio-group-button) {
    &.ivu-radio-group-large .ivu-radio-wrapper {
      font-size: 24px;
    }
  }
}

.ivu-row {
  margin-bottom: 8px;

  .ivu-col {
    position: inherit;

    &__box {
      display: flex;
      align-items: center;
      background: #f8f8f8;
      border-radius: 4px;
      gap: 8px;
    }
  }

  .label {
    padding-left: 8px;
  }

  .content {
    flex: 1;

    :deep(.--input),
    :deep(.ivu-select-selection) {
      background-color: transparent;
      border: none !important;
      box-shadow: none !important;
    }
  }
}

.font-selector {
  :deep(.ivu-select-item) {
    padding: 1px 4px;
  }

  .font-item {
    background-color: #000;
    background-size: cover;
    background-position: center center;
    height: 40px;
    width: 200px;
    color: #fff;
    font-size: 27px;
    text-align: center;
    filter: invert(100%);
  }
}

#background {
  padding-left: 6px;
}

#angel {
  display: block;
}

#opacity {
  display: block;
}

.dropdown {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  position: relative;
  display: flex;
  margin-top: 10px;
}

.icon {
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
}

.icon-rotate {
  transform: translateY(-50%) rotate(180deg);
}

.dropdown-menu {
  list-style: none;
  padding: 0;
  margin: 5px 0 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: inline-block;
  position: absolute;
  background-color: #fff;
}

.cstmStyle {
  display: flex;
  justify-content: space-between;
}

.no-color-button {
  width: 100%;
  background-color: #F6F7F9;
  border-color: #9a9ca0;
  padding: 4px;
  color: #9a9ca0;
  border-width: 1px;
  margin-top: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  /* Other styles for the button */
}

.custom-slider {
  background-color: #F6F7F9;
  padding: 6px;
  border-radius: 4%;
}
</style>
