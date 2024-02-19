import { apiUrl, apiPath } from './all.js';
//引用Vue
const { createApp } = Vue;
// 建立元件 生成Vue應用程式 渲染至畫面上
const app = {
  data() {
    return {
      // apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      // apiPath: 'jeff_hexschool',
      apiUrl,
      apiPath,
      user: {
          username: '',
          password: ''
      }
    }
  },
  methods: {
    signIn () {
      const api = `${this.apiUrl}/admin/signin`;
      axios.post(api, this.user)
        .then((res) => {
          const { token, expired } = res.data
          document.cookie = `shopToken=${token}; expires=${new Date(expired)}`;
          window.location.assign("./productList.html");
        })
        .catch((err) => {
            alert('登入資料有誤，請確認帳號密碼');
        })
    }
    }
};

createApp(app).mount('#mainApp');