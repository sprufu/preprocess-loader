import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import Vuex from 'vuex';
import { setAjax as pollSetAjax, setStore as pollSetStore, fetch as startPolling, fetchMessage } from './components/polling';
import { loadCache, putCache, cleanCache } from './components/utils';
import { Notice, Badge } from 'iview';

// 引用路由配置文件
import router from './config/router';

Vue.use(Vuex);

/* global config:true */
Vue.prototype.$config = Object.assign({
  ajaxBaseUrl: '/',
  // systemName: '工作台',
  noticeServer: '',

  // #IF MULTI_THEMES_FEATURE
  // 拥有的主题样式
  themes: [],
  // #ENDIF

  // 是否有内容订阅
  contentSubscribe: false,
  // 是否在首页显示工作足迹
  loggerFeature: true,

  // 消息提醒系统及图标配置
  // [{name: '快办', logo: 'http://kb/logo.png'}]
  messageSystems: [],

  pcLoggerPageSize: 5,
  pcLoggerPageSizeSelectOptions: [5, 10, 20],
  pcShowOnlineChart: true,
  pcHomeNotice: '',

  // pc端头右侧菜单扩展项
  pcHeaderRightExtraItem: '',
  pcHeaderSystemName: '工作台',
  pcHeaderBackgroundImage: '',
  pcHeaderLogoImage: '',

  // 底部文本, 是一个数组，每行一个
  pcFooterTexts: [
    // '主办单位：贵州省人民政府办公厅 | 技术支持：贵州惠智电子技术有限责任公司'
    // , '由云上贵州平台提供云计算能力'
  ],

  // 底部友情连接
  pcFooterFriendlyLinks: [
    // {
    //   text: '贵州省电子政务网',
    //   url: 'http://mh.gz.cegn.cn'
    // }
  ],

  // 待办提醒铃声配置
  // 为了各浏览兼容性，最好选用wav格式
  // 不想播放的话可以留空
  // 要写完整的url，如：http://www.w3school.com.cn/i/horse.ogg
  todoNotificationVoice: '',
  // 声音长度
  todoNotificationVoiceTimeLong: 5000,
  // 提醒间隔毫秒数
  // 在这期间不重复播放声音
  todoNotificationInterval: 600000,
  // 在收到新提醒时抖动系统图标
  shakeLogoOnReceivedNotice: false
}, config);

const store = new Vuex.Store({
  state: {
    user: {},

    // #IF MULTI_THEMES_FEATURE
    // currentTheme: {name: 'red-theme', text: '红色主题'}
    // theme当前使用的主题变量在index.html/index.php中声明
    /* global theme:true */
    currentTheme: config.themes.find(it => it.name === theme),
    // #ENDIF

    displayUserInfo: false,
    messageCount: 0,
    todoCount: 0
  },
  mutations: {
    // #IF MULTI_THEMES_FEATURE
    changeTheme (context, theme) {
      // theme {name: 'red-theme', text: '红色主题'}
      // changeTheme函数（切换主题） 在index.html/index.php中定义
      /* global changeTheme:true */
      changeTheme(theme.name);
      context.currentTheme = theme;
    },
    // #ENDIF

    setUser (context, user) {
      context.user = user;
    },
    showUserInfo (context) {
      context.displayUserInfo = true;
    },
    hideUserInfo (context) {
      context.displayUserInfo = false;
    },
    updateMessageCount (context, count) {
      if (context.messageCount !== count) {
        context.messageCount = count;
      }
    },
    updateTodoCount (context, count) {
      if (context.todoCount !== count) {
        context.todoCount = count;
      }
    }
  }
});

// 使用iview，采用按需要加载方式
Vue.component('Badge', Badge);
Vue.prototype.$Notice = Notice;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = Vue.prototype.$config.ajaxBaseUrl;
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  response => {
    if (response.data.error === 403) {
      // location.href = '/';
    } else if (response.data.error !== 0 && response.data.error !== undefined) {
      if (response.data.message) {
        vue.$Notice.open({
          title: '请求异常',
          desc: response.data.message
        });
      } else {
        vue.$Notice.error({
          desc: '请求异常'
        });
      }
    }
    return response.data;
  }
);
Vue.prototype.$http = axios;

// php运行时预先加载了用户信息, 参见index.php
/* global user:true */
if ('undefined' !== typeof user) {
  initUser(user);
} else {
  axios.get('/work/user/getCurrentUser').then(data => {
    if (data.error === 0) {
      initUser(data.user);
    }
  })
}

function initUser (user) {
  let noticeUrl = config.noticeServer.replace('{uid}', user.uid);
  let cacheUid = loadCache('uid');
  if (cacheUid !== user.uid) {
    cleanCache();
    putCache('uid', user.uid);
  }
  store.commit('setUser', user);
  import(/* webpackChunkName: "notice-listen" */'./components/notice-received').then(({ init, listen }) => {
    init(axios, Vue.prototype.$Notice, store);
    listen(noticeUrl);
  });
}

let vue = new Vue({
  el: '#app',
  store,
  router,
  render (h) {
    return h(App)
  }
});

pollSetAjax(axios);
pollSetStore(store);
startPolling();
if (window.requestIdleCallback) {
  requestIdleCallback(fetchMessage);
} else {
  fetchMessage();
}
