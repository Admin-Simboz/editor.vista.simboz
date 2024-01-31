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
  role : string;
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
  role : '',
};

const mutations = {
  setMessageFromLaravel(state: RootState, message: string) {
    console.log('setMessageFromLaravel',message);
    state.messageFromLaravel = message;
   
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
