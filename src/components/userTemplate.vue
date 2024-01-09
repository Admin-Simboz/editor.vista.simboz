
<template>
    <div class="preview-image">
        <div class=" section" @click="addTemplate('front')">
            <div class="image-frame">
                <img id="image" :src=frontImgUrl>
            </div>
            <div class="frontButton">
                <p>Front</p>
            </div>
        </div>
        <div class=" section" @click="addTemplate('back')">
            <div class="image-frame">
                <img id="image" :src=backImgUrl>
            </div>
            <div class="frontButton">
                <p>Back</p>
            </div>
        </div>
    </div>
</template>
  
<script name="userTemplate" lang="ts" setup>
import { Spin, Modal } from 'view-ui-plus';
import useSelect from '@/hooks/select';
import axios from 'axios';
import { sharedState } from '@/components/sharedState.js'; // Import the shared state
import { ref, watch } from 'vue';

const { canvasEditor }: any = useSelect();

const front = ref<string | null>(null);
const frontImgUrl = ref<string | null>(null);
const back = ref<string | null>(null);
const backImgUrl = ref<string | null>(null);


const addTemplate = async (value: string) => {

    if (value === "front") {
        // console.log('add temp user');
        canvasEditor.toggleTemplate(value);
    }

    if (value === "back") {
        // console.log('add temp user');
        canvasEditor.toggleTemplate(value);
    }
};

//runs when the sharedState change in the toggleTemp inside ServerPlugins.ts 
const getUserTemplate = () => {
    if (sharedState.front) {
        back.value = sharedState.back;
        frontImgUrl.value = sharedState.frontImgUrl;
        backImgUrl.value = sharedState.backImgUrl;
        front.value = sharedState.front;
        if (sharedState.position === 'front') {
            canvasEditor.insertSvgString(sharedState.front);
        } else {
            canvasEditor.insertSvgString(sharedState.back);
        }

    }
};

// Watch for changes in sharedState.front and call addTemplate when it becomes available
watch(sharedState, (newVal) => {
    getUserTemplate();
});


</script>
  
<style lang="less" scoped>
#image {
    width: 100%;
}

.preview-image {
    background-color: #dee3ed;
    border-radius: 4px;
    padding: 5px;
    margin: 5px;
    border: 8px;
    border-color: aqua;
    position: relative;
    display: flex;

}

.section {
    border-radius: 8px;
    padding: 15px;
    margin: 5px;
    background-color: #f6f7f8;
    border: 2px solid #c3bfbf;

}

p {
    text-align: center;
}
</style>
  