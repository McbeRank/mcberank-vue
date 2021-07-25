import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import router from './router';
import store from './store';

// import moment & set up moment locale
import moment from 'moment';
moment.locale(navigator.language);
// moment.relativeTimeThreshold('ss', 45);

// import vue-moment
import VueMoment from 'vue-moment';
Vue.use(VueMoment);

// import axios & set base url
import axios from 'axios';
axios.defaults.baseURL = document.baseURI;

// import Bootstrap-vue
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
