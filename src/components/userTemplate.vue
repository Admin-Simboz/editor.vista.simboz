
<template>
    <div class="preview-image">
        <div class="section" @click="addTemplate('front')">
            <div class="image-frame">
                <img id="image" src="dist/images/test.png">
            </div>
            <div class="frontButton">
                <p>Front</p>
            </div>
        </div>
        <div class="section" @click="addTemplate('back')">
            <div class="image-frame">
                <img id="image" src="dist/images/test.png">
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

const increment = () => {
    console.log('test');
    // Modify the shared state
};

increment();






const { canvasEditor }: any = useSelect();


const addTemplate = async (value: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    id = '5'; // For testing purposes

    if (id) {
        Spin.show({
            render: (h) => h('div', 'Loading Template'),
        });

        try {
            const response = await axios.get(
                `https://vista.simboz.website/api/template/showTemp/144`,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );

            // Process response directly without using .then()
            var data = JSON.stringify(response.data);
            console.log(data);
            canvasEditor.insertSvgFile(data.data);
            Spin.hide();

        } catch (error) {
            console.log("Failed to load");
            Spin.hide();
        }
    }
};
addTemplate('back');


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
    margin-top: 150px;

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
  