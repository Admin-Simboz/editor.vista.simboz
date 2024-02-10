
<template>
    <div class="save-box">

        <Button style="margin-left: 10px" type="text" @click="beforeClear">
            {{ $t('empty') }}
        </Button>


        <Button type="primary" style="margin-left: 10px" @click="saveExitModal">
            {{ $t('saveBtn') }}
        </Button>

    </div>
</template>
  
<script setup name="save-bar">
import { Modal } from 'view-ui-plus';
import useSelect from '@/hooks/select';

import { debounce } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
// import { downloadFile } from '@/utils/utils';



const { t } = useI18n();

const { canvasEditor } = useSelect();
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
    exit() {
        window.location.href = '/admin/product';
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
const saveExit = () => {
    canvasEditor.saveTemplate();
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
const saveExitModal = () => {
    Modal.confirm({
        title: t('tip'),
        content: `<p>${t('saveBtn')}</p>`,
        okText: t('ok'),
        cancelText: t('cancel'),
        onOk: () => saveExit(),
    });
};

</script>
  
<style scoped lang="less">
.save-box {
    display: inline-block;
    padding-right: 10px;
}
</style>
  