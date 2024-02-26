import { apiUrl, apiPath } from './all.js';
import pagination from './components/pagination.js';
import UserModal from './components/userProductModal.js'

const {createApp}  = Vue;

const app = createApp({
    data(){
        return {
            apiUrl,
            apiPath,
            tempProduct: {}, //點選產品
            selectID: '', //點選產品ID
            products : [], //產品菜單
            pages: {}, //產品菜單-頁碼
            carts : [], //購物車菜單
        }
    },
    methods: {
        getProducts(page = 1) {
            const api = `${this.apiUrl}/api/${this.apiPath}/products?page=${page}`;
            axios.get(api)
            .then((res) => {
                this.products = res.data.products;
                this.pages = res.data.pagination;
            })
        },

        openModal(item) {
            this.tempProduct = { ...item };
            //this.$refs.uModal.openModal();
        },


        getCarts() {
            //const api = `${this.apiUrl}/api/${this.apiPath}/cart?page=${page}`;
            const api = `${this.apiUrl}/api/${this.apiPath}/cart`;
            axios.get(api)
            .then((res) => {
                console.log('this.cart', res.data.data);
                console.log('this.cart.carts', res.data.data.carts);
                this.carts = res.data.data;
            })
        },
        updateCart(itemId, qty = 1) {
            let api = `${this.apiUrl}/api/${this.apiPath}/cart`; //預設新增，再來判斷isNew
            let httpMethod = 'post';
            let item = {
                product_id: itemId,
                qty: qty
            }
            // if (!this.isNew) {
            //     api = `${this.apiUrl}/api/${this.apiPath}/cart/${item.id}`
            //     httpMethod = 'put'
            // }
            axios[httpMethod](api, { data: item })
            .then((res) => {
                this.getCarts();
                this.$refs.uModal.closeModal();
            })
            .catch((err) => {
                alert(err.data.message);
            })
        },


        delCart(itemID) {
            let api = `${this.apiUrl}/api/${this.apiPath}/Cart/${itemID}`; //預設新增，再來判斷isNew
            let httpMethod = 'delete';
            axios[httpMethod](api)
            .then((res) => {
                this.getCarts();
            })
            .catch((err) => {
                alert(err.data.message);
            })
        },
        
    },
    created(){

    },
    mounted(){
        this.getProducts();
        this.getCarts();
    },
    components: {
        pagination,
        UserModal,
    }
});

app.mount('#app');