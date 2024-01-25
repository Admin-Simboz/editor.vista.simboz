// store.ts
import { createStore, Commit } from 'vuex';

export interface RootState {
  messageFromLaravel: string;
}

const state: RootState = {
  messageFromLaravel: '',
};

const mutations = {
  setMessageFromLaravel(state: RootState, message: string) {
    console.log('setMessageFromLaravel',message)
    state.messageFromLaravel = message;
  },
};

const actions = {
  setInitialData({ commit }: { commit: Commit }, initialData: string) {
    console.log('setInitialData',initialData)
    var jsonObject= JSON.parse(initialData);
    commit('setMessageFromLaravel', jsonObject.message);
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
