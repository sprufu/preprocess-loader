# webpack预处理

## 为什么有这个loader

我们产品有些小特性只在部分客户范围使用，而另外的客户则不使用这些特性。一开始我们把这些特性设计成模块，然后使用import函数按需异步加载。这种设计当时是没问题的，但随之小特性不断增多，页面异步加载的模块也越来越多，前端问题就体现出来了。

webpack是个预处理过程，但没有找到类似C语言中预处的插件或loader，于是就有了这个loader，可以针对不同条件情况，在webpack处理阶段就生成不同的版本。

## 配置

```javascript
module.exports = {
  module: {
    rules: [{
      test: /\.(js|html?|css|less|vue)$/,
      loader: 'preprocess-loader',
      options: {
        filename: process.env.PREPROCESS_ENV_FILENAME || '.preprocess-evn',
        watchFile: process.env.NODE_ENV === 'development'
      }
    }]
  }
};
```

## 预处理
### 条件

```
<!-- #IF SOME_ENV -->
<DyComponent/>
<!-- #ENDIF -->

// #IF SOME_EVN
import DyComponent from './DyComponent.vue';
// #ENDIF

export default {
  components: {
    // #IF SOME_EVN
    DyComponent
    // #ENDIF
  }
};
```

### 宏替换

可以在预处理阶段进行宏替换，替换可以对环境变量中直接替换，
一般应该少用宏替换，因为代码会很混乱。可以使用webpack的
[DefinePlugin插件](https://webpack.docschina.org/plugins/define-plugin/)
代替。

```
<!-- html -->
<div>$$NAME$$</div>

<!-- js -->
let name = "$$NAME$$";

<!-- css -->
.selector {
  color: $$color$$;
}
```