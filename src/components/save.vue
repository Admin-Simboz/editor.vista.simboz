
<template>
  <div class="save-box">
    <Button style="margin-left: 10px" type="text" @click="beforeClear">
      {{ $t('empty') }}
    </Button>
    <div>
      <Dropdown style="margin-left: 10px" @on-click="saveWith">
        <Button type="primary">
          {{ $t('keep') }}
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <template #list>
          <DropdownMenu>
            <DropdownItem name="clipboard">{{ $t('copy_to_clipboard') }}</DropdownItem>
            <DropdownItem name="saveImg">{{ $t('save_as_picture') }}</DropdownItem>
            <DropdownItem name="saveSvg">{{ $t('save_as_svg') }}</DropdownItem>
            <DropdownItem name="saveJson" divided>{{ $t('save_as_json') }}</DropdownItem>
            <DropdownItem name="saveTemplate" @click="saveTemplate" divided>{{ $t('save_as_template') }}</DropdownItem>
          </DropdownMenu>
        </template>
      </Dropdown>
    </div>
    =

  </div>
</template>

<script setup name="save-bar">
import { Modal } from 'view-ui-plus';
import useSelect from '@/hooks/select';

import { debounce } from 'lodash-es';
import { useI18n } from 'vue-i18n';
// import { downloadFile } from '@/utils/utils';
import { useStore } from 'vuex';



const { t } = useI18n();

const { canvasEditor } = useSelect();

const store = useStore();
var role = computed(() => store.state.role);
const state = reactive({
  role: role.value,
});
const cbMap = {
  clipboard() {
    canvasEditor.clipboard();
  },

  saveJson() {
    canvasEditor.saveJson();
  },

  saveTemplate() {
    canvasEditor.saveTemplate();
  },

  saveSvg() {
    canvasEditor.saveSvg();
  },

  saveImg() {
    canvasEditor.saveImg();
  },
};

const saveWith = debounce(function (type) {
  cbMap[type] && typeof cbMap[type] === 'function' && cbMap[type]();
}, 300);

/**
 *@desc clear canvas
 */
const clear = () => {
  canvasEditor.clear();
};

const beforeClear = () => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>${t('clearTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => clear(),
  });
};
const userSave = () => {
  canvasEditor.saveExit();
};
</script>

<style scoped lang="less">
.save-box {
  display: inline-block;
  padding-right: 10px;
}
</style>
