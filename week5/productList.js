import { apiUrl, apiPath } from './all.js';
import pagination from './components/pagination.js';
import ProdModal from './components/productModal.js'
import DelModal from './components/delProductModal.js';

const { createApp } = Vue;

const app = createApp({
    data(){
        return {
        // apiUrl: 'https://vue3-course-api.hexschool.io/v2',
        // apiPath: 'jeff_hexschool',
        apiUrl,
        apiPath,
        isNew: false,
        tempProduct: {}, //點選產品
        selectID: '', //點選產品ID
        products : [], //產品菜單
        pages: {}, //產品菜單-頁碼

        //productModal: null, 
        //delModal: null,
        }
    },
    methods: {
        checkSignIn() {
        const api = `${this.apiUrl}/api/user/check`;
        axios.post(api)
        .then((res) => {
            this.getProducts();
            //後台確認Orders用
            this.getOrders();
        })
        .catch((err) => {
            alert('請重新登入，將轉回登入頁面');
            window.location.assign("login.html");
        })
        },
        getProducts(page = 1) {
            const api = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
            axios.get(api)
            .then((res) => {
                this.products = res.data.products;
                this.pages = res.data.pagination;
            })
        },
        openModal(isNew, item) {
            if (isNew) {
                this.tempProduct = {}
            } 
            else {
                this.tempProduct = { ...item }
            }
            this.isNew = isNew
        },
        updataProduct(item) {
            let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`; //預設新增，再來判斷isNew
            let httpMethod = 'post'
            if (!this.isNew) {
                api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${item.id}`
                httpMethod = 'put'
            }
            axios[httpMethod](api, { data: item })
            .then((res) => {
                this.isNew = false;
                this.getProducts();
                this.$refs.pModal.closeModal(); 
            })
            .catch((err) => {
                alert(err.data.message);
            })
        },
        delProduct(itemID) {
            let api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${itemID}`; //預設新增，再來判斷isNew
            let httpMethod = 'delete';
            axios[httpMethod](api)
            .then((res) => {
                this.getProducts();
                this.$refs.dModal.closeModal();
            })
            .catch((err) => {
                alert(err.data.message);
            })
        },
        addImage() {
        if (this.tempProduct.imagesUrl === undefined){
            this.tempProduct.imagesUrl = [];
        }
        const addImageUrl = document.getElementById('addImageUrl').value;
        this.tempProduct.imagesUrl.push(addImageUrl);
        },
        delImage(index) {
        this.tempProduct.imagesUrl.splice(index, 1);
        },

        //後台確認Orders用
        getOrders() {
            const api = `${this.apiUrl}/api/${this.apiPath}/admin/orders`;
            axios.get(api)
            .then((res) => {
                console.log('this.Order =>', res.data);
                console.log('this.Order.Orders =>', res.data.orders);
            })
            .catch((err) => {
                alert(err.data.message);
            })
            // 刪除訂單(all)
            // const api2 = `${this.apiUrl}/api/${this.apiPath}/admin/orders/all`;
            // axios.delete(api2)
            // .then((res) => {
            //     console.log('this.Order =>', res);
            //     //console.log('this.Order.Orders =>', res.data.orders);
            // })
            // .catch((err) => {
            //     alert(err.data.message);
            // })
        },

        
    },
    created(){
        const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)shopToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
        );
        axios.defaults.headers.common["Authorization"] = token;
        this.checkSignIn();
    },
    mounted() {
        //this.productModal = new bootstrap.Modal(this.$refs.productModal);
        //this.delModal = new bootstrap.Modal(this.$refs.delProductModal);
    },
    components: {
        pagination,
        ProdModal,
        DelModal
    }
});

app.mount('#app');