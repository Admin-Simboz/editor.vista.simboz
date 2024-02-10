import { reactive, watch } from 'vue'; // Import reactive and watch from Vue
import axios from 'axios';
import { Spin } from 'view-ui-plus';
import { useStore } from 'vuex';

export const sharedState = reactive({
    front: '',
    back: '',
    frontImgUrl: '',
    backImgUrl: '',
    position: '',
    userId: '',
    productId: '',
    templateHeight: '',
    templateWidth: '',
    frontUrl: '',
    backUrl: '',
    backExsist: '',
    role: '',
});

const fetchData = () => {
    // Show loading spinner
    Spin.show({
        render: (h) => h('div', 'Loading Template'),
    });

    // Make the API call only if userId is not empty
    if (sharedState.userId !== '') {
        axios.get(`https://vista.simboz.website/api/template/showUserTemp/${sharedState.productId}/${sharedState.userId}`)
            .then((res) => {
                const { data } = res.data;
                if (data) {
                    const { front, back, backImgUrl, frontImgUrl, position } = data;
                    if (front !== undefined && front !== null) {
                        sharedState.front = front;
                    }
                    if (back !== undefined && back !== null) {
                        sharedState.back = back;
                    }
                    if (backImgUrl !== undefined && backImgUrl !== null) {
                        sharedState.backImgUrl = backImgUrl;
                    }
                    if (frontImgUrl !== undefined && frontImgUrl !== null) {
                        sharedState.frontImgUrl = frontImgUrl;
                    }
                    if (position !== undefined && position !== null) {
                        sharedState.position = position;
                    }
                } else {
                    // Handle invalid data received from the API
                }
                // Hide loading spinner
                Spin.hide();
            })
            .catch((error) => {
                // Handle error fetching data
                console.error('Error fetching data:', error);
                // Hide loading spinner
                Spin.hide();
            });
    }
};

// Watch for changes in userId and call fetchData function
watch(() => sharedState.userId, () => {
    fetchData();
});

// Call fetchData function initially
fetchData();
