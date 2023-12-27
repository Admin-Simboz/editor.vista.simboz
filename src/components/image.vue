<template>
    <div>
        <div style="display: inline-block">
            <button @click="insertTypeHand('insertImg')" class="ivu-btn ivu-btn-primary">
                {{ $t('insertFile.upload_image') }}
            </button>
        </div>
        <div :key="item.value" v-for="item in state.materialist">
            <Divider plain orientation="left">{{ item.label }}</Divider>
            <Tooltip :content="info.label" v-for="(info, i) in item.list" :key="`${i}-bai1-button`" placement="top">
                <img class="tmpl-img" :alt="info.label" v-lazy="info.src" @click="beforeClearTip(info.tempUrl)" />
            </Tooltip>
        </div>
    </div>
</template>
  
<script name="ImportFile" lang="ts" setup>
import { getImgStr, selectFiles } from '@/utils/utils';
import useSelect from '@/hooks/select';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { fabric } from 'fabric';


const HANDLEMAP = {

    insertImg: function () {
        selectFiles({ accept: 'image/*', multiple: true }).then((fileList) => {
            Array.from(fileList).forEach((item) => {
                getImgStr(item).then((file) => {
                    // Pass the image name to the sendImage function
                    sendImage(file, item.name);
                });
            });
        });
    },
};

const insertTypeHand = (type) => {
    const cb = HANDLEMAP[type];
    cb && typeof cb === 'function' && cb();
};
// Insert picture file
function insertImgFile(src: File) {
    if (!src) throw new Error('file is undefined');
    const imgEl = document.createElement('img');
    imgEl.src = src;
    // insert page
    document.body.appendChild(imgEl);
    imgEl.onload = () => {
        // Create picture object
        const imgInstance = new fabric.Image(imgEl, {
            id: uuid(),
            name: 'Pic 1',
            left: 100,
            top: 100,
        });
        // Set zoom
        canvasEditor.canvas.add(imgInstance);
        canvasEditor.canvas.setActiveObject(imgInstance);
        canvasEditor.canvas.renderAll();
        // Remove image elements from the page
        imgEl.remove();
    };
}

async function sendImage(file: string, name: string) {

    const formData = new FormData();
    formData.append('image', file);
    formData.append('user_id', '12');
    /* 
        Spin.show({
            render: (h) => h('div', 'Uploading...'),
        }); */

    try {
        const response = await axios.post('https://vista.simboz.website/api/template/uploadImage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        /* Spin.hide(); */
        // Handle the response if needed
    } catch (error) {
        console.error('Error:', error);
        // Handle error, throw, or return a specific value if needed
    }
}


const { canvasEditor } = useSelect();


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
    materialType: [''], // Select category
    materialTypelist: <materialTypeI[]>[], // Category List
    materialist: <materialTypeI[]>[], // List content
});

// Get material classification
canvasEditor.getUserUploads(12).then((list: materialTypeI[]) => {
    //state.materialTypelist = [...list];

    state.materialist = list;
    console.log(state.materialist);
});
const beforeClearTip = (tmplUrl: string) => {

    //getTempData(tmplUrl)
    console.log(tmplUrl);
    insertImgFile(tmplUrl);
};


</script>
  
<style scoped lang="less">
.tmpl-img {
    width: 50%;
    height: 50%;
}
</style>
  