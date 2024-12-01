<template>
    <div aria-live="polite" aria-atomic="true" class="position-relative">
    <div class="toast-container position-fixed top-0 start-50 translate-middle-x mt-1" style="z-index: 1046">
        <ToastComponent
            v-for="(item, i) in toasts"
            :key="i"
            :toastData="item"
            :show="true"
            @toast-hidden="toastHidden"
        ></ToastComponent>
    </div>
    </div>
</template>
<script>
import ToastComponent from './Toast.vue'
export default {
    name: "Toast Container Component",
    props: [
        'newToast'
    ],
    data() {
        return {
            toasts: [],
        }
    },
    watch: {
        newToast: function (newValue, oldValue) {
            this.toasts.push(newValue);
        }
    },
    mounted() {
        console.log("Toast Container mounted");
    },
    methods: {
        toastHidden: function (value) {
            this.toasts = this.toasts.filter(function(item){
                return item !== value
            });
        }
    },
    components: {
        ToastComponent
    }
}
</script>