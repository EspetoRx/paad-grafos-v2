<template>
    <nav id="topNavbar" class="navbar fixed-top navbar-expand-md navbar-light bg-light top-navbar-style">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-lg-0 d-flex align-items-center">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Dropdown
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="#">Action</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                    </li>
                </ul>
                <form class="d-flex">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="search">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                    <div class="dropdown p-1">
                        <button class="btn btn-light dropdown-toggle" type="button" id="dropdownCog"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-gear"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownCog">
                            <li id="toModoNoturno"><a class="dropdown-item" href="#">
                                    <i class="fa-solid fa-cloud-moon"></i> Modo
                                    escuro</a></li>
                            <li><a class="dropdown-item" href="#" id="consoleLogNetwork">Another action</a></li>
                            <li><a class="dropdown-item" href="#" data-bs-toggle="modal"
                                    data-bs-target="#exampleModal">Something else here</a></li>
                            <li data-toggle="tooltip" title="Vis.Js Native Configure HTML DOM."><a class="dropdown-item" href="#" id="offcanvasConfigureButton"
                                    @click.prevent="offcanvasForVisConfigure(); toggleOffCanvas()">
                                    <i class="fa-solid fa-screwdriver-wrench"></i> Vis.JS Configure</a></li>
                            <li data-toggle="tooltip" title="Vis.Js Nodes"><a class="dropdown-item" href="#" id="offcanvasConfigureButton"
                                    @click.prevent="offcanvasForVisNodes(); toggleOffCanvas()">
                                    <i class="fa-solid fa-circle"></i> Vis.JS Vértices</a></li>
                            <li data-toggle="tooltip" title="Vis.Js Physics"><a class="dropdown-item" href="#" id="offcanvasPhysicsButton"
                                    @click.prevent="offcanvasForVisPhysics(); toggleOffCanvas()">
                                    <i class="fa-solid fa-earth-americas"></i> Vis.JS
                                    Física
                                </a></li>

                        </ul>
                    </div>
                </form>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: "Top Navbar",
    mounted() {
        console.log('Top Navbar Component mounted.')
    },
    methods: {
        toggleOffCanvas() {
            this.$emit("toggle-off-canvas");
        },
        offcanvasForVisConfigure() {
            this.$emit("offcanvas-for-vis-configure");
        },
        offcanvasForVisNodes() {
            this.$emit("offcanvas-for-vis-nodes");
        },
        offcanvasForVisPhysics() {
            this.$emit("offcanvas-for-vis-physics");
        }
    },
    emits: [
        'offcanvas-for-vis-configure',
        'toggle-off-canvas',
        'offcanvas-for-vis-physics',
        'offcanvas-for-vis-nodes'
    ],
}
</script>
