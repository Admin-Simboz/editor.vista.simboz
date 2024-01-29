<template>
    <div>
        <div style="display: inline-block">
            <button id="imageUploadButton" @click="insertTypeHand('insertImg')" class="ivu-btn ivu-btn-primary">
                {{ $t('insertFile.upload_image') }}
            </button>
        </div>
        <div :key="item.value" v-for="item in state.materialist">
            <Divider plain orientation="left">{{ item.label }}</Divider>
            <Tooltip id="uploadedImageContainer" :content="info.label" v-for="(info, i) in item.list"
                :key="`${i}-bai1-button`" placement="top">
                <img class="tmpl-img" :alt="info.label" v-lazy="info.src" @click="beforeClearTip(info.image_id)" />
            </Tooltip>
        </div>
    </div>
</template>
  
<script name="ImportFile" lang="ts" setup>
import { getImgStr, selectFiles } from '@/utils/utils';
import useSelect from '@/hooks/select';
import { v4 as uuid } from 'uuid';
import { fabric } from 'fabric';
import axios from 'axios';
import { Spin } from 'view-ui-plus';



const HANDLEMAP = {

    insertImg: function () {
        selectFiles({ accept: 'image/*', multiple: true }).then((fileList) => {
            Array.from(fileList).forEach((item) => {
                getImgStr(item).then((file) => {
                    // Pass the image name to the sendImage function
                    uploadImage(file, item.name);
                });
            });
        });
    },
};

const insertTypeHand = (type) => {
    const cb = HANDLEMAP[type];
    cb && typeof cb === 'function' && cb();
};

function insertImgFile(file) {
    if (!file) throw new Error('file is undefined');
    const imgEl = document.createElement('img');

    imgEl.src = file;
    // insert page
    document.body.appendChild(imgEl);
    imgEl.onload = () => {
        // Create picture object
        const imgInstance = new fabric.Image(imgEl, {
            id: uuid(),
            name: 'Image',
            scaleX: 1,
            scaleY: 1,
            left: 1,
            top: 1,
        });

        // Set zoom
        canvasEditor.canvas.add(imgInstance);
        canvasEditor.canvas.setActiveObject(imgInstance);
        canvasEditor.canvas.renderAll();
        // Remove image elements from the page
        imgEl.remove();
    };
}

function uploadImage(file, name) {
    canvasEditor.uploadImage(file, name);
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
    image_id: string;
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
canvasEditor.getUserUploads().then((list: materialTypeI[]) => {
    //state.materialTypelist = [...list];
    state.materialist = list;
    //console.log(state.materialist);
});

const beforeClearTip = async (tmplUrl: string) => {
    Spin.show();
    try {

        let response = await axios.get(`127.0.0.1:8000/api/template/getImage/${tmplUrl}`);
        console.log(response.data.image);
        insertImgFile(response.data.image);
        Spin.hide();
    } catch (error) {
        // Handle errors here
        console.error('Error fetching data:', error);
    }
};



</script>
  
<style scoped lang="less">
.tmpl-img {
    width: 100%;
    height: 50%;
}

#imageUploadButton {
    margin: 10px;
}

#uploadedImageContainer {
    background-color: #F6F7F9;
    padding: 6px;
    border-radius: 4px;
    margin: 5px;
}
</style>
  