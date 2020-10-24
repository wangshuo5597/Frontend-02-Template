### Yeoman

#### 主流脚手架工具，官网链接: <https://yeoman.io/>

#### 实践/踩坑

##### 1. 需要将脚手架项目 package.json 中项目 name 需要加 generaor 前缀,否则不被 yeoman 正确识别。

```
{
    name: generator-[name]
}
```

##### 2. 脚手架 class 会继承 Generator, 脚手架 class 中的方法会被依次执行,

##### 3. 初始化模板文件放在./generator-vue/generators/app/templates 目录.

##### 4. 编写好以后在脚手架项目根目录执行 npm link,然后用 yo [name]运行脚手架，生成初始项目

### Webpack

#### 打包工具，由于原来是面向 NodeJS 开发的，在打包前端项目的亲和性不如后来面向前端项目的打包工具。Vue3.x 可以用 vite 做
