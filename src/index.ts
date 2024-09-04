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
import HelloExample from "@/hello.svelte";

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


} from "@/myapi";

import { SettingUtils } from "./libs/setting-utils";

const STORAGE_NAME = "menu-config";
const TAB_TYPE = "custom_tab";
const DOCK_TYPE = "dock_tab";//之后列出目标服务笔记列表


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

export default class SiYuanLink extends Plugin {

    customTab: () => IModel;
    private settingUtils: SettingUtils;
    private isMobile: boolean;
    async onload() {
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
`);


        //添加图标
        this.addTopBar({
            icon: "iconTransfer",
            title: "数据传输",
            position: "right",
            callback: () => {
                // console.log("TopBar Icon Clicked");
                // this.run();
                // this.catch();//新功能调试
                // this.dbug();
                let rect = document.querySelector("#barPlugins").getBoundingClientRect();
                this.addMenu(rect);
                // showMessage("处理中...");

            }
        });
        this.addTopBar({
            icon: "iconSaving",
            title: "全量备份到alist",
            position: "left",
            callback: () => {
                let rect = document.querySelector("#plugin_siyuan-link_1").getBoundingClientRect();
                this.addMenu2(rect);
                // this.runbackup();
                // showMessage("处理中...");
            }
        });



        this.addDock({
            config: {
                position: "RightTop",
                size: { width: 200, height: 0 },
                icon: "iconSaving",
                title: "Custom Dock",
                hotkey: "⌥⌘W",
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
        new HelloExample({
            target: tabDiv,
            props: {
                app: this.app,
            }
        });
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
    }

    uninstall() {
        console.log("uninstall");
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
                //TODO远程拉取相关（还未改）
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
                    showMessage(`未发现资源文件附件${index}`);
                    console.log(`未发现资源文件附件${index}`);
                }
                index++;
            }
            //数据库文件处理
            showMessage(`成功传输${index}`,-1, "info", "多笔记传输")
            await refreshURL();
        } catch (error) {
            console.error("运行时发生错误:", error);
            showMessage("运行时发生错误:" + error.message);
        }
        showMessage("传输结束!", 6000, "info", "多笔记传输")


    }




    // private async dbug() {
    //     console.log('dbug');
    // }

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

}

