
import {
    Plugin,
    showMessage,
    getFrontend,
    getBackend,
    IModel,
    Menu,
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
    checkAlistConnection

} from "@/myapi";

import { SettingUtils } from "./libs/setting-utils";

const STORAGE_NAME = "menu-config";
const TAB_TYPE = "custom_tab";

export let currentDocId: string | null = null;
export let url: string | null = null;
export let token: string | null = null;
export let serNum: string | null = null;
export let alistname: string | null = null;
export let alistmima: string | null = null;
export let alistUrl: string | null = null;
export let alistToPath: string | null = null;
// let notePath: string | null = null;
export default class PluginSample extends Plugin {

    customTab: () => IModel;
    private settingUtils: SettingUtils;

    async onload() {
        this.data[STORAGE_NAME] = { readonlyText: "Readon" };
        // 图标的制作参见帮助文档
        //图标相关设置
        //添加图标
        this.addIcons(`<symbol id="iconTransfer" viewBox="0 0 32 32">
<path d="M27.414 19.414l-4-4c-0.781-0.781-2.047-0.781-2.828 0s-0.781 2.047 0 2.828l1.586 1.586h-12.172c-1.105 0-2 0.895-2 2s0.895 2 2 2h12.172l-1.586 1.586c-0.781 0.781-0.781 2.047 0 2.828 0.39 0.39 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586l4-4c0.781-0.781 0.781-2.047 0-2.828zM10.586 10.586l-4 4c-0.781 0.781-0.781 2.047 0 2.828 0.39 0.39 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586l1.586-1.586h12.172c1.105 0 2-0.895 2-2s-0.895-2-2-2h-12.172l1.586-1.586c0.781-0.781 0.781-2.047 0-2.828s-2.047-0.781-2.828 0l-4 4c-0.781 0.781-0.781 2.047 0 2.828z"></path>
</symbol>
<symbol id="iconSaving" viewBox="0 0 32 32">
<path d="M20 13.333c0-0.733 0.6-1.333 1.333-1.333s1.333 0.6 1.333 1.333c0 0.733-0.6 1.333-1.333 1.333s-1.333-0.6-1.333-1.333zM10.667 12h6.667v-2.667h-6.667v2.667zM29.333 10v9.293l-3.76 1.253-2.24 7.453h-7.333v-2.667h-2.667v2.667h-7.333c0 0-3.333-11.28-3.333-15.333s3.28-7.333 7.333-7.333h6.667c1.213-1.613 3.147-2.667 5.333-2.667 1.107 0 2 0.893 2 2 0 0.28-0.053 0.533-0.16 0.773-0.187 0.453-0.347 0.973-0.427 1.533l3.027 3.027h2.893zM26.667 12.667h-1.333l-4.667-4.667c0-0.867 0.12-1.72 0.347-2.547-1.293 0.333-2.347 1.293-2.787 2.547h-8.227c-2.573 0-4.667 2.093-4.667 4.667 0 2.507 1.627 8.867 2.68 12.667h2.653v-2.667h8v2.667h2.68l2.067-6.867 3.253-1.093v-4.707z"></path>
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
            title: this.i18n.addTopBarIcon,
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
        //图标相关设置

        //命令面板选项相关设置
        // this.addCommand({
        //     langKey: "chuan",
        //     hotkey: "",
        //     globalCallback: () => {
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
                    outLog(url,"当前目标源地址");
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
                    if(alistUrl!=""){
                    checkAlistConnection(alistname, alistmima);
                    }else{
                        showMessage("未配置备份地址",2000);
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
            description: "备份到alist的路径和文件名",
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
                if(url==""){
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
                if(alistUrl==""){
                    showMessage("请先配置备份地址！");
                    return;
                }
                outLog("备份data");
                this.runbackup();
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
        outLog(url,"当前目标源地址");
        alistmima = this.settingUtils.get("alistToken");
        alistname = this.settingUtils.get("alistname");
        alistUrl = this.settingUtils.get("alistUrl");
        alistToPath = this.settingUtils.get("alistToPath");
        outLog(alistUrl,"当前备份地址");
        outLog(alistname,"当前备份用户名");
        outLog(alistToPath,"当前备份路径");
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
        console.log(this.i18n.byePlugin);
        showMessage("Goodbye SiYuan Plugin");
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
                showMessage("正在传输...",-1,"info","单笔记传输")
                const notePath = await getCurrentNotePath(currentDocId);
                outLog(notePath,"当前笔记路径");
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
            showMessage("传输结束!",6000,"info","单笔记传输")
        }
    }



    // private async dbug() {
    //     console.log('dbug');
    // }

    //全量传输
    private async runpush() {
        showMessage("正在传输...",-1,"info","传输")
        outLog('runpush');
        try {
            const link = await exportAllDataPath();
            // const data = await downloadImage(link);
            await importAllDataURL(await downloadImage(link));
        } catch (error) {
            showMessage("传输失败!",-1,"error","传输")
            console.error('Failed to run runpush:', error);
        }
        showMessage("传输结束!",6000,"info","传输")
    }

    //全量拉取
    private async runpull() {
        showMessage("正在拉取...",-1,"info","拉取")
        outLog('runpull');
        try {
            const link = await exportAllDataPathURL();
            // const data = await downloadImage(link);
            await importAllData(await downloadImageURL(link));
        } catch (error) {
            showMessage("拉取失败!",-1,"error","拉取")
            console.error('Failed to run runpull:', error);
        }
        showMessage("拉取结束!",6000,"info","拉取")
    }

    private async runbackup() {
        showMessage("正在备份...",-1,"info","备份")
        outLog('runbackup');
        try {
        const link = await exportAllDataPath();
        // const data = await downloadImageURL(link);
        const data = await downloadImage(link);
        await uploadToAList(data,alistToPath);
        } catch (error) {
            showMessage("备份失败!",-1,"error","备份")
            console.error('Failed to run runbackup:', error);
        }
        showMessage("备份结束!",6000,"info","备份")
    }

}

