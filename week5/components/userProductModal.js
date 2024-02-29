export default {
    props: ['tempProduct', 'addToCart'],
    data() {
        return {
            userModal: null,
            status: {
                addCartLoading: '',
            },
        }
    },
    template: `<div id="userProductModal" ref="userProductModal"  class="modal fade" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                    <span>{{tempProduct.title}}</span>
                </h5>
                    <button type="button" class="btn-close"
                            data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                    <div class="col-sm-6">
                        <img class="img-fluid" src="..." alt="">
                        <template v-if="tempProduct.imagesUrl" v-for="(image, index) in tempProduct.imagesUrl" :key="image">
                            <img :src="image" v-bind:alt="tempProduct.title" class="card-img-top primary-image"
                                v-bind:title="tempProduct.title+':'+tempProduct.description">
                        </template>
                    </div>
                    <div class="col-sm-6">
                        <span class="badge bg-primary rounded-pill">{{ tempProduct.title }}</span>
                        <p>商品描述：{{ tempProduct.description }}</p>
                        <p>商品內容：{{ tempProduct.content }}</p>
                        <div class="h5">{{ tempProduct.origin_price }} 元</div>
                        <del class="h6">原價 {{ tempProduct.origin_price }} 元</del>
                        <div class="h5">現在只要 {{ tempProduct.price }} 元</div>
                        <div>
                        <div class="input-group">
                            <!-- <input type="number" class="form-control" min="1" value="1" v-model="tempProduct.qty"> -->
                            <select  class="form-control" min="1" v-model="tempProduct.qty">
                                <option :value="i" v-for="i in 20" :key="i">{{i}}<option>
                            </select>
                            <button type="button" class="btn btn-primary" 
                                @click="addToCart(tempProduct.id, tempProduct.qty)" :disabled="tempProduct.id === status.addCartLoading">
                                <span v-if="tempProduct.id === status.addCartLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                加入購物車
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    methods: {
        // openModal(item) {
        //     this.userModal.show();
        // },
        closeModal(item) {
            this.userModal.hide();
        },
    },
    mounted() {
        this.userModal = new bootstrap.Modal(this.$refs.userProductModal);
    },
}