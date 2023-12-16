import { reactive } from 'vue';
import axios from 'axios';

// Create a shared reactive object
export const sharedState = reactive({
    front: '',
    back: '', // Initialize value as an empty string
});

// Perform the API call
axios.get("https://vista.simboz.website/api/template/showTemp/144")
    .then((res) => {
        const { data } = res.data;
        if (data && data.front) {
            // Update the value in sharedState once the data is available
            sharedState.front = data.front;
            sharedState.back = data.back;
        } else {
            console.error('Invalid or empty front data');
            // Handle the case when the 'front' data is invalid or empty
        }
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
        // Handle the error here or display an error message
    });
