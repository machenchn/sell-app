<template>
  <div class="business" v-link="{path:'/shop/goods'}">
    <div class="foods-wrapper" v-el:foods-wrapper>
      <ul>
        <li class="food-list food-list-hook">
          <h1 class="title">推荐商家</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in business" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.avatar">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <star :size="24" :score="seller.score"></star>
                  <div class="message">
                    <span>{{food.foodScore}}</span>
                    <span class="count">月售{{food.sellCount}}份</span>
                  </div>
                </div>
                <div class="price">
                      <img src="decrease_4@2x.png" alt="" class="img">
                      <span class="text">{{food.supports[0].description}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <span class="icon-favorite" :class="{'active':favorite}"></span>
                  <span class="text">{{favoriteText}}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';
  import star from 'components/star/star';

  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        business: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      },
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.business.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

      this.$http.get('/api/business').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.business = response.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
    },
    methods: {
      selectMenu(index, event) {
        if (!event._constructed) {
          return;
        }
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      },
      _drop(target) {
        // 体验优化,异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
      _initScroll() {
        this.meunScroll = new BScroll(this.$els.menuWrapper, {
          click: true
        });

        this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
          click: true,
          probeType: 3
        });

        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food,
      star
    },
    events: {
      'cart.add'(target) {
        this._drop(target);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .business
    display: flex
    position: absolute
    bottom: 60px
    width: 100%
    overflow: hidden
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .star
            height: 12px
            margin-bottom: 8px
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            position: absolute
            right: 84px
            top: 25px
          .extra
            .count
              margin-right: 12px
            .message
              position: absolute;
              left: 140px;
              top: 26px;
          .price
            font-weight: 700
            line-height: 12px
            .img
              height: 12px
              vertical-align: middle;
            .text
              font-size: 12px
              vertical-align: middle;
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 30px
            .icon-favorite
              display: block
              margin-bottom: 4px
              line-height: 24px
              font-size: 24px
              color: #d4d6d9
              &.active
                color: rgb(240, 20, 20)
            .text
              line-height: 10px
              font-size: 10px
              color: rgb(77, 85, 93)
</style>