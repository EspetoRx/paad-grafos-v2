<template>
    <div :id="'toast-' + Hash" id="liveToast" :class="'toast hide ' + (this.toastData.toastClasses)" role="alert"
        aria-live="assertive" aria-atomic="true" :data-bs-delay="this.toastData.toastDelay??5000" :key="Hash">
        <div class="toast-header">
            <i :class="'fas ' + (this.toastData.toastIcon) + ' me-2'"></i>
            <strong class="me-auto">{{ this.toastData.toastTitle }}</strong>
            <small>{{ this.toastData.toastSmall }}</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            <div v-html="this.toastData.toastBody"></div>
        </div>
    </div>
</template>
<script>
import { hash } from './../../../utils/Hash';
import { Toast } from 'bootstrap';
export default {
    name: "Toast component",
    props: [
        'toastData'
    ],
    data() {
        return {
            shown: null,
            Hash: hash(),
            toastElement: null,
            toast: null,
            batata: null,
        }
    },
    watch: {
        shown: function (newValue, oldValue) {
            if (newValue) this.toast.show();
            else {
                this.$emit('toast-hidden', this.toastData);
            }
        },
        show: function (newValue, oldValue) {
            this.shown = newValue;
        }
    },
    methods: {
        onBsToastHidden: function () {
            this.shown = false;
        },
    },
    mounted() {
        console.log("Toast component mounted " + this.Hash);
        this.toastElement = document.getElementById("toast-" + this.Hash);
        this.toast = new Toast(this.toastElement);
        var self = this;
        this.toastElement.addEventListener("hidden.bs.toast", function () { self.onBsToastHidden(); }, false);
        this.shown = true;
    },
    emits: ['toast-hidden']
}
</script>