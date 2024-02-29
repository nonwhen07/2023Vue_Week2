import { apiUrl, apiPath } from './all.js';
import pagination from './components/pagination.js';
import UserModal from './components/userProductModal.js'

const {createApp}  = Vue;

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = createApp({
    data(){
        return {
            apiUrl,
            apiPath,
            tempProduct: {}, //點選產品
            selectID: '', //點選產品ID
            products : [], //產品菜單
            pages: {}, //產品菜單-頁碼
            carts: [], //購物車菜單

            status: {
                checkProduct:'',
                addCartLoading: '',
                delCart: '',
            },

            isLoading: false, //loading狀態
            //購物車user
            user: {
                name:'',
                email: '',
                tel: '',
                address: '',
            },
            message: '', //購物車user-message
        }
    },
    methods: {
        openModal(item) {
            this.status.checkProduct = item.id;
            this.tempProduct = { ...item };
            //this.status.checkProduct = '';
            setTimeout(() => {
                this.status.checkProduct = '';
            }, 200);
        },
        getProducts(page = 1) {
            const api = `${this.apiUrl}/api/${this.apiPath}/products?page=${page}`;
            axios.get(api)
            .then((res) => {
                this.products = res.data.products;
                this.pages = res.data.pagination;
            })
            .catch((err) => {
                alert(err.data.message);
                this.isLoading = false;
            })
        },
        getCarts() {
            const api = `${this.apiUrl}/api/${this.apiPath}/cart`;
            axios.get(api)
            .then((res) => {
                // console.log('this.cart', res.data.data);
                // console.log('this.cart.carts', res.data.data.carts);
                this.carts = res.data.data;
            })
            .catch((err) => {
                alert(err.data.message);
                this.isLoading = false;
            })
        },
        addToCart(itemId, qty = 1) {
            this.status.addCartLoading = itemId;
            let api = `${this.apiUrl}/api/${this.apiPath}/cart`; //預設新增，再來判斷isNew
            let httpMethod = 'post';
            let item = {
                product_id: itemId,
                qty: qty
            }
            axios[httpMethod](api, { data: item })
            .then((res) => {
                this.getCarts();
                this.$refs.uModal.closeModal();
                this.status.addCartLoading = '';
            })
            // .catch((err) => {
            //     alert(err.data.message);
            //     this.status.addCartLoading = '';
            // })
        },
        // addToCart(item) {
        //     this.status.addCartLoading = itemId;
        //     let api = `${this.apiUrl}/api/${this.apiPath}/cart`; //預設新增，再來判斷isNew
        //     let httpMethod = 'post';
        //     let dataItem = {
        //         product_id: item.id,
        //         qty: item.qty
        //     }
        //     axios[httpMethod](api, { data: dataItem })
        //     .then((res) => {
        //         this.getCarts();
        //         this.$refs.uModal.closeModal();
        //         this.status.addCartLoading = '';
        //     })
        //     // .catch((err) => {
        //     //     alert(err.data.message);
        //     //     this.status.addCartLoading = '';
        //     // })
        // },
        delCart(itemID) {
            this.status.delCart = itemID;
            let api = `${this.apiUrl}/api/${this.apiPath}/cart/${itemID}`; //預設新增，再來判斷isNew
            let httpMethod = 'delete';
            axios[httpMethod](api)
            .then((res) => {
                this.getCarts();
                this.status.delCart='';
            })
            // .catch((err) => {
            //     alert(err.data.message);
            //     this.status.delCart='';
            // })
        },
        delAllCart() {
            this.status.delCart = 'delAll';
            let api = `${this.apiUrl}/api/${this.apiPath}/carts`; //預設新增，再來判斷isNew
            let httpMethod = 'delete';
            axios[httpMethod](api)
            .then((res) => {
                this.getCarts();
                this.status.delCart='';
            })
            // .catch((err) => {
            //     alert(err.data.message);
            //     this.status.delCart='';
            // })
        },
        onSubmit(item){

        },
    },
    created(){
    },
    mounted(){
        //VueLoading作為'元件'使用方式
        this.isLoading = true;
        this.getProducts();
        this.getCarts();
        //VueLoading作為'元件'使用方式
        setTimeout(() => {
            this.isLoading = false; //狀態驅動'元件'
        }, 1000);
        //VueLoading作為'插件'使用方式
        // const loader = this.$loading.show(); //方法驅動'插件'
        // setTimeout(() => {
        //     loader.hide()
        // }, 1000);
    },
    components: {
        pagination,
        UserModal,
    }
});

//VueLoading作為元件使用方式
app.component('loading', VueLoading.Component);
//VueLoading作為插件使用方式
//app.use(VueLoading.LoadingPlugin);

//註冊全域的表單驗證元件（VForm, VField, ErrorMessage）
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');