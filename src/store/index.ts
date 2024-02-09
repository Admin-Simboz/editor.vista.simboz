// store.ts
import { createStore, Commit } from 'vuex';

export interface RootState {
  messageFromLaravel: string;
  userId : string;
  product_id : string;
  token : string;
  template_height :  string;
  template_width : string;
  front_img_url : string;
  back_img_url : string;
  role : boolean;
  back: boolean;
  
}

const state: RootState = {
  messageFromLaravel: '',
  userId :'',
  product_id : '',
  token : '',
  template_height :  '',
  template_width : '',
  front_img_url : '',
  back_img_url : '',
  back: false,
  role :false,
};

const mutations = {
  setMessageFromLaravel(state: RootState, message: any) {
    //console.log('setMessageFromLaravel',message);
    message = '{"userId":1,"product_id":"30","template_height":72,"template_width":36,"front_img_url":"null","back":false,"role":false}';
  
    /* state.messageFromLaravel = message; */
    if (message && typeof message === 'string') {
      try {
        const parsedMessage = JSON.parse(message);
        state.userId = parsedMessage.userId;
        state.product_id = parsedMessage.product_id;
        state.token = parsedMessage.token;
        state.template_height = parsedMessage.template_height;
        state.template_width = parsedMessage.template_width;
        state.front_img_url = parsedMessage.front_img_url; 
        state.back_img_url = parsedMessage.back_img_url; 
        state.role = parsedMessage.role;
        state.back = parsedMessage.back;
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    }
    },
};

const actions = {
  setInitialData({ commit }: { commit: Commit }, initialData: string) {
    console.log('setInitialData',initialData)
    commit('setMessageFromLaravel', initialData);
  },
};

const getters = {
  // Add getters if needed
};

const store = createStore<RootState>({
  state,
  mutations,
  actions,
  getters,
});

export default store;
