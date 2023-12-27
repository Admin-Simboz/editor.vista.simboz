import { reactive } from 'vue';
import axios from 'axios';

// Create a shared reactive object with initial empty strings for front and back
export const sharedState = reactive({
    front: '',
    back: '',
    frontImgUrl: '',
    backImgUrl: '',
    position: '',
});
const urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get('id');
// Perform the API call
//axios.get(`https://vista.simboz.website/api/template/showTemp/${id}`)
axios.get(`https://vista.simboz.website/api/template/showTemp/225/front`)
    .then((res) => {
        const { data } = res.data;
        if (data) {
            // Check if 'front' and 'back' fields exist and are not empty
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
            console.error('Invalid data received from the API');
        }
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
        // Handle the error here or display an error message
    });
