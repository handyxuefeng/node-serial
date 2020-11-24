import ts from 'rollup-plugin-typescript2'; //解析ts的插件
import { nodeResolve } from '@rollup/plugin-node-resolve';  //解析第三方模块的插件
import serve from 'rollup-plugin-serve'; //启动本地服务的插件
import path from 'path';

export default {
    input: "src/index.ts",
    output: {
        format: "cjs", //commonjs 规范 umd esm(esmodule) iife(立即执行函数)
        file: path.resolve('dist/bundle.js'), //出口文件
        sourcemap: true,
    },
    plugins: [
        nodeResolve({
            extensions: ['.js', '.ts']
        }),
        ts({
            tsconfig: path.resolve(__dirname, 'tsconfig.json')
        })
        /*,
        serve({
            open: true,
            contentBase: "",
            port: 8080,
            openPage: "/public/index.html"
        })
        */
    ]
}

