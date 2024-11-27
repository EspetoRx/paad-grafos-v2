import 'bootstrap';
import * as Vue from 'vue';
import './scss/app.scss';

const app = Vue.createApp({});

import appComponent from './App.vue';
app.component('app-component', appComponent);
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-icon');

app.mount('#app');