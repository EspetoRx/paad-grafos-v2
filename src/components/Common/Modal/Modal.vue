<template>
    <div>
        <div :id="'modal-' + Hash" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header w-100 pt-2 pb-2">
                        <h5 class="modal-title" v-html="title"></h5>
                        <button type="button" class="btn-close" @click="sendModalClose" v-if="showClose"></button>
                    </div>
                    <div class="modal-body w-100" id="modalBody">
                        <slot></slot>
                        <component :is="comp" @value-returned="returnValue"></component>
                    </div>
                    <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { hash } from "../../../utils/Hash";
import { Modal } from 'bootstrap';
import {defineAsyncComponent} from "vue";
export default {
    name: "Modal Component",
    props: {
        disabled: Boolean,
        title: String,
        bodyComponent: String,
        callbackFunction: Function,
        showClose: Boolean
    },
    data() {
        return {
            Hash: hash(),
            bsModalEl: null,
            bsModal: null,
        }
    },
    watch: {
        disabled: function (newValue, oldValue) {
            if (!newValue) {
                this.bsModalEl = document.getElementById('modal-' + this.Hash);
                this.bsModal = new Modal(this.bsModalEl, {
                    backdrop: true,
                    keyboard: true,
                    focus: true,
                    show: true
                });
                this.bsModal.toggle();
            }
            if (this.bodyComponent == 'visjs-configure') {
                this.encapsulateOptions = this.options;
                var container = document.getElementById("modalBody");
                this.encapsulateOptions.configure = {
                    enabled: true,
                    filter: true,
                    container: container,
                    showButton: true
                }
                this.$emit("options-has-changed", this.encapsulateOptions);
            }
        }
    },
    methods: {
        sendModalClose: function () {
            this.bsModal.hide();
            this.$emit("modal-close");
        },
        returnValue: function (value) {
            this.$emit("modal-return-value", value);
            this.sendModalClose();
        }
    },
    mounted() {
        console.log("Modal Component mounted");
    },
    computed: {
        comp () {
            if (this.bodyComponent == "RepaintCanvas") return defineAsyncComponent(() => import('./../Utils/RepaintCanvas.vue'));
        }
    },
    emits: ["modal-close", "modal-return-value"]
}
</script>