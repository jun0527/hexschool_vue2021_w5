const url = "https://vue3-course-api.hexschool.io/";
const path = "jun0527";
export default {
  data() {
    return {
      productModal: "",
      tempData: {},
      tempQty: 1,
      isLoading: {
        modalArea: true,
        addCart: false
      }
    }
  },
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.productModal, { backdrop: 'static', keyboard: false });
  },
  methods: {
    openModal(productId) {
      this.isLoading.modalArea = true;
      this.productModal.show();
      axios.get(`${url}api/${path}/product/${productId}`)
        .then((res) => {
          if (res.data.success) {
            this.tempData = res.data.product;
            this.tempData.imageUrl = `url(${res.data.product.imageUrl})`
            this.isLoading.modalArea = false;
          } else {
            console.log(res);
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    },
    closeModal() {
      this.productModal.hide();
      this.tempData = {};
      this.tempQty = 1;
      this.isLoading.addCart = false;
    },
    changeQty(status) {
      if (status === "reduce") {
        if (this.tempQty > 0) {
          this.tempQty--;
        }
      } else {
        this.tempQty++;
      }
    },
    addCart(productId, qty) {
      this.isLoading.addCart = true;
      console.log(this.isLoading.addCart);
      if (qty === 0) {
        alert("商品數量不得為0！");
        this.isLoading.addCart = false;
        return;
      }
      this.$emit("add-cart", productId, qty);
    }
  },
  template: `<div ref="productModal" class="modal fade productModal" tabindex="-1">
    <div class="modal-dialog modalWidth">
      <div class="modal-content">
        <div class="modal-header bg-dark">
          <h5 class="modal-title text-white" id="exampleModalLabel">產品介紹</h5>
          <button type="button" class="btn-close btn-close-white" @click="closeModal()"></button>
        </div>
        <div class="loadingArea d-flex justify-content-center align-items-center" v-if="isLoading.modalArea">
          <div class="spinner-border loading" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div class="modal-body row justify-content-between px-5 py-4">
          <div class="imgArea url rounded col-5" :style="{'background-image':tempData.imageUrl}"></div>
          <div class="content col-6 d-flex flex-column justify-content-between">
              <div>
              <h3 class="mb-3">{{tempData.title}}</h3>
              <p>{{tempData.description}}</p>
            </div>
            <div>
              <p class="fs-6 text-decoration-line-through mb-1">原價：NT$ {{ tempData.origin_price }}</p>
              <p class="fs-3">特價：NT$ {{ tempData.price }}<span class="fs-6 mx-1">(每{{tempData.unit}})</span></p>
              <div class="d-flex justify-content-between align-items-end">
                <p class="qtyArea d-flex align-items-center mb-0">購買數量：<i class="fas fa-caret-left" @click="changeQty('reduce')"></i><span>{{tempQty}}</span><i class="fas fa-caret-right" @click="changeQty('add')"></i></p>
                <button type="button" class="btn btn-danger py-2" @click="addCart(tempData.id,tempQty)"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="isLoading.addCart"></span>加入購物車</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`
}
