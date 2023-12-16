
<template>
  <div>
    <div class="search-box">
      <Cascader :data="[allType, ...state.materialTypelist]" v-model="state.materialType" @on-change="handleChange">
        <Button icon="ios-menu"></Button>
      </Cascader>
      <Input class="input" :placeholder="state.placeholder" v-model="state.search" search @on-change="search" />
    </div>

    <div :key="item.value" v-for="item in state.materialist">
      <Divider plain orientation="left">{{ item.label }}</Divider>
      <Tooltip :content="info.label" v-for="(info, i) in item.list" :key="`${i}-bai1-button`" placement="top">

        <img class="tmpl-img" :alt="info.label" v-lazy="info.src" @click="beforeClearTip(info.tempUrl)" />
      </Tooltip>

    </div>
  </div>
</template>
  
<script setup name="ImportTmpl" lang="ts">
import useSelect from '@/hooks/select';
import axios from 'axios';
import { Spin, Modal } from 'view-ui-plus';
import { useI18n } from 'vue-i18n';
import { cloneDeep } from 'lodash-es';
import console from 'console';




const { t } = useI18n();
const { canvasEditor } = useSelect();
let templateUrl = "";

interface materialTypeI {
  value: string;
  label: string;
  list?: materialItemI[];
}

interface materialItemI {
  value: string;
  label: string;
  tempUrl: string;
  src: string;
}

const allType: materialTypeI = {
  value: '',
  label: 'all',
};

const state = reactive({
  search: '',
  placeholder: <undefined | string>'',
  jsonFile: <any>null,
  materialType: [''], // Select category
  materialTypelist: <materialTypeI[]>[], // Category List
  materialist: <materialTypeI[]>[], // List content
});

// Get material classification
canvasEditor.getMaterialType('template').then((list: materialTypeI[]) => {
  state.materialTypelist = [...list];
  state.materialist = list;
});

// Insert file
const insertSvgFile = () => {
  canvasEditor.insertSvgFile(state.jsonFile);
};

// Replacement tips
const beforeClearTip = (tmplUrl: string) => {
  templateUrl = tmplUrl;
  Modal.confirm({
    title: t('Warning'),
    content: `<p>${t('replaceTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => getTempData(tmplUrl),
  });
};

const refreshTemplate = () => {
  getTempData(templateUrl);
};

// Get template data
const getTempData = (tmplUrl: string) => {

  Spin.show({
    render: (h) => h('div', t('alert.loading_data')),
  });
  const getTemp = axios.get(tmplUrl);
  getTemp.then((res) => {
    state.jsonFile = JSON.stringify(res.data);
    Spin.hide();
    insertSvgFile();
  });
};
// Switch material type
const handleChange = (e, item) => {
  // Search box text settings
  const { label, value } = item[0];
  state.placeholder = label;
  state.search = '';
  filterTypeList(value);
};

// Template search function
const filterTypeList = (value: string) => {
  // All type
  if (!value) {
    state.materialist = cloneDeep(state.materialTypelist);
  } else {
    // Current category details
    const materialTypeInfoList =
      state.materialTypelist.filter((item) => item.value === value) || [];
    state.materialist = materialTypeInfoList;
  }

  // Show categories
  if (state.search) {
    const list = cloneDeep(state.materialist);
    // Display according to search content
    state.materialist = list.map((item) => {
      if (item.list) {
        item.list = item.list.filter((info) => info.label.includes(state.search));
      }
      return item;
    });
  }
};

const search = () => {
  const [typeValue] = state.materialType;
  filterTypeList(typeValue);
};
</script>
  
<style scoped lang="less">
.search-box {
  padding-top: 10px;
  display: flex;

  .input {
    margin-left: 10px;
  }
}

.tmpl-img {
  width: 132px;
  cursor: pointer;
  margin-right: 5px;
}
</style>
  