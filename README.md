# 奶娃 ChatGPT 桌面主题（实验项目）

奶黄背景、深棕文字、大肚奶娃装饰与圆润组件。保留官方桌面 App，不另做客户端。

**目前不是稳定可安装产品。** OpenChatGPTSkin 主题包通过格式校验和导入，但真实 App 存在适配问题；增强样式曾显示成功，用户反馈卡顿，后已撤掉全局阴影及过渡，性能回归尚未完成。本项目保存设计与实验源码，不承诺全面兼容。

## 目录

```text
theme/
  theme.json                    Schema v4 配色、布局、角色位置
  assets/background.png         奶黄背景
  assets/naiwa.png               奶娃透明素材
scripts/
  Apply-Enhancement.ps1          检查本地会话和端口归属后调用样式脚本
  apply-enhancement.mjs          常驻角色、圆角和边框；支持移除
naiwa-cream-1.0.0.ocskin          最初主题包（不包含增强脚本）
奶娃-原生配色导入.txt            原生配色文本
使用说明.txt                    操作及恢复说明
```

## 使用与恢复

1. 从 https://github.com/u2bo/OpenChatGPTSkin/releases/tag/v0.4.2 下载 Windows x64 工具并核对其 checksums.txt。第三方工具不随仓库提供。
2. 导入 `.ocskin`，保存工作、正常完全退出普通 ChatGPT，再通过该工具应用主题。若适配校验失败，应恢复原始外观。
3. 可选增强层需要 Node.js 22+，在已有本地换肤会话中运行 `powershell.exe -NoProfile -File scripts/Apply-Enhancement.ps1`。它不负责开启调试端口或强制关闭 App。
4. 移除增强层：相同命令追加 `-Restore`。移除第三方基础主题请用工具的恢复功能，正常退出后从官方入口重开。
5. 原生配色文本仅用于官方外观的导入入口，不能在那里导入 `.ocskin`。

不应直接复制以前的本机启动器：它们依赖特定机器路径，不包含在本项目中。

## 已知验证结果

- Schema 校验、打包、本地导入：通过。
- 试验机器 App 包版本：OpenAI.Codex 26.1023.6123.0，窗口名 ChatGPT。
- 最初主题主要角色仅限首页，工具中的附带小装饰过小；普通聊天页显示不符合预期。
- 增强层在真实聊天页显示了 180px 奶娃、16px 按钮圆角及奶黄输入框；后移除阴影与过渡。未完成完整交互、不同窗口尺寸和长期性能测试。
- 同工具的原版“山岚云海”在该 App 上输入框适配校验失败，已撤回；没有将失败宣称为兼容成功。
- 原后台自动加载器随 App 退出而失效；本项目不包含该后台等待器。
- `.ocskin` 只含数据和图片；可选增强层包含 JavaScript 和 CSS，应审查源码后使用。
- 没有修改官方安装文件、签名、账号或聊天记录。不采集或上传聊天内容，增强脚本只连接本机调试端口。

## 素材与权利

素材来自用户指定的 https://github.com/HanYang544/naiwa ，`assets/animation_detailed/laugh_00.png`。未发现明确公开再分发许可；主题配置保持 `localOnly=true`，不授予角色商业使用或再分发权。第三方工具有独立许可，本项目不替它授权。
