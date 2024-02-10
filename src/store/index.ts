// store.ts
import { createStore, Commit } from 'vuex';

export interface RootState {
  messageFromLaravel: string;
  userId : string;
  productId : string;
  token : string;
  templateHeight :  string;
  templateWidth : string;
  frontUrl : string;
  backUrl : string;
  role : boolean;
  backExsist: boolean;
  
}

const state: RootState = {
  messageFromLaravel: '',
  userId :'',
  productId : '',
  token : '',
  templateHeight :  '',
  templateWidth : '',
  frontUrl : '',
  backUrl : '',
  backExsist: false,
  role :false,
};

const mutations = {
  setMessageFromLaravel(state: RootState, message: any) {
    //console.log('setMessageFromLaravel',message);
    message = '{"userId":31,"product_id":"30","template_height":72,"template_width":36,"front_img_url":"null","back":false,"role":false}';
  
    /* state.messageFromLaravel = message; */
    if (message && typeof message === 'string') {
      try {
        const parsedMessage = JSON.parse(message);
        state.userId = parsedMessage.userId;
        state.productId = parsedMessage.product_id;
        state.token = parsedMessage.token;
        state.templateHeight = parsedMessage.template_height;
        state.templateWidth = parsedMessage.template_width;
        state.frontUrl = parsedMessage.front_img_url; 
        state.backUrl = parsedMessage.back_img_url; 
        state.role = parsedMessage.role;
        state.backExsist = parsedMessage.back;
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
