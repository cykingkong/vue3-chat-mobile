<script lang="ts" setup>
import { ref } from 'vue'
import { showToast } from 'vant';
const { t } = useI18n();
const dark = ref<boolean>(isDark.value)

watch(
    () => isDark.value,
    (newMode) => {
        dark.value = newMode
    },
)
const tabList = ['Buy', 'Sell'];
const percentList = ['25%', '50%', '75%', '100%'];
const tabActive = ref<Number>(0);
const percentActive = ref<Number>(0);
const showPicker = ref<boolean>(false);
const unitprice = ref('');
const quantity = ref('');
const pickerValue = ref([]);
const columns = [
    { text: '杭州', value: 'Hangzhou' },
    { text: '宁波', value: 'Ningbo' },
    { text: '温州', value: 'Wenzhou' },
    { text: '绍兴', value: 'Shaoxing' },
    { text: '湖州', value: 'Huzhou' },
];
const onConfirm = ({ selectedValues }) => {
    showToast(`当前值: ${selectedValues.join(',')}`);
};
const onChange = ({ selectedValues }) => {
    showToast(`当前值: ${selectedValues.join(',')}`);
};
const onCancel = () => showToast('取消');

</script>

<template>
    <div class="contract-content">
        <div class="content-left">
            <div class="tab-box flex">
                <div class="tab-item" v-for="(item, index) in tabList" :key="item"
                    :class="{ 'tab-item-active': index === tabActive }" @click="tabActive = index">{{ item }}</div>
            </div>
            <div class="check_price">
                <van-icon name="warning" class="icon"/>{{ 'Current optimal price' }}  <van-icon name="play" class=" icon sanjiaoxia"/>
            </div> 
            <div class="border-box">
               <div class="title">Unit price</div>
               <van-field v-model="unitprice" label="" />
            </div>
            <div class="border-box">
                <div class="title">quantity</div> 
                <van-field v-model="quantity" label="" />
            </div>
            <div class="percent-tab-box">
                <div class="percent-item" v-for="(item, index) in percentList" :key="item" :class="{'percent-item-active': index == percentActive}" @click="percentActive = index">{{ item }}</div>
            </div>
            <div class="a-turnover">
                <div class="flex a-turnover-li">
                    <div class="label">Currently Available</div>
                    <div class="value">USDT</div>
                </div>
                <div class="flex a-turnover-li">
                    <div class="label">Currently Available</div>
                    <div class="value">USDT</div>
                </div>
            </div>
            <div class="btn">{{ tabActive?'Sell BTC':"Buy BTC" }}</div>
        </div>
        <div class="content-right">
            <div class="flex t-box">
                <div class="flex-1 t-item">Unit Price</div>
                <div class="flex-1 t-item">Amount</div>
            </div>
            <div class="dynamic-pricing">
                <div class="li" :class="'price-red'" :style="{backgroundSize:`20% 100%`}">
                    <div class="label">23213</div>
                    <div class="value">321312</div>
                </div>
            </div>
        </div>
        <van-popup v-model:show="showPicker" destroy-on-close round position="bottom">
            <van-picker :model-value="pickerValue" :columns="columns" @cancel="showPicker = false"
                @confirm="onConfirm" />
        </van-popup>

    </div>
</template>

<style lang="less" scoped>
.contract-content {
    display: flex;

    .content-left {
        flex: 1;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding:0 18px;
        .tab-box {
            width: 100%;
            height: 40px;

            .tab-item {
                flex: 1;
                text-align: center;
                padding: 10px 0;
                cursor: pointer;
                position: relative;
                font-size: 17px;

            }

            .tab-item-active::after {
                position: absolute;
                content: '';
                width: 40px;
                height: 2px;
                background: #fff;
                transform: translateX(-50%);
                bottom: 0;
                left: 50%;
            }
        }

        .check_price {
            width: 100%;
            display: flex;
            font-size: 20px;
            .sanjiaoxia{
                // transform:rotate(90deg);
            }
            .icon{
                font-size: 20px;
                flex:1;

            }
        }
        .border-box{
            border: 0.5px solid var(--van-gray-6);
            padding:9px 9px 0 9px;
            border-radius: 4px;
            .title{
                font-size: 15px;
                margin-bottom:8px;
            }
            :deep(.van-cell){
                background: transparent;
                padding:0;
            }
        }
        .percent-tab-box{
            display: flex;
            gap:8px;
            .percent-item{
                flex:1;
                border:0.5px solid var(--van-gray-6);
                border-radius: 4px;
                text-align: center;
                padding: 10px 0;
                cursor: pointer;
                font-size: 10px;
                color:var(--van-text-color3)
            }
            .percent-item-active{
                font-weight: 700;
                font-size: 11px;
                color:var(--van-text-color);
            }
        }
        .a-turnover{
            width: 100%;
            
            .a-turnover-li{
                justify-content: space-between;
                font-size: 11px;
                line-height: 25px;
                color:#838b99;
                .label{
                    text-align: center;
                    min-width:50px;
                }
                .value{

                }
            }
            &:first-child{
                mragin-bottom:12px;
            }
        }
        .btn{
            text-align: center;
            height: 42px;;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
        }
    }

    .content-right {
        flex: 1;
        flex-shrink: 0;
        .t-box{
            height: 40px;
            .t-item{
                display: flex;
                align-items: center;
                justify-content: center;

            }
        }
        .dynamic-pricing{
            .li{
                width: 100%;
                height: 35px;
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                padding:6px 10px 5px 5px;
            }
            .price-red{
                background-image: linear-gradient(rgba(250,82,82,.1),rgba(250,82,82,.1));
            }
        }
    }
}
</style>

<route lang="json5">
{
  name: 'contract',
  meta: {
    title: 'contract',
    i18n: 'menus.contract'
  },
}
</route>
