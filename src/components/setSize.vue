

<template>
  <div v-if="!mixinState.mSelectMode">
    <div v-if="modalData.role">
      <Divider plain orientation="left">{{ $t('size') }} (Inch)</Divider>
      <Form :label-width="40" class="form-wrap">
        <FormItem :label="$t('width')" prop="name">
          <InputNumber v-model="width" @on-change="setSize"></InputNumber>
        </FormItem>
        <FormItem :label="$t('height')" prop="name">
          <InputNumber v-model="height" @on-change="setSize"></InputNumber>
        </FormItem>
      </Form>
      <Button type="primary" @click="() => (showModal = true)">Resize</Button>
    </div>
    <Modal v-model="showModal" :title="$t('setSizeTip')" @on-ok="handleConfirm" @on-cancel="handleClose">
      <p>{{ $t('default_size') }}</p>
      <ButtonGroup vertical style="margin: 10px 0">
        <Button v-for="(item, i) in presetSize" :key="`${i}presetSize`" size="small" style="text-align: left"
          @click="setSizeBy(item.width, item.height)">
          {{ item.label }}:{{ item.width }}x{{ item.height }}
        </Button>
      </ButtonGroup>

      <Form :label-width="40" class="form-wrap" style="justify-content: flex-start">
        <FormItem :label="$t('width')" prop="name" style="margin-right: 10px">
          <InputNumber :min="1" :max="5000" v-model="modalData.width"></InputNumber>
        </FormItem>
        <FormItem :label="$t('height')" prop="name">
          <InputNumber :min="1" v-model="modalData.height"></InputNumber>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script setup name="CanvasSize">
import { Modal } from 'view-ui-plus';
import useSelect from '@/hooks/select';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const store = useStore();
const template_height = computed(() => store.state.templateHeight);
const template_width = computed(() => store.state.templateWidth);
const role = computed(() => store.state.role);
const mountedHandler = async () => {
  try {
    // Wait for the fetchDataFromLaravel action to complete
    await store.dispatch('fetchDataFromLaravel');
    canvasEditor.setSize(template_width.value * 96, template_height.value * 96)
    modalData.role = role.value;
    console.log('test role', role.value);
    console.log('test modal', modalData.role);

  } catch (error) {
    console.error('Error fetching data from Laravel:', error);
  }
};

onMounted(mountedHandler);


const { mixinState, canvasEditor } = useSelect();
const { t } = useI18n();

const DefaultSize = {

  width: template_width,
  height: template_height,
};

const showModal = ref(false);
const modalData = reactive({
  width: DefaultSize.width,
  height: DefaultSize.height,
  role: false,
});
let width = ref(DefaultSize.width);
let height = ref(DefaultSize.height);
let presetSize = reactive([
  {
    label: t('red_book_vertical'),
    width: 900,
    height: 1200,
  },
  {
    label: t('red_book_horizontal'),
    width: 1200,
    height: 900,
  },
  {
    label: t('phone_wallpaper'),
    width: 1080,
    height: 1920,
  },
  {
    label: 'kindle',
    width: 1200,
    height: 860,
  },
  {
    label: 'kindle-resize',
    width: 860,
    height: 1200,
  },
]);

onMounted(() => {
  canvasEditor.setSize(width.value * 96, height.value * 96);
  canvasEditor.on('sizeChange', (width, height) => {
    width.value = width;
    height.value = height;

  });

  // canvas.editor.editorWorkspace.setSize(width.value, height.value);
  // canvas.editor.editorWorkspace = new EditorWorkspace(canvas.c, {
  //   width: width.value,
  //   height: height.value,
  // });
});

const setSizeBy = (w, h) => {
  modalData.width = w;
  modalData.height = h;
};
const setSize = () => {
  const inchesToPixelsWidth = width.value * 96;
  const inchesToPixelsHeight = height.value * 96;
  canvasEditor.setSize(inchesToPixelsWidth, inchesToPixelsHeight);
};


const handleClose = () => {
  showModal.value = false;
};

const handleConfirm = () => {
  const inchesToPixelsNewWidth = modalData.width * 96;
  const inchesToPixelsNewHeight = modalData.height * 96;
  width.value = modalData.width;
  height.value = modalData.height;
  canvasEditor.setSize(inchesToPixelsNewWidth, inchesToPixelsNewHeight);
  handleClose();
};

</script>

<style scoped lang="less">
:deep(.ivu-form-item) {
  margin-bottom: 0;
}

:deep(.ivu-divider-plain) {
  &.ivu-divider-with-text-left {
    margin: 10px 0;
    font-weight: bold;
  }
}

.form-wrap {
  display: flex;
  justify-content: space-around;
  align-content: center;
  margin-bottom: 10px;
}
</style>
