<template>
    <div :id="'modal-'+Hash" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content  modal-dialog-scrollable">
                <div class="modal-header w-100">
                    <h5 class="modal-title" v-html="title"></h5>
                    <button type="button" class="btn-close" @click="sendModalClose"></button>
                </div>
                <div class="modal-body w-100" id="modalBody">
                    <component :is="currentCompnent"></component>
                </div>
                <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script>
import { hash } from "../../../utils/Hash";
import { Modal } from 'bootstrap';
export default {
    name: "Modal Component",
    props: {
        disabled: Boolean,
        title: String,
        bodyComponent: String,
        options: Object
    },
    data() {
        return {
            Hash: hash(),
            bsModalEl: null,
            bsModal: null,
            currentCompnent: null,
            encapsulateOptions: null,
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
        sendModalClose: function() {
            console.log("Emitting modal close")
            this.bsModal.hide();
            this.$emit("modal-close");
        }
    },
    mounted() {
        console.log("Modal Component mounted");
        this.encapsulateOptions = this.options;
    },
    emits: ["modal-close", "options-has-changed"]
}
</script>