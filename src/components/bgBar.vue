<template>
  <div v-if="!mixinState.mSelectMode">
    <Divider orientation="left" plain>{{ $t('Color') }}</Divider>

    <!-- CMYK Input Boxes -->
    <div class="cmyk-inputs">

      <ColorPicker v-model="color" :colors="colors" @on-change="convertHEXtoRGB" basic />
      <div class="custom-slider">
        <div class="slider-component">
          <label for="cInput"> <b>C</b> </label>
        </div>
        <div class="slider-component-cyan">
          <input class="slider" type="range" min="0" max="100" @change="convertCMYKtoRGB" v-model.number="c" show-input />
        </div>
        <div class="slider-component">
          <input class="slider-input" type="number" min="0" max="100" @change="convertCMYKtoRGB" v-model.number="c"
            show-input />
          <span><b> %</b></span>
        </div>

      </div>
      <div class="custom-slider">
        <div class="slider-component">
          <label for="mInput"><b>M</b> </label>
        </div>
        <div class="slider-component-magenta">
          <input class="slider" type="range" min="0" max="100" @change="convertCMYKtoRGB" v-model.number="m" show-input />
        </div>
        <div class="slider-component">
          <input class="slider-input" type="number" min="0" max="100" @change="convertCMYKtoRGB" v-model.number="m"
            show-input />
          <span><b> %</b></span>
        </div>
      </div>
      <div class="custom-slider">
        <div class="slider-component">
          <label for="yInput"><b>Y</b> </label>
        </div>
        <div class="slider-component-yellow">
          <input class="slider" type="range" min="0" max="100" @change="convertCMYKtoRGB" v-model.number="y" show-input />
        </div>
        <div class="slider-component">
          <input class="slider-input" type="number" min="0" max="100" @change="convertCMYKtoRGB" v-model.number="y"
            show-input />
          <span><b> %</b></span>
        </div>
      </div>

      <div class="custom-slider">
        <div class="slider-component">
          <label for="kInput"><b>K</b> </label>
        </div>
        <div class="slider-component-key">
          <input class="slider" type="range" min="0" max="100" @change="convertCMYKtoRGB" v-model.number="k" show-input />
        </div>
        <div class="slider-component">
          <input class="slider-input" type="number" min="0" max="100" @change="convertCMYKtoRGB" v-model.number="k"
            show-input />
          <span><b> %</b></span>
        </div>
      </div>

      <button class="no-color-button" @click="restCMYK">
        <p>Remove</p>
      </button>

    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import useSelect from '@/hooks/select';
import { useI18n } from 'vue-i18n';


export default {
  setup() {
    const { t } = useI18n();
    const { mixinState, canvasEditor } = useSelect();

    const colorList = []; // Placeholder for your color list data

    const color = ref('rgb(255, 255, 255)'); // Default color
    var c = ref(0);
    var m = ref(0);
    var y = ref(0);
    var k = ref(0);
    const color2 = ref('#311B92');
    const boxColor = ref('white');

    const convertCMYKtoRGB = () => {
      const cValue = c.value / 100; // CMYK values are between 0 and 1
      const mValue = m.value / 100;
      const yValue = y.value / 100;
      const kValue = k.value / 100;

      // Calculate RGB values directly without intermediate rounding
      const r = Math.round(255 * (1 - cValue) * (1 - kValue));
      const g = Math.round(255 * (1 - mValue) * (1 - kValue));
      const b = Math.round(255 * (1 - yValue) * (1 - kValue));
      color.value = `rgb(${r}, ${g}, ${b})`;

      return `rgb(${r}, ${g}, ${b})`;

    };


    watch([c, m, y, k], ([newC, newM, newY, newK]) => {
      const rgbColor = convertCMYKtoRGB(newC, newM, newY, newK);
      setColor(rgbColor);
    });

    const setColor = (color) => {
      const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace');
      workspace.set('fill', color);
      canvasEditor.canvas.renderAll();
    };

    const convertHEXtoRGB = (color) => {
      const value = color.replace('#', '');

      // Convert HEX to RGB
      const bigint = parseInt(value, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;

      const rgb = `rgb(${r}, ${g}, ${b})`;


      const red = r / 255;
      const green = g / 255;
      const blue = b / 255;
      const black = Math.min(1 - red, 1 - green, 1 - blue);
      c.value = Math.round(((1 - red - black) / (1 - black)) * 100),
        m.value = Math.round(((1 - green - black) / (1 - black)) * 100),
        y.value = Math.round(((1 - blue - black) / (1 - black)) * 100),
        k.value = Math.round(black * 100);
    };


    const restCMYK = () => {
      c.value = 0;
      m.value = 0;
      y.value = 0;
      k.value = 0;
      console.log('test');

    };

    return {
      mixinState,
      colorList,
      color,
      c,
      m,
      y,
      k,
      convertCMYKtoRGB,
      convertHEXtoRGB,
      restCMYK,
      boxColor,
      colors: ['#311B92', '#512DA8', '#673AB7', '#9575CD', '#D1C4E9'],

    };
  },
};

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
:deep(.ivu-form-item) {
  margin-bottom: 0;
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

.button-div {
  margin: 10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.custom-slider {
  background-color: #F6F7F9;
  padding: 6px;
  border-radius: 4px;
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
}
</style>
