import 'bootstrap';
import * as Vue from 'vue';
import { createApp } from 'vue'
import './sass/app.scss';

const app = Vue.createApp({});

import appComponent from './App.vue';
app.component('app-component', appComponent);

app.mount('#app');