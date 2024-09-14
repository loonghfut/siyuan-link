import { createApp } from "vue";
import App from "./app.vue";
import {
    Plugin,
    showMessage,
    getFrontend,
    getBackend,
    IModel,
    Menu,
    confirm,
} from "siyuan";
import "@/index.scss";
// import * as api from "@/api"
import * as myapi from "@/myapi";

import {
    getCurrentNotePath,
    getNoteData,
    getmd,
    downloadImage,
    putFileContent,
    putFileContentM,
    isconnect,
    notebookId,
    setNotebookConf,
    outLog,
    trunLog,
    getNotebookName,
    refreshURL,
    handleDbResource,
    transferLockAndReadonly,
    // transferLockAndReadonlyDBUG,
    exportAllDataPath,
    downloadImageURL,
    exportAllDataPathURL,
    importAllDataURL,
    // downloadBlob,
    importAllData,
    uploadToAList,
    checkAlistConnection,
    refresh,
    getCurrentNotePathById,

} from "@/myapi";

import { SettingUtils } from "./libs/setting-utils";

const STORAGE_NAME = "menu-config";
const TAB_TYPE = "custom_tab";
const DOCK_TYPE = "dock_tab";//之后列出目标服务笔记列表 done！


export let currentDocId: string | null = null;
export let url: string | null = null;
export let token: string | null = null;
export let serNum: string | null = null;
//alist相关设置  
export let alistname: string | null = null;
export let alistmima: string | null = null;
export let alistUrl: string | null = null;
export let alistToPath: string | null = null;
export let alistFilename: string | null = null;
// let notePath: string | null = null;
let targetURL: string | null = null;
let isclickalist: boolean = true;
export default class SiYuanLink extends Plugin {
    initalist: any;
    alistdock: any = null;
    customTab: () => IModel;
    private settingUtils: SettingUtils;
    private isMobile: boolean;
    async onload() {
        //监听事件
        document.addEventListener("click", this.onlick, true);

        //TODO暂时放弃这种方案
        // this.eventBus.on("paste", this.eventBusPaste);


        const frontEnd = getFrontend();
        this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";
        console.log(frontEnd, this.isMobile);
        this.data[STORAGE_NAME] = { readonlyText: "Readon" };
        // 图标的制作参见帮助文档
        //图标相关设置
        //添加图标
        this.addIcons(`<symbol id="iconTransfer" viewBox="0 0 32 32">
<path d="M27.414 19.414l-4-4c-0.781-0.781-2.047-0.781-2.828 0s-0.781 2.047 0 2.828l1.586 1.586h-12.172c-1.105 0-2 0.895-2 2s0.895 2 2 2h12.172l-1.586 1.586c-0.781 0.781-0.781 2.047 0 2.828 0.39 0.39 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586l4-4c0.781-0.781 0.781-2.047 0-2.828zM10.586 10.586l-4 4c-0.781 0.781-0.781 2.047 0 2.828 0.39 0.39 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586l1.586-1.586h12.172c1.105 0 2-0.895 2-2s-0.895-2-2-2h-12.172l1.586-1.586c0.781-0.781 0.781-2.047 0-2.828s-2.047-0.781-2.828 0l-4 4c-0.781 0.781-0.781 2.047 0 2.828z"></path>
</symbol>
<symbol id="iconSaving"  viewBox="0 0 32 32">
  <path d="M28 22h-24c-1.105 0-2-0.895-2-2v-12c0-1.105 0.895-2 2-2h24c1.105 0 2 0.895 2 2v12c0 1.105-0.895 2-2 2zM4 8v12h24v-12h-24zM16 18l-6-6h4v-4h4v4h4l-6 6zM26 24h-20c-1.105 0-2-0.895-2-2v-2h24v2c0 1.105-0.895 2-2 2z"></path>
</symbol>
<symbol id="iconDataTransferSimple" viewBox="0 0 32 32">
<path d="M4 16h24M16 4v24M4 16l8-8 8 8"/>
</symbol>
<symbol id="iconDataTransferRetro" viewBox="0 0 32 32">
<path d="M4 16h8v-2h-8v2zM20 16h8v-2h-8v2zM4 20h24v-2h-24v2zM16 4v24"/>
</symbol>
<symbol id="iconDataTransferDynamic" viewBox="0 0 32 32">
<path d="M4 16c4-4 12-4 16 0s12 4 16 0M16 4v24M4 16l8-8 8 8M24 16c-4 4-12 4-16 0"/>
</symbol>
<symbol id="iconDataTransferTech" viewBox="0 0 32 32">
<path d="M16 4h-2v24h2zM4 16h24M16 4l8 8-8 8zM8 8h16M24 24h-16"/>
</symbol>
<symbol id="alist" viewBox="0 0 32 32">
  <path id="svg_2" d="m634.37,138.38c11.88,-1.36 24.25,1.3 34.18,8.09c14.96,9.66 25.55,24.41 34.49,39.51c40.59,68.03 81.45,135.91 122.02,203.96c54.02,90.99 108.06,181.97 161.94,273.06c37.28,63 74.65,125.96 112.18,188.82c24.72,41.99 50.21,83.54 73.84,126.16c10.18,17.84 15.77,38.44 14.93,59.03c-0.59,15.92 -3.48,32.28 -11.84,46.08c-11.73,19.46 -31.39,33.2 -52.71,40.36c-11.37,4.09 -23.3,6.87 -35.43,6.89c-132.32,-0.05 -264.64,0.04 -396.95,0.03c-11.38,-0.29 -22.95,-1.6 -33.63,-5.72c-7.81,-3.33 -15.5,-7.43 -21.61,-13.42c-10.43,-10.32 -17.19,-24.96 -15.38,-39.83c0.94,-10.39 3.48,-20.64 7.76,-30.16c4.15,-9.77 9.99,-18.67 15.06,-27.97c22.13,-39.47 45.31,-78.35 69.42,-116.65c7.72,-12.05 14.44,-25.07 25.12,-34.87c11.35,-10.39 25.6,-18.54 41.21,-19.6c12.55,-0.52 24.89,3.82 35.35,10.55c11.8,6.92 21.09,18.44 24.2,31.88c4.49,17.01 -0.34,34.88 -7.55,50.42c-8.09,17.65 -19.62,33.67 -25.81,52.18c-1.13,4.21 -2.66,9.52 0.48,13.23c3.19,3 7.62,4.18 11.77,5.22c12,2.67 24.38,1.98 36.59,2.06c45,-0.01 90,0 135,0c8.91,-0.15 17.83,0.3 26.74,-0.22c6.43,-0.74 13.44,-1.79 18.44,-6.28c3.3,-2.92 3.71,-7.85 2.46,-11.85c-2.74,-8.86 -7.46,-16.93 -12.12,-24.89c-119.99,-204.91 -239.31,-410.22 -360.56,-614.4c-3.96,-6.56 -7.36,-13.68 -13.03,-18.98c-2.8,-2.69 -6.95,-4.22 -10.77,-3.11c-3.25,1.17 -5.45,4.03 -7.61,6.57c-5.34,6.81 -10.12,14.06 -14.51,21.52c-20.89,33.95 -40.88,68.44 -61.35,102.64c-117.9,198.43 -235.82,396.85 -353.71,595.29c-7.31,13.46 -15.09,26.67 -23.57,39.43c-7.45,10.96 -16.49,21.23 -28.14,27.83c-13.73,7.94 -30.69,11.09 -46.08,6.54c-11.23,-3.47 -22.09,-9.12 -30.13,-17.84c-10.18,-10.08 -14.69,-24.83 -14.17,-38.94c0.52,-14.86 5.49,-29.34 12.98,-42.1c71.58,-121.59 143.62,-242.92 215.93,-364.09c37.2,-62.8 74.23,-125.69 111.64,-188.36c37.84,-63.5 75.77,-126.94 113.44,-190.54c21.02,-35.82 42.19,-71.56 64.28,-106.74c6.79,-11.15 15.58,-21.15 26.16,-28.85c8.68,-5.92 18.42,-11 29.05,-11.94z" fill="#70c6be"/>
  <path id="svg_3" d="m628.35,608.38c17.83,-2.87 36.72,1.39 51.5,11.78c11.22,8.66 19.01,21.64 21.26,35.65c1.53,10.68 0.49,21.75 -3.44,31.84c-3.02,8.73 -7.35,16.94 -12.17,24.81c-68.76,115.58 -137.5,231.17 -206.27,346.75c-8.8,14.47 -16.82,29.47 -26.96,43.07c-7.37,9.11 -16.58,16.85 -27.21,21.89c-22.47,11.97 -51.79,4.67 -68.88,-13.33c-8.66,-8.69 -13.74,-20.63 -14.4,-32.84c-0.98,-12.64 1.81,-25.42 7.53,-36.69c5.03,-10.96 10.98,-21.45 17.19,-31.77c30.22,-50.84 60.17,-101.84 90.3,-152.73c41.24,-69.98 83.16,-139.55 124.66,-209.37c4.41,-7.94 9.91,-15.26 16.09,-21.9c8.33,-8.46 18.9,-15.3 30.8,-17.16z" fill="#1ba0d8"/>
</symbol>
<symbol id="iconCloudUpload" viewBox="0 0 32 32">
  <path fill="currentColor" d="M6 22h24v2H6z" class="clr-i-outline clr-i-outline-path-1"/><path fill="currentColor" d="M30.84 13.37A1.94 1.94 0 0 0 28.93 12h-2.38a3 3 0 0 1-.14 2h2.54c1.05 2.94 2.77 7.65 3.05 8.48V30H4v-7.52C4.28 21.65 7.05 14 7.05 14h2.53a3 3 0 0 1-.14-2H7.07a1.92 1.92 0 0 0-1.9 1.32C2 22 2 22.1 2 22.33V30a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2v-7.67c0-.23 0-.33-3.16-8.96" class="clr-i-outline clr-i-outline-path-2"/><path fill="currentColor" d="m18 19.84l6.38-6.35A1 1 0 1 0 23 12.08L19 16V4a1 1 0 1 0-2 0v12l-4-3.95a1 1 0 0 0-1.41 1.42Z" class="clr-i-outline clr-i-outline-path-3"/><path fill="none" d="M0 0h36v36H0z"/>
</symbol>
<symbol id="iconAlist" viewBox="0 0 1252 1252">
  <path id="svg_2" d="m634.37,138.38c11.88,-1.36 24.25,1.3 34.18,8.09c14.96,9.66 25.55,24.41 34.49,39.51c40.59,68.03 81.45,135.91 122.02,203.96c54.02,90.99 108.06,181.97 161.94,273.06c37.28,63 74.65,125.96 112.18,188.82c24.72,41.99 50.21,83.54 73.84,126.16c10.18,17.84 15.77,38.44 14.93,59.03c-0.59,15.92 -3.48,32.28 -11.84,46.08c-11.73,19.46 -31.39,33.2 -52.71,40.36c-11.37,4.09 -23.3,6.87 -35.43,6.89c-132.32,-0.05 -264.64,0.04 -396.95,0.03c-11.38,-0.29 -22.95,-1.6 -33.63,-5.72c-7.81,-3.33 -15.5,-7.43 -21.61,-13.42c-10.43,-10.32 -17.19,-24.96 -15.38,-39.83c0.94,-10.39 3.48,-20.64 7.76,-30.16c4.15,-9.77 9.99,-18.67 15.06,-27.97c22.13,-39.47 45.31,-78.35 69.42,-116.65c7.72,-12.05 14.44,-25.07 25.12,-34.87c11.35,-10.39 25.6,-18.54 41.21,-19.6c12.55,-0.52 24.89,3.82 35.35,10.55c11.8,6.92 21.09,18.44 24.2,31.88c4.49,17.01 -0.34,34.88 -7.55,50.42c-8.09,17.65 -19.62,33.67 -25.81,52.18c-1.13,4.21 -2.66,9.52 0.48,13.23c3.19,3 7.62,4.18 11.77,5.22c12,2.67 24.38,1.98 36.59,2.06c45,-0.01 90,0 135,0c8.91,-0.15 17.83,0.3 26.74,-0.22c6.43,-0.74 13.44,-1.79 18.44,-6.28c3.3,-2.92 3.71,-7.85 2.46,-11.85c-2.74,-8.86 -7.46,-16.93 -12.12,-24.89c-119.99,-204.91 -239.31,-410.22 -360.56,-614.4c-3.96,-6.56 -7.36,-13.68 -13.03,-18.98c-2.8,-2.69 -6.95,-4.22 -10.77,-3.11c-3.25,1.17 -5.45,4.03 -7.61,6.57c-5.34,6.81 -10.12,14.06 -14.51,21.52c-20.89,33.95 -40.88,68.44 -61.35,102.64c-117.9,198.43 -235.82,396.85 -353.71,595.29c-7.31,13.46 -15.09,26.67 -23.57,39.43c-7.45,10.96 -16.49,21.23 -28.14,27.83c-13.73,7.94 -30.69,11.09 -46.08,6.54c-11.23,-3.47 -22.09,-9.12 -30.13,-17.84c-10.18,-10.08 -14.69,-24.83 -14.17,-38.94c0.52,-14.86 5.49,-29.34 12.98,-42.1c71.58,-121.59 143.62,-242.92 215.93,-364.09c37.2,-62.8 74.23,-125.69 111.64,-188.36c37.84,-63.5 75.77,-126.94 113.44,-190.54c21.02,-35.82 42.19,-71.56 64.28,-106.74c6.79,-11.15 15.58,-21.15 26.16,-28.85c8.68,-5.92 18.42,-11 29.05,-11.94z" fill="#70c6be"/>
  <path id="svg_3" d="m628.35,608.38c17.83,-2.87 36.72,1.39 51.5,11.78c11.22,8.66 19.01,21.64 21.26,35.65c1.53,10.68 0.49,21.75 -3.44,31.84c-3.02,8.73 -7.35,16.94 -12.17,24.81c-68.76,115.58 -137.5,231.17 -206.27,346.75c-8.8,14.47 -16.82,29.47 -26.96,43.07c-7.37,9.11 -16.58,16.85 -27.21,21.89c-22.47,11.97 -51.79,4.67 -68.88,-13.33c-8.66,-8.69 -13.74,-20.63 -14.4,-32.84c-0.98,-12.64 1.81,-25.42 7.53,-36.69c5.03,-10.96 10.98,-21.45 17.19,-31.77c30.22,-50.84 60.17,-101.84 90.3,-152.73c41.24,-69.98 83.16,-139.55 124.66,-209.37c4.41,-7.94 9.91,-15.26 16.09,-21.9c8.33,-8.46 18.9,-15.3 30.8,-17.16z" fill="#1ba0d8"/>
</symbol>

`);


        //添加图标
        this.addTopBar({
            icon: "iconTransfer",
            title: "数据传输",
            position: "right",
            callback: () => {
                // if(this.isMobile)
                let rect = document.querySelector("#barPlugins").getBoundingClientRect();
                this.addMenu(rect);
                // showMessage("处理中...");

            }
        });
        this.addTopBar({
            icon: "iconCloudUpload",
            title: "全量备份到alist",
            position: "left",
            callback: () => {
                // console.log(await getCurrentNotePathById(currentDocId));
                let rect = document.querySelector("#plugin_siyuan-link_1").getBoundingClientRect();
                this.addMenu2(rect);
                // this.runbackup();
                // showMessage("处理中...");
            }
        });

        this.addDock({
            config: {
                position: "RightTop",
                size: { width: 250, height: 0 },
                icon: "iconAlist",
                title: "alist网页",
            },
            data: null,
            type: "alist-dock",
            resize() {
                if (this.element.clientWidth == 0) {
                    isclickalist = true;
                } else {
                    isclickalist = false;
                }
            },
            update() {
                // console.log("alist-dock" + " update");
                // console.log(this, "cehsihs8");
                this.element.innerHTML = `<div id="alist-dock" style="height: 100% ; width: 100%;">
                <iframe 
                allow="clipboard-read; clipboard-write"
                sandbox="allow-forms allow-presentation allow-same-origin allow-scripts allow-modals allow-popups" 
                src="${targetURL}" 
                data-src="" 
                border="0" 
                frameborder="no" 
                framespacing="0" 
                allowfullscreen="true" 
                style="height: 99% ; width: 100%;"
                >
                </iframe>
                </div>`;
            },
            init: (dock) => {
                this.alistdock = dock;//将dock赋值给全局变量，以便在其它地方进行后续操作
                dock.element.innerHTML = `<div id="alist-dock" style="height: 100% ; width: 100%;">
                <iframe 
                allow="clipboard-read; clipboard-write"
                sandbox="allow-forms allow-presentation allow-same-origin allow-scripts allow-modals allow-popups" 
                src="${alistUrl}" 
                data-src="" 
                border="0" 
                frameborder="no" 
                framespacing="0" 
                allowfullscreen="true" 
                style="height: 99% ; width: 100%;"
                >
                </iframe>
                </div>`;
            },
            destroy() {
                console.log("destroy dock:", "alist-dock");
            }
        });

        this.addDock({
            config: {
                position: "RightTop",
                size: { width: 300, height: 0 },
                icon: "iconSaving",
                title: "目标源笔记",
            },
            data: null,
            type: DOCK_TYPE,
            resize() {
                console.log(DOCK_TYPE + " resize");
            },
            update() {
                console.log(DOCK_TYPE + " update");

            },
            init: (dock) => {
                dock.element.innerHTML = `<div id="siyuan-link-dock" style="height: 100% ; width: 100%;"></div>`;
                const app = createApp(App, { plugin: this });
                // app.config.globalProperties.$selectedFileIds=[];
                app.mount("#siyuan-link-dock");
            },
            destroy() {
                console.log("destroy dock:", DOCK_TYPE);
            }
        });


        //命令面板选项相关设置
        // this.addCommand({
        //     langKey: "chuan",
        //     hotkey: "",
        //     globalCallback: () => {
        //         confirm("你好，欢迎使用SiYuanLink插件！", "SiYuanLink插件", () => {
        //             showMessage("你好，欢迎使用2222222SiYuanLink插件！");
        //         });

        //         console.log('dd');
        //     },
        // });
        //命令面板选项相关设置

        //插件设置相关
        this.settingUtils = new SettingUtils({
            plugin: this, name: STORAGE_NAME
        });
        this.settingUtils.addItem({
            key: "sykey",
            value: "",
            type: "textinput",
            title: "目标源密钥1",
            description: "要接收数据的目标源密钥1",
            action: {
                // Called when focus is lost and content changes
                callback: async () => {
                    // Return data and save it in real time
                    let value = await this.settingUtils.takeAndSave("sykey");
                    token = value;
                    // console.log(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "syurl",
            value: "",
            type: "textinput",
            title: "目标源网址1",
            description: "要接收数据的目标源的网址1",
            action: {
                // Called when focus is lost and content changes
                callback: async () => {
                    // Return data and save it in real time
                    let value = await this.settingUtils.takeAndSave("syurl");
                    url = value;
                    // console.log(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "sykey2",
            value: "",
            type: "textinput",
            title: "目标源密钥2",
            description: "要接收数据的目标源密钥2",
            action: {
                // Called when focus is lost and content changes
                callback: async () => {
                    // Return data and save it in real time
                    let value = await this.settingUtils.takeAndSave("sykey");
                    token = value;
                    // console.log(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "syurl2",
            value: "",
            type: "textinput",
            title: "目标源网址2",
            description: "要接收数据的目标源的网址2",
            action: {
                // Called when focus is lost and content changes
                callback: async () => {
                    // Return data and save it in real time
                    let value = await this.settingUtils.takeAndSave("syurl");
                    url = value;
                    // console.log(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "Select",
            value: 1,
            type: "select",
            title: "目标源",
            description: "选择目标源",
            options: {
                1: "目标源1",
                2: "目标源2"
            },
            action: {
                callback: async () => {
                    // Read data in real time
                    let value = await this.settingUtils.takeAndSave("Select");
                    serNum = value;
                    console.log(serNum);
                    if (serNum == "1") {
                        url = this.settingUtils.get("syurl");
                        token = this.settingUtils.get("sykey");
                    } else if (serNum == "2") {
                        url = this.settingUtils.get("syurl2");
                        token = this.settingUtils.get("sykey2");
                    }
                    outLog(url, "当前目标源地址");
                }
            }
        });
        this.settingUtils.addItem({
            key: "isconnect",
            value: "",
            type: "button",
            title: "验证服务连接",
            description: "判断是否连接上目标服务和alist服务",
            button: {
                label: "验证",
                callback: () => {
                    showMessage("正在验证...");
                    isconnect();
                    if (alistUrl != "") {
                        checkAlistConnection(alistname, alistmima);
                    } else {
                        showMessage("未配置备份地址", 2000);
                    }
                }
            }
        });
        this.settingUtils.addItem({
            key: "push",
            value: "",
            type: "button",
            title: "全量传输",
            description: "全量传输当前data",
            button: {
                label: "传输",
                callback: () => {
                    showMessage("正在传输...");
                    this.runpush();
                }
            }
        });
        this.settingUtils.addItem({
            key: "pull",
            value: "",
            type: "button",
            title: "全量拉取",
            description: "全量拉取目标服务data",
            button: {
                label: "拉取",
                callback: () => {
                    showMessage("正在拉取...");
                    this.runpull();
                }
            }
        });
        this.settingUtils.addItem({
            key: "islog",
            value: Boolean,
            type: "checkbox",
            title: "是否日志输出",
            description: "控制本插件日志是否输出到控制台",
            action: {
                callback: () => {
                    // Return data and save it in real time
                    let value = !this.settingUtils.get("islog");
                    this.settingUtils.set("islog", value);
                    trunLog(value);
                    outLog(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "readonlyText",
            value: Boolean,
            type: "checkbox",
            title: "是否只读标记",
            description: "控制是否在传输时对笔记内容进行只读标记",
            action: {
                callback: () => {
                    // Return data and save it in real time
                    let value = !this.settingUtils.get("readonlyText");
                    this.settingUtils.set("readonlyText", value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "alistUrl",
            value: "",
            type: "textinput",
            title: "alist服务地址",
            description: "备份到alist的服务地址",
            action: {
                // Called when focus is lost and content changes
                callback: async () => {
                    // Return data and save it in real time
                    let value = await this.settingUtils.takeAndSave("alistUrl");
                    alistUrl = value;
                    // console.log(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "alistname",
            value: "",
            type: "textinput",
            title: "alist用户名",
            description: "备份到alist的用户名",
            action: {
                // Called when focus is lost and content changes
                callback: async () => {
                    // Return data and save it in real time
                    let value = await this.settingUtils.takeAndSave("alistname");
                    alistname = value;
                    // console.log(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "alistToken",
            value: "",
            type: "textinput",
            title: "alist密码",
            description: "备份到alist的密码",
            action: {
                // Called when focus is lost and content changes
                callback: async () => {
                    // Return data and save it in real time
                    let value = await this.settingUtils.takeAndSave("alistToken");
                    alistmima = value;
                    // console.log(value);
                }
            }
        });

        this.settingUtils.addItem({
            key: "alistToPath",
            value: "",
            type: "textinput",
            title: "备份路径",
            description: "备份到alist的路径",
            action: {
                // Called when focus is lost and content changes
                callback: async () => {
                    // Return data and save it in real time
                    let value = await this.settingUtils.takeAndSave("alistToPath");
                    alistToPath = value;
                    // console.log(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "alistFilename",
            value: "",
            type: "textinput",
            title: "默认备份文件名",
            description: "备份到alist的默认文件名(注意要加后缀名eg:siyuan-backup.zip)",
            action: {
                // Called when focus is lost and content changes
                callback: async () => {
                    // Return data and save it in real time
                    let value = await this.settingUtils.takeAndSave("alistFilename");
                    alistFilename = value;
                    // console.log(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "isrefresh",
            value: true,
            type: "checkbox",
            title: "拉取笔记时是否刷新",
            description: "控制拉取笔记时是否刷新页面（建议开启）",
            action: {
                callback: () => {
                    // Return data and save it in real time
                    let value = !this.settingUtils.get("isrefresh");
                    this.settingUtils.set("isrefresh", value);
                }
            }
        });

        try {
            this.settingUtils.load();
        } catch (error) {
            console.error("Error loading settings storage, probably empty config json:", error);
        }
        //插件设置相关
        console.log(this.i18n.helloPlugin);

    }
    //选中菜单设置



    private addMenu(rect?: DOMRect) {
        //退出回调
        const menu = new Menu("topBarSample", () => {
            outLog(this.i18n.byeMenu);
        });
        //添加菜单项
        menu.addItem({
            icon: "iconDataTransferSimple",
            label: "传输当前笔记",
            click: () => {
                if (url == "") {
                    showMessage("请先配置目标源地址！");
                    return;
                }
                outLog("传输当前笔记");
                this.run();
                // this.dbug();
            }
        });
        menu.open({
            x: rect.right,
            y: rect.bottom,
            isLeft: true,
        });
    }

    private addMenu2(rect?: DOMRect) {
        //退出回调
        const menu = new Menu("topBarSample2", () => {
            outLog(this.i18n.byeMenu);
        });
        //添加菜单项
        menu.addItem({
            icon: "",
            label: "备份data",
            click: () => {
                if (alistUrl == "") {
                    showMessage("请先配置备份地址！");
                    return;
                }
                confirm("请给备份文件取个名字 ^_^", `<style>
        #alistFilename {
            width: 100%;
            padding: 4px;
            color: #fff; /* 设置文字为白色 */
            background-color: #333; /* 设置背景颜色为深色 */
            border: 1px solid #007BFF;
            border-radius: 4px;
            font-size: 14px;
            outline: none;
        }
        #alistFilename:focus {
            border-color: #007BFF;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        }
    </style>
    文件名: <input type="text" id="alistFilename" value="${alistFilename}">`, () => {
                    const inputElement = document.getElementById("alistFilename") as HTMLInputElement;
                    const inputValue = inputElement.value;
                    if (inputValue) {
                        outLog("正在备份..." + inputValue);
                        outLog("备份data");
                        this.runbackup(inputValue);
                    } else {
                        showMessage("没有输入文件名，备份取消。");
                        return;
                    }
                });

                // this.runbackup();
                // this.dbug();
            }
        });
        menu.open({
            x: rect.left,
            y: rect.bottom,
            isLeft: false,
        });
    }




    onLayoutReady() {

        this.settingUtils.load();
        console.log(`frontend: ${getFrontend()}; backend: ${getBackend()}`);
        serNum = this.settingUtils.get("Select");
        if (serNum == "1") {
            url = this.settingUtils.get("syurl");
            token = this.settingUtils.get("sykey");
        } else if (serNum == "2") {
            url = this.settingUtils.get("syurl2");
            token = this.settingUtils.get("sykey2");
        }
        outLog(url, "当前目标源地址");
        alistmima = this.settingUtils.get("alistToken");
        alistname = this.settingUtils.get("alistname");
        alistUrl = this.settingUtils.get("alistUrl");
        alistToPath = this.settingUtils.get("alistToPath");
        alistFilename = this.settingUtils.get("alistFilename");
        outLog(alistUrl, "当前备份地址");
        outLog(alistname, "当前备份用户名");
        outLog(alistToPath, "当前备份路径");
        outLog(alistFilename, "当前备份文件名");
        trunLog(this.settingUtils.get("islog"));
        outLog('cseffsddfsfdsfdfd');


        let tabDiv = document.createElement("div");

        this.customTab = this.addTab({
            type: TAB_TYPE,
            init() {
                this.element.appendChild(tabDiv);
                console.log(this.element);
            },
            beforeDestroy() {
                console.log("before destroy tab:", TAB_TYPE);
            },
            destroy() {
                console.log("destroy tab:", TAB_TYPE);
            }
        });

        //获取当前文档ID
        this.eventBus.on("switch-protyle", (event) => {
            currentDocId = event.detail.protyle.block.id;
            console.log("Current document ID:", currentDocId);
        });
        //获取当前文档ID
    }



    //插件卸载相关
    async onunload() {
        // console.log(this.i18n.byePlugin);
        showMessage("Goodbye ");
        console.log("onunload");

        this.eventBus.off("paste", this.eventBusPaste);
        document.removeEventListener("click", this.onlick, true);
    }

    uninstall() {
        console.log("uninstall");

        this.eventBus.off("paste", this.eventBusPaste);
        document.removeEventListener("click", this.onlick, true);
    }
    //插件卸载相关

    //写插件实现功能的函数
    private async run() {
        if (currentDocId) {
            try {
                showMessage("正在传输...", -1, "info", "单笔记传输")
                const notePath = await getCurrentNotePath(currentDocId);
                outLog(notePath, "当前笔记路径");
                //获取文字数据并保存
                //是否标记只读
                if (this.settingUtils.get("readonlyText")) {
                    await putFileContent(notePath, await transferLockAndReadonly(await getNoteData(notePath)));
                } else {
                    await putFileContent(notePath, await getNoteData(notePath));
                }
                //处理数据库资源文件
                handleDbResource(currentDocId);
                //修改目标服务笔记配置
                //0.0.6: 这里的notebookId可能是空的，导致无法修改笔记配置
                await setNotebookConf(notebookId, await getNotebookName(notebookId));
                //获取资源路径并下载
                const links = await getmd(currentDocId);
                if (links) {
                    for (const link of links) {
                        console.log(link);
                        console.log('1');
                        const imageData = await downloadImage(link);
                        putFileContentM(link, imageData);
                    }
                } else {
                    showMessage("未发现资源文件附件");
                    console.log("未发现资源文件附件");
                }
                //数据库文件处理
                await refreshURL();
            } catch (error) {
                console.error("运行时发生错误:", error);
                showMessage("运行时发生错误:" + error.message);
            }
            showMessage("传输结束!", 6000, "info", "单笔记传输")
        }
    }

    public async pullNote(currentDocIds: string[]) {
        try {
            let index = 0;
            for (const currentDocId of currentDocIds) {
                showMessage(`正在传输${index}...`, -1, "info", "多笔记传输")
                const notePath = await getCurrentNotePath(currentDocId, false, true);
                outLog(notePath, "当前笔记路径");
                //获取文字数据并保存
                //是否标记只读 
                //远程拉取相关
                if (this.settingUtils.get("readonlyText")) {
                    await putFileContent(notePath, await transferLockAndReadonly(await getNoteData(notePath, true)), false);
                } else {
                    await putFileContent(notePath, await getNoteData(notePath, true), false);
                }
                //处理数据库资源文件
                handleDbResource(currentDocId);
                //修改目标服务笔记配置
                //0.0.6: 这里的notebookId可能是空的，导致无法修改笔记配置
                await setNotebookConf(notebookId, await getNotebookName(notebookId, true), false);
                //获取资源路径并下载
                const links = await getmd(currentDocId, true);
                if (links) {
                    for (const link of links) {
                        console.log(link);
                        console.log('1');
                        const imageData = await downloadImageURL(link);
                        putFileContentM(link, imageData, false);
                    }
                } else {
                    showMessage(`未发现资源文件附件${index}`);
                    console.log(`未发现资源文件附件${index}`);
                }
                index++;
            }
            //数据库文件处理
            showMessage(`成功传输${index}`, -1, "info", "多笔记传输")
            if (this.settingUtils.get("isrefresh")) {
                await refresh();
            }
        } catch (error) {
            console.error("运行时发生错误:", error);
            showMessage("运行时发生错误:" + error.message);
        }
        showMessage("传输结束!", 6000, "info", "多笔记传输")


    }






    //全量传输
    private async runpush() {
        showMessage("正在传输...", -1, "info", "传输")
        outLog('runpush');
        try {
            const link = await exportAllDataPath();
            // const data = await downloadImage(link);
            await importAllDataURL(await downloadImage(link));
        } catch (error) {
            showMessage("传输失败!", -1, "error", "传输")
            console.error('Failed to run runpush:', error);
        }
        showMessage("传输结束!", 6000, "info", "传输")
    }

    //全量拉取
    private async runpull() {
        showMessage("正在拉取...", -1, "info", "拉取")
        outLog('runpull');
        try {
            const link = await exportAllDataPathURL();
            // const data = await downloadImage(link);
            await importAllData(await downloadImageURL(link));
        } catch (error) {
            showMessage("拉取失败!", -1, "error", "拉取")
            console.error('Failed to run runpull:', error);
        }
        showMessage("拉取结束!", 6000, "info", "拉取")
    }

    private async runbackup(alistFilename: string) {
        showMessage("正在备份...", -1, "info", "备份")
        outLog('runbackup');
        try {
            const link = await exportAllDataPath();
            // const data = await downloadImageURL(link);
            const data = await downloadImage(link);
            await uploadToAList(data, alistToPath + "/" + alistFilename);
        } catch (error) {
            showMessage("备份失败!", -1, "error", "备份");
            console.error('Failed to run runbackup:', error);
        }
        showMessage("备份结束!", 6000, "info", "备份")
    }
    //点击链接触发的事件
    onlick = (e) => {
        // console.log(e.target);
        if (
            e.target.dataset &&
            e.target.dataset.type == "a" &&
            e.target.dataset.href
        ) {
            try {
                console.log(e.target.dataset.href);
                this.isrecall(e.target, e);
            } catch (e) {
                console.error(e);
            }
        }
    };

    isrecall(target: any, e: any) {
        if (!target.dataset.href) {
            return;
        } else {
            const isContained = myapi.isUrlContained(target.dataset.href, alistUrl);
            // console.log(isContained);
            if (isContained) {
                const buttonAlist = document.querySelector('span[data-type="siyuan-linkalist-dock"]');
                // console.log(buttonAlist, 'buttonAlist');
                if (buttonAlist) {
                    // 手动触发点击事件
                    if (isclickalist) {//判断是否点击
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        buttonAlist.dispatchEvent(clickEvent);
                    }

                    if (this.alistdock) {//判断是否存在
                        targetURL = target.dataset.href;
                        this.alistdock.update();
                    } else {
                        //首次点击，以初始化
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        buttonAlist.dispatchEvent(clickEvent);
                        if (this.alistdock) {//判断是否存在
                            targetURL = target.dataset.href;
                            this.alistdock.update();
                        } else {
                            console.error('Alist dock not found');
                        }
                        // console.error('Alist dock not found');
                    }
                } else {
                    console.error('Span element not found');
                }


                // console.log(this.alistdock,'this.alistdock');

                e.preventDefault();
                e.stopPropagation();
            }
        }
    }

    private eventBusPaste(event: any) {
        // 如果需异步处理请调用 preventDefault， 否则会进行默认处理
        event.preventDefault();
        showMessage("Paste event triggered");
        console.log(event);
        const pasttext = event.detail.textPlain;
       
        console.log(pasttext);
       
        // 如果使用了 preventDefault，必须调用 resolve，否则程序会卡死
        event.detail.resolve({
            textPlain: event.detail.textPlain.trim(),
        });
    }
}

// handleUrl(protocol, target:any) {

// }


