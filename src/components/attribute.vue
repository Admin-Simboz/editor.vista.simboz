<template>
  <div class="box" v-if="mixinState.mSelectMode === 'one'">
    <!-- Gradient selector -->
    <div v-show="textType.includes(mixinState.mSelectOneType)">
      <div class="dropdown cstmStyle" plain orientation="left" @click="toggleFont"><span> {{
        $t('attributes.font') }}</span>
        <span>+</span>
      </div>
      <div class="font" v-if="showFont">
        <div class="flex-view">
          <div class="flex-item">
            <div class="left font-selector">
              <Select v-model="fontAttr.fontFamily" @on-change="changeFontFamily">
                <Option v-for="item in fontFamilyList" :value="item.name" :key="`font-${item.name}`">
                  <div class="font-item" v-if="!item.preview">{{ item.name }}</div>
                  <div class="font-item" v-else :style="`background-image:url('${item.preview}');`">
                    {{ !item.preview ? item : '' }}
                    <!-- Solve the problem of being unable to select -->
                    <span style="display: none">{{ item.name }}</span>
                  </div>
                </Option>
              </Select>
            </div>
            <div class="right">
              <InputNumber v-model="fontAttr.fontSize" @on-change="(value) => changeCommon('fontSize', value)"
                append="Font size" :min="1"></InputNumber>
            </div>
          </div>
        </div>

        <div class="flex-view">
          <div class="flex-item">
            <RadioGroup class="button-group" v-model="fontAttr.textAlign"
              @on-change="(value) => changeCommon('textAlign', value)" type="button">
              <Radio v-for="(item, i) in textAlignList" :label="item" :key="item">
                <span v-html="textAlignListSvg[i]"></span>
              </Radio>
            </RadioGroup>
          </div>
        </div>

        <div class="flex-view">
          <div class="flex-item">
            <ButtonGroup class="button-group">
              <Button @click="changeFontWeight('fontWeight', fontAttr.fontWeight)">
                <svg viewBox="0 0 1024 1024" width="14" height="14">
                  <path
                    d="M793.99865 476a244 244 0 0 0 54-130.42C862.75865 192.98 743.01865 64 593.85865 64H195.01865a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h63.74v576H195.01865a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h418.64c141.6 0 268.28-103.5 282-244.8 9.48-96.9-32.78-184.12-101.66-239.2zM418.33865 224h175.52a96 96 0 0 1 0 192h-175.52z m175.52 576h-175.52V576h175.52a112 112 0 0 1 0 224z"
                    :fill="fontAttr.fontWeight === 'bold' ? '#305ef4' : '#666'"></path>
                </svg>
              </Button>
              <Button @click="changeFontStyle('fontStyle', fontAttr.fontStyle)">
                <svg viewBox="0 0 1024 1024" width="14" height="14">
                  <path
                    d="M832 96v64a32 32 0 0 1-32 32h-125.52l-160 640H608a32 32 0 0 1 32 32v64a32 32 0 0 1-32 32H224a32 32 0 0 1-32-32v-64a32 32 0 0 1 32-32h125.52l160-640H416a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32h384a32 32 0 0 1 32 32z"
                    :fill="fontAttr.fontStyle === 'italic' ? '#305ef4' : '#666'"></path>
                </svg>
              </Button>
              <Button @click="changeLineThrough('linethrough', fontAttr.linethrough)">
                <svg viewBox="0 0 1024 1024" width="14" height="14">
                  <path
                    d="M893.088 501.792H125.344a32 32 0 0 0 0 64h767.744a32 32 0 0 0 0-64zM448 448h112V208h288V96H160v112h288zM448 640h112v288H448z"
                    :fill="fontAttr.linethrough ? '#305ef4' : '#666'"></path>
                </svg>
              </Button>
              <Button @click="changeUnderline('underline', fontAttr.underline)">
                <svg viewBox="0 0 1024 1024" width="14" height="14">
                  <path
                    d="M703.232 67.008h127.488v413.248c0 158.016-142.656 286.016-318.72 286.016-176 0-318.72-128-318.72-286.016V67.008h127.488v413.248c0 39.872 18.176 78.144 51.136 107.776 36.8 32.96 86.528 51.072 140.096 51.072s103.36-18.112 140.032-51.136c33.024-29.632 51.2-67.968 51.2-107.776V67.008zM193.28 871.616h637.44v85.376H193.28v-85.376z"
                    :fill="fontAttr.underline ? '#305ef4' : '#666'"></path>
                </svg>
              </Button>
            </ButtonGroup>
          </div>
        </div>

        <Row :gutter="12">
          <Col flex="1">
          <InputNumber v-model="fontAttr.lineHeight" @on-change="(value) => changeCommon('lineHeight', value)" :step="0.1"
            :append="$t('attributes.line_height')"></InputNumber>
          </Col>
          <Col flex="1">
          <InputNumber v-model="fontAttr.charSpacing" @on-change="(value) => changeCommon('charSpacing', value)"
            :append="$t('attributes.char_spacing')"></InputNumber>
          </Col>
        </Row>
      </div>

      <div class="dropdown cstmStyle" plain orientation="left" @click="toggleBackground"><span> {{
        $t('background') }}</span>
        <span>+</span>
      </div>
      <div class="font-background-color" v-if="showBackground">

        <div class="cmyk-inputs">

          <ColorPicker v-model="fontAttr.textBackgroundColor"
            @on-change="(value) => changeCommon('textBackgroundColor', value)" basic />
        </div>

        <div class="custom-slider">
          <div class="slider-component">
            <label for="cInput"> <b>C</b> </label>
          </div>
          <div class="slider-component-cyan">
            <input class="slider" type="range" min="0" max="100" @change="changeBackgroundColorFont" v-model.number="c"
              show-input />
          </div>
          <div class="slider-component">
            <input class="slider-input" type="number" min="0" max="100"
              @change="changeBackgroundColorFont('textBackgroundColor')" v-model.number="c" show-input />
            <span><b> %</b></span>
          </div>

        </div>
        <div class="custom-slider">
          <div class="slider-component">
            <label for="mInput"><b>M</b> </label>
          </div>
          <div class="slider-component-magenta">
            <input class="slider" type="range" min="0" max="100" @change="changeBackgroundColorFont" v-model.number="m"
              show-input />
          </div>
          <div class="slider-component">
            <input class="slider-input" type="number" min="0" max="100" @change="changeBackgroundColorFont"
              v-model.number="m" show-input />
            <span><b> %</b></span>
          </div>
        </div>
        <div class="custom-slider">
          <div class="slider-component">
            <label for="yInput"><b>Y</b> </label>
          </div>
          <div class="slider-component-yellow">
            <input class="slider" type="range" min="0" max="100" @change="changeBackgroundColorFont" v-model.number="y"
              show-input />
          </div>
          <div class="slider-component">
            <input class="slider-input" type="number" min="0" max="100" @change="changeBackgroundColorFont"
              v-model.number="y" show-input />
            <span><b> %</b></span>
          </div>
        </div>

        <div class="custom-slider">
          <div class="slider-component">
            <label for="kInput"><b>K</b> </label>
          </div>
          <div class="slider-component-key">
            <input class="slider" type="range" min="0" max="100" @change="changeBackgroundColorFont" v-model.number="k"
              show-input />
          </div>
          <div class="slider-component">
            <input class="slider-input" type="number" min="0" max="100" @change="changeBackgroundColorFont"
              v-model.number="k" show-input />
            <span><b> %</b></span>
          </div>
        </div>
        <div class="button-div">

          <button class="no-color-button" @click="restBackgroundCMYK">
            <p>Remove</p>
          </button>

        </div>
      </div>
    </div>

    <!-- Common properties -->
    <div v-show="baseType.includes(mixinState.mSelectOneType)">
      <div class="dropdown cstmStyle" plain orientation="left" @click="toggleColor"><span> {{
        $t('attributes.exterior') }}</span>
        <span>+</span>
      </div>

      <div v-if="showColor">
        <!-- Number of polygon sides -->
        <Row v-if="mixinState.mSelectOneType === 'polygon'" :gutter="12">
          <Col flex="0.5">
          <InputNumber v-model="baseAttr.points.length" :min="3" :max="30" @on-change="changeEdge"
            append="Number of sides">
          </InputNumber>
          </Col>
        </Row>
        <!-- color -->
        <colorSelector :color="baseAttr.fill" @change="(value) => changeCommon('fill', value)"></colorSelector>
        <Row :gutter="12">
          <Col flex="1">
          <InputNumber v-model="baseAttr.left" @on-change="(value) => changeCommon('left', value)"
            :append="$t('attributes.left')"></InputNumber>
          </Col>
          <Col flex="1">
          <InputNumber v-model="baseAttr.top" @on-change="(value) => changeCommon('top', value)"
            :append="$t('attributes.top')"></InputNumber>
          </Col>
        </Row>
        <div class="flex-view">
          <div class="flex-item" id="angel">
            <span class="label">{{ $t('attributes.angle') }}</span>
            <div class="content slider-box">
              <Slider v-model="baseAttr.angle" :max="360" @on-input="(value) => changeCommon('angle', value)"></Slider>
            </div>
          </div>
        </div>
        <div class="flex-view">
          <div class="flex-item" id="angel">
            <span class="label">{{ $t('attributes.opacity') }}</span>
            <div class="content slider-box">
              <Slider v-model="baseAttr.opacity" @on-input="(value) => changeCommon('opacity', value)"></Slider>
            </div>
          </div>
        </div>
      </div>

      <!-- frame -->
      <div class="dropdown cstmStyle" plain orientation="left" @click="toggleStroke"><span> {{
        $t('attributes.stroke') }}</span>
        <span>+</span>
      </div>

      <div class="stroke" v-if="showStroke">
        <div class="ivu-col__box">
          <div class="content">
            <div class="cmyk-inputs">

              <ColorPicker v-model="baseAttr.stroke" @on-change="(value) => changeCommon('stroke', value)" basic />
            </div>

            <div class="custom-slider">
              <div class="slider-component">
                <label for="cInput"> <b>C</b> </label>
              </div>
              <div class="slider-component-cyan">
                <input class="slider" type="range" min="0" max="100" @change="changeStrokeColor" v-model.number="cStroke"
                  show-input />
              </div>
              <div class="slider-component">
                <input class="slider-input" type="number" min="0" max="100" @change="changeStrokeColor"
                  v-model.number="cStroke" show-input />
                <span><b> %</b></span>
              </div>

            </div>
            <div class="custom-slider">
              <div class="slider-component">
                <label for="mInput"><b>M</b> </label>
              </div>
              <div class="slider-component-magenta">
                <input class="slider" type="range" min="0" max="100" @change="changeStrokeColor" v-model.number="mStroke"
                  show-input />
              </div>
              <div class="slider-component">
                <input class="slider-input" type="number" min="0" max="100" @change="changeStrokeColor"
                  v-model.number="mStroke" show-input />
                <span><b> %</b></span>
              </div>
            </div>
            <div class="custom-slider">
              <div class="slider-component">
                <label for="yInput"><b>Y</b> </label>
              </div>
              <div class="slider-component-yellow">
                <input class="slider" type="range" min="0" max="100" @change="changeStrokeColor" v-model.number="yStroke"
                  show-input />
              </div>
              <div class="slider-component">
                <input class="slider-input" type="number" min="0" max="100" @change="changeStrokeColor"
                  v-model.number="yStroke" show-input />
                <span><b> %</b></span>
              </div>
            </div>

            <div class="custom-slider">
              <div class="slider-component">
                <label for="kInput"><b>K</b> </label>
              </div>
              <div class="slider-component-key">
                <input class="slider" type="range" min="0" max="100" @change="changeStrokeColor" v-model.number="kStroke"
                  show-input />
              </div>
              <div class="slider-component">
                <input class="slider-input" type="number" min="0" max="100" @change="changeStrokeColor"
                  v-model.number="kStroke" show-input />
                <span><b> %</b></span>
              </div>
            </div>
            <div>
              <button class="no-color-button" @click="restStrokeCMYK">
                <p>Remove</p>
              </button>
            </div>
          </div>
        </div>
        <Row :gutter="12">
          <Col flex="1">
          <div class="ivu-col__box">
            <InputNumber v-model="baseAttr.strokeWidth" @on-change="(value) => changeCommon('strokeWidth', value)"
              :append="$t('width')" :min="0"></InputNumber>
          </div>
          </Col>
        </Row>

        <Row :gutter="12">
          <Col flex="1">
          <div class="ivu-col__box">
            <span class="label">{{ $t('attributes.stroke') }}</span>
            <div class="content">
              <Select v-model="baseAttr.strokeDashArray" @on-change="borderSet">
                <Option v-for="item in strokeDashList" :value="item.label" :key="`stroke-${item.label}`">
                  {{ item.label }}
                </Option>
              </Select>
            </div>
          </div>
          </Col>
        </Row>
      </div>
      <!-- shadow -->
      <div class="dropdown cstmStyle" plain orientation="left" @click="toggleShadow"><span> {{
        $t('attributes.shadow') }}</span>
        <span>+</span>
      </div>
      <div v-if="showShadow">

        <div class="ivu-col__box">
          <div class="content">
            <div class="cmyk-inputs">
              <ColorPicker v-model="baseAttr.shadow.color" @on-change="(value) => changeCommon('color', value)" basic />
            </div>

            <div class="custom-slider">
              <div class="slider-component">
                <label for="cInput"> <b>C</b> </label>
              </div>
              <div class="slider-component-cyan">
                <input class="slider" type="range" min="0" max="100" @change="changeShadowColor" v-model.number="cShadow"
                  show-input />
              </div>
              <div class="slider-component">
                <input class="slider-input" type="number" min="0" max="100" @change="changeShadowColor"
                  v-model.number="cShadow" show-input />
                <span><b> %</b></span>
              </div>

            </div>
            <div class="custom-slider">
              <div class="slider-component">
                <label for="mInput"><b>M</b> </label>
              </div>
              <div class="slider-component-magenta">
                <input class="slider" type="range" min="0" max="100" @change="changeShadowColor" v-model.number="mShadow"
                  show-input />
              </div>
              <div class="slider-component">
                <input class="slider-input" type="number" min="0" max="100" @change="changeShadowColor"
                  v-model.number="mShadow" show-input />
                <span><b> %</b></span>
              </div>
            </div>
            <div class="custom-slider">
              <div class="slider-component">
                <label for="yInput"><b>Y</b> </label>
              </div>
              <div class="slider-component-yellow">
                <input class="slider" type="range" min="0" max="100" @change="changeShadowColor" v-model.number="yShadow"
                  show-input />
              </div>
              <div class="slider-component">
                <input class="slider-input" type="number" min="0" max="100" @change="changeShadowColor"
                  v-model.number="yShadow" show-input />
                <span><b> %</b></span>
              </div>
            </div>

            <div class="custom-slider">
              <div class="slider-component">
                <label for="kInput"><b>K</b> </label>
              </div>
              <div class="slider-component-key">
                <input class="slider" type="range" min="0" max="100" @change="changeShadowColor" v-model.number="kShadow"
                  show-input />
              </div>
              <div class="slider-component">
                <input class="slider-input" type="number" min="0" max="100" @change="changeShadowColor"
                  v-model.number="kShadow" show-input />
                <span><b> %</b></span>
              </div>
            </div>
            <button class="no-color-button" @click="restStrokeCMYK">
              <p>Remove</p>
            </button>
          </div>
        </div>



        <Row :gutter="12">
          <Col flex="1">
          <InputNumber v-model="baseAttr.shadow.blur" :defaultValue="0"
            @on-change="(value) => changeShadow('blur', value)" :append="$t('attributes.blur')" :min="0"></InputNumber>
          </Col>
        </Row>

        <Row :gutter="12">
          <Col flex="1">
          <InputNumber v-model="baseAttr.shadow.offsetX" :defaultValue="0"
            @on-change="(value) => changeShadow('offsetX', value)" :append="$t('attributes.offset_x')"></InputNumber>
          </Col>
          <Col flex="1">
          <InputNumber v-model="baseAttr.shadow.offsetY" :defaultValue="0"
            @on-change="(value) => changeShadow('offsetY', value)" :append="$t('attributes.offset_y')"></InputNumber>
          </Col>
        </Row>

      </div>

    </div>

  </div>
</template>

<script setup name="AttrBute">
import fontList from '@/assets/fonts/font';
import useSelect from '@/hooks/select';
import FontFaceObserver from 'fontfaceobserver';
import colorSelector from '@/components/colorSelector.vue';
import axios from 'axios';
import { getPolygonVertices } from '@/utils/math';
import InputNumber from '@/components/inputNumber';
import { Spin } from 'view-ui-plus';
import { ref, watch } from 'vue';


const event = inject('event');
const update = getCurrentInstance();
const repoSrc = import.meta.env.APP_REPO;
const { fabric, mixinState, canvasEditor } = useSelect();




//Show Div on click
const showBackground = ref(false);
const showFont = ref(false);
const showStroke = ref(false);
const showShadow = ref(false);
const showColor = ref(false);

const toggleColor = () => {
  showColor.value = !showColor.value;
};
const toggleShadow = () => {
  showShadow.value = !showShadow.value;
};
const toggleFont = () => {
  showFont.value = !showFont.value;
};

const toggleBackground = () => {
  showBackground.value = !showBackground.value;
};

const toggleStroke = () => {
  showStroke.value = !showStroke.value;
};




// common elements
const baseType = [
  'Text',
  'i-text',
  'Textbox',
  'Rectangle',
  'Circle',
  'Triangle',
  'Polygon',
  'Image',
  'Group',
  'Line',
  'Arrow',
];
// text element
const textType = ['i-text', 'textbox', 'text'];
// Common properties
const baseAttr = reactive({
  id: '',
  opacity: 0,
  angle: 0,
  fill: '#fff',
  left: 0,
  top: 0,
  strokeWidth: 0,
  strokeDashArray: [],
  stroke: '#fff',
  shadow: {
    color: '#fff',
    blur: 0,
    offsetX: 0,
    offsetY: 0,
  },
  points: {},
});
// Font properties
const fontAttr = reactive({
  fontSize: 0,
  fontFamily: '',
  lineHeight: 0,
  charSpacing: 0,
  fontWeight: '',
  textBackgroundColor: '#fff',
  textAlign: '',
  fontStyle: '',
  underline: false,
  linethrough: false,
  overline: false,
});
// Font drop-down list
const fontFamilyList = ref([...fontList]);
const strokeDashList = [
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [],
      strokeLineCap: 'butt',
    },
    label: 'Stroke',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 10],
      strokeLineCap: 'butt',
    },
    label: 'Dash-1',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 10],
      strokeLineCap: 'round',
    },
    label: 'Dash-2',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [15, 15],
      strokeLineCap: 'square',
    },
    label: 'Dash-3',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [15, 15],
      strokeLineCap: 'round',
    },
    label: 'Dash-4',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [25, 25],
      strokeLineCap: 'square',
    },
    label: 'Dash-5',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [25, 25],
      strokeLineCap: 'round',
    },
    label: 'Dash-6',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 8, 16, 8, 1, 20],
      strokeLineCap: 'square',
    },
    label: 'Dash-7',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 8, 16, 8, 1, 20],
      strokeLineCap: 'round',
    },
    label: 'Dash-8',
  },
];
// Font alignmen
const textAlignList = ['left', 'center', 'right'];
// align icon
const textAlignListSvg = [
  '<svg t="1650441458823" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3554" width="18" height="18"><path d="M198.4 198.4h341.333333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666667h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-569.6c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666666h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533334z m0 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3555"></path></svg>',
  '<svg t="1650441512015" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3704" width="18" height="18"><path d="M313.6 198.4h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533333z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m115.2 170.666666h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533334z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3705"></path></svg>',
  '<svg t="1650441519862" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3854" width="18" height="18"><path d="M454.4 283.733333v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h341.333334c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333334c-8.533333 0-14.933333-2.133333-19.2-8.533334-4.266667-4.266667-8.533333-10.666667-8.533333-19.2z m-226.133333 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333H256c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533333-19.2z m113.066666 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533334-19.2 6.4-6.4 12.8-8.533333 19.2-8.533334h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533334-19.2z m-170.666666 170.666666v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-4.266667-8.533333-10.666667-8.533333-19.2z" p-id="3855"></path></svg>',
];

const getFreeFontList = () => {
  axios.get(`${repoSrc}/font/free-font.json`).then((res) => {
    fontFamilyList.value = [
      ...fontFamilyList.value,
      ...Object.entries(res.data).map(([, value]) => value),
    ];
  });
};

const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  // Not the current obj, skip
  if (e && e.target && e.target !== activeObject) return;
  if (activeObject) {
    // base
    baseAttr.id = activeObject.get('id');
    baseAttr.opacity = activeObject.get('opacity') * 100;
    baseAttr.fill = activeObject.get('fill');
    baseAttr.left = activeObject.get('left');
    baseAttr.top = activeObject.get('top');
    baseAttr.stroke = activeObject.get('stroke');
    baseAttr.strokeWidth = activeObject.get('strokeWidth');
    baseAttr.shadow = activeObject.get('shadow') || {};
    baseAttr.angle = activeObject.get('angle') || 0;
    baseAttr.points = activeObject.get('points') || {};

    const textTypes = ['i-text', 'text', 'textbox'];
    if (textTypes.includes(activeObject.type)) {
      fontAttr.fontSize = activeObject.get('fontSize');
      fontAttr.fontFamily = activeObject.get('fontFamily');
      fontAttr.lineHeight = activeObject.get('lineHeight');
      fontAttr.textAlign = activeObject.get('textAlign');
      fontAttr.underline = activeObject.get('underline');
      fontAttr.linethrough = activeObject.get('linethrough');
      fontAttr.charSpacing = activeObject.get('charSpacing');
      fontAttr.overline = activeObject.get('overline');
      fontAttr.fontStyle = activeObject.get('fontStyle');
      fontAttr.textBackgroundColor = activeObject.get('textBackgroundColor');
      fontAttr.fontWeight = activeObject.get('fontWeight');
    }
  }
};

const selectCancel = () => {
  baseAttr.fill = '';
  update?.proxy?.$forceUpdate();
};

const init = () => {
  // Get font data
  getFreeFontList();

  event.on('selectCancel', selectCancel);
  event.on('selectOne', getObjectAttr);
  canvasEditor.canvas.on('object:modified', getObjectAttr);
};


var c = ref(0);
var m = ref(0);
var y = ref(0);
var k = ref(0);
var cStroke = ref(0);
var mStroke = ref(0);
var yStroke = ref(0);
var kStroke = ref(0);
var cShadow = ref(0);
var mShadow = ref(0);
var yShadow = ref(0);
var kShadow = ref(0);
var testValue = 0;

const changeBackgroundColorFont = () => {
  const cValue = c.value / 100;
  const mValue = m.value / 100;
  const yValue = y.value / 100;
  const kValue = k.value / 100;

  const r = Math.round(255 * (1 - cValue) * (1 - kValue));
  const g = Math.round(255 * (1 - mValue) * (1 - kValue));
  const b = Math.round(255 * (1 - yValue) * (1 - kValue));
  //console.log(`rgb(${r},${g},${b})`);
  let value = `rgb(${r},${g},${b})`;
  // Example usage:
  const hexColor = rgbToHex(r, g, b); // Replace with your RGB values
  testValue = 1;
  changeCommon('textBackgroundColor', hexColor);
  fontAttr.textBackgroundColor = hexColor;
};

const sliderBackgroundColor = (value) => {
  const rgbColor = hexToRgb(value);
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
  c.value = Math.round(((1 - red - black) / (1 - black)) * 100);
  m.value = Math.round(((1 - green - black) / (1 - black)) * 100);
  y.value = Math.round(((1 - blue - black) / (1 - black)) * 100);
  k.value = Math.round(black * 100);
};
const restBackgroundCMYK = () => {
  c.value = 0;
  m.value = 0;
  y.value = 0;
  k.value = 0;
  const hexColor = '#ffffff'; // Replace with your RGB values
  testValue = 1;
  changeCommon('textBackgroundColor', hexColor);
  fontAttr.textBackgroundColor = hexColor;
};

const changeShadowColor = () => {
  const cValue = cShadow.value / 100;
  const mValue = mShadow.value / 100;
  const yValue = yShadow.value / 100;
  const kValue = kShadow.value / 100;

  const r = Math.round(255 * (1 - cValue) * (1 - kValue));
  const g = Math.round(255 * (1 - mValue) * (1 - kValue));
  const b = Math.round(255 * (1 - yValue) * (1 - kValue));
  //console.log(`rgb(${r},${g},${b})`);
  let value = `rgb(${r},${g},${b})`;
  // Example usage:
  const hexColor = rgbToHex(r, g, b); // Replace with your RGB values
  testValue = 1;
  baseAttr.shadow.color = hexColor;
  changeCommon('color', hexColor);
};

const sliderShadowColor = (value) => {
  const rgbColor = hexToRgb(value);
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
  cShadow.value = Math.round(((1 - red - black) / (1 - black)) * 100);
  mShadow.value = Math.round(((1 - green - black) / (1 - black)) * 100);
  yShadow.value = Math.round(((1 - blue - black) / (1 - black)) * 100);
  kShadow.value = Math.round(black * 100);
};
const restShadowCMYK = () => {
  cShadow.value = 0;
  mShadow.value = 0;
  yShadow.value = 0;
  kShadow.value = 0;
  const hexColor = '#ffffff'; // Replace with your RGB values
  testValue = 1;
  changeCommon('color', hexColor);
  fontAttr.textBackgroundColor = hexColor;
};

const changeStrokeColor = () => {
  const cValue = cStroke.value / 100;
  const mValue = mStroke.value / 100;
  const yValue = yStroke.value / 100;
  const kValue = kStroke.value / 100;

  const r = Math.round(255 * (1 - cValue) * (1 - kValue));
  const g = Math.round(255 * (1 - mValue) * (1 - kValue));
  const b = Math.round(255 * (1 - yValue) * (1 - kValue));
  //console.log(`rgb(${r},${g},${b})`);
  let value = `rgb(${r},${g},${b})`;
  // Example usage:
  const hexColor = rgbToHex(r, g, b); // Replace with your RGB values
  testValue = 1;
  changeCommon('stroke', hexColor);
  baseAttr.stroke = hexColor;
};

const sliderStrokeColor = (value) => {
  const rgbColor = hexToRgb(value);
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
  cStroke.value = Math.round(((1 - red - black) / (1 - black)) * 100);
  mStroke.value = Math.round(((1 - green - black) / (1 - black)) * 100);
  yStroke.value = Math.round(((1 - blue - black) / (1 - black)) * 100);
  kStroke.value = Math.round(black * 100);
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
const restStrokeCMYK = () => {
  cStroke.value = 0;
  mStroke.value = 0;
  yStroke.value = 0;
  kStroke.value = 0;
  const hexColor = '#ffff';
  changeCommon('stroke', hexColor);
  fontAttr.textBackgroundColor = hexColor
};

// Modify font
const changeFontFamily = (fontName) => {
  if (!fontName) return;
  // Skip loading properties;
  const skipFonts = ['arial', 'Microsoft YaHei'];
  if (skipFonts.includes(fontName)) {
    const activeObject = canvasEditor.canvas.getActiveObjects()[0];
    activeObject && activeObject.set('fontFamily', fontName);
    canvasEditor.canvas.renderAll();
    return;
  }
  Spin.show();
  // Font loading
  const font = new FontFaceObserver(fontName);
  font
    .load(null, 150000)
    .then(() => {
      const activeObject = canvasEditor.canvas.getActiveObjects()[0];
      activeObject && activeObject.set('fontFamily', fontName);
      canvasEditor.canvas.renderAll();
      Spin.hide();
    })
    .catch(() => {
      Spin.hide();
    });
};

// Common property changes
const changeCommon = (key, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  // Transparency special conversion
  if (key === 'opacity') {
    activeObject && activeObject.set(key, value / 100);
    canvasEditor.canvas.renderAll();
    return;
  }
  // Rotation angle adaptation
  if (key === 'angle') {
    activeObject.rotate(value);
    canvasEditor.canvas.renderAll();
    return;
  }
  activeObject && activeObject.set(key, value);
  canvasEditor.canvas.renderAll();

  // Update properties
  getObjectAttr();
  if (testValue === 0 && key === 'textBackgroundColor') {
    sliderBackgroundColor(value);
  }
  if (testValue === 0 && key === 'textBackgroundColor') {
    sliderBackgroundColor(value);
  }
  if (testValue === 0 && key === 'color') {
    sliderShadowColor(value);
  }
  if (testValue === 0 && key === 'stroke') {
    sliderStrokeColor(value);
  }
  testValue = 0;
};

// Border settings
const borderSet = (key) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject) {
    const stroke = strokeDashList.find((item) => item.label === key);
    activeObject.set(stroke.value);
    canvasEditor.canvas.renderAll();
  }
};

// Shadow settings
const changeShadow = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set('shadow', new fabric.Shadow(baseAttr.shadow));
  canvasEditor.canvas.renderAll();
};

// Bold
const changeFontWeight = (key, value) => {
  const nValue = value === 'normal' ? 'bold' : 'normal';
  fontAttr.fontWeight = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
};

// italics
const changeFontStyle = (key, value) => {
  const nValue = value === 'normal' ? 'italic' : 'normal';
  fontAttr.fontStyle = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
};

// middle stroke
const changeLineThrough = (key, value) => {
  const nValue = value === false;
  fontAttr.linethrough = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
};

// Underline
const changeUnderline = (key, value) => {
  const nValue = value === false;
  fontAttr.underline = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
};

// Modify the number of sides
const changeEdge = (value) => {
  const activeObjects = canvasEditor.canvas.getActiveObjects();
  if (!activeObjects || !activeObjects.length) return;
  activeObjects[0].set(
    'points',
    getPolygonVertices(value, Math.min(activeObjects[0].width, activeObjects[0].height) / 2)
  );
  canvasEditor.canvas.requestRenderAll();
};

onMounted(init);

onBeforeUnmount(() => {
  event.off('selectCancel', selectCancel);
  event.off('selectOne', getObjectAttr);
  canvasEditor.canvas.off('object:modified', getObjectAttr);
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
