const url = "https://vue3-course-api.hexschool.io/";
const path = "jun0527";
export default {
  data() {
    return {
      submitModal: "",
      user: {},
      message: "",
      cartData: {},
      loading: {
        submit: false
      }
    }
  },
  mounted() {
    this.submitModal = new bootstrap.Modal(this.$refs.submitModal, { backdrop: 'static', keyboard: false })
  },
  methods: {
    openModal(user, message, cartData) {
      this.user = user;
      this.message = message;
      this.cartData = cartData;
      this.submitModal.show();
    },
    closeModal() {
      this.submitModal.hide();
    },
    submitOrder() {
      this.loading.submit = true;
      let obj = {
        data: {
          user: this.user,
          message: this.message
        }
      };
      axios.post(`${url}api/${path}/order`, obj)
        .then((res) => {
          if (res.data.success) {
            alert("訂單送出成功！");
            this.$emit("getCartData");
            this.$emit("clearData");
            this.closeModal();
            this.loading.submit = false;
          } else {
            alert("訂單送出失敗！");
            this.closeModal();
            this.loading.submit = false;
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    }
  },
  template: `<div class="modal fade" ref="submitModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header bg-dark">
        <h5 class="modal-title text-white" id="exampleModalLabel">訂單確認</h5>
        <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
      </div>
      <div class="modal-body">
        <p>收件人姓名：{{user.name}}</p>
        <p>收件人email：{{user.email}}</p>
        <p>收件人電話：{{user.tel}}</p>
        <p>收件人地址：{{user.address}}</p>
        <p>留言：{{message}}</p>
          <p>訂單內容：</p>
        <div class="orderContent">
          <p v-for="item in cartData.carts" :key="item.id">{{item.product.title}} x {{item.qty}}</p>
          <p class="total">總金額：{{cartData.final_total}}</p>
        </div>
        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
        <button type="button" class="btn btn-primary" @click="submitOrder"><span class="spinner-border spinner-border-sm"
        role="status" aria-hidden="true" v-if="loading.submit"></span>送出訂單</button>
      </div>
    </div>
  </div>
</div>`
}