<template>
   <div class="mian-body">
    <router-view :seller="seller" keep-alive></router-view>
    <div class="tab border-1px">
      <div class="tab-item">
        <a v-link="{path:'/business'}">外卖</a>
      </div>
      <div class="tab-item">
        <a v-link="{path:'/orders'}">订单</a>
      </div>
      <div class="tab-item">
        <a v-link="{path:'/mine'}">我的</a>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {urlParse} from 'common/js/util';

  const ERR_OK = 0;

  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    created() {
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, response.data);
        }
      });
    },
    components: {
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
  .mian-body
    width: 100%
    height: 100%
    .tab
      position: absolute
      bottom: 0px
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      background: #999
      border-top: 1px solid
      .tab-item
        flex: 1
        text-align: center
        & > a
          display: block
          font-size: 14px
          color: rgb(77, 85, 93)
          &.active
            color: rgb(240, 20, 20)
</style>
