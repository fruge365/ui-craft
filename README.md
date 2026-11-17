# UI-Craft · UI/UX 设计

给 AI 编程助手使用的中文前端设计技能。告诉它谁会用这个页面、在哪种屏幕上用、最常做什么，它会据此选择布局、字阶、配色和交互，并在你的项目中实现。

覆盖 18 类设备形态与场景：企业经营驾驶舱、产线监控墙、指挥大屏、公共信息屏、客厅电视、竖屏数字标牌、自助终端、收银双屏、手持终端、电子价签、腕表、车机与 HUD、AR 眼镜、VR 头显、双屏工位、平板分屏、折叠屏、家居面板；以及企业应用壳层、图标与插画体系、官网、业务系统、App 和微信小程序。

每个样页都由设备的真实约束驱动，不是把同一个界面换个配色。同一批界面里，驾驶舱用深蓝黑高对比、自助机用高明度大热区、腕表用圆屏内切安全区、电子价签用一位元灰阶、折叠屏在形态切换时保住选中项。

[选择开发工具](#按平台安装和使用) · [设备矩阵](#设备矩阵) · [风格速览](#风格速览) · [在线评审台](https://fruge365.github.io/ui-craft/) · [下载技能包](https://github.com/fruge365/ui-craft/releases/download/v11.3.0/ui-craft-v11.3.0.zip)

## 设备矩阵

每个样页都由这台设备的真实约束驱动，不是把同一个界面换个配色。这张表就是技能在做设计判断时使用的依据。

| 设备 / 场景 | 关键约束 | 样页 |
| --- | --- | --- |
| 企业驾驶舱 | 口径显式且全屏同源、KPI 带趋势微图、漏斗标出流失、1920 与 2560 单屏不滚动 | [衡远](https://fruge365.github.io/ui-craft/cockpit.html) |
| 产线监控墙 | 工位状态图、班次产出双条、OEE 三分、控制图带 UCL/LCL、异常在图上直标 | [铸线](https://fruge365.github.io/ui-craft/shopfloor.html) |
| 企业应用壳层 | 导航按权限渲染、命令面板 ⌘K、可排序表格、受限项拒绝写操作、右侧实时审计 | [枢机](https://fruge365.github.io/ui-craft/governance.html) |
| 运营控制台 | 指标随筛选实时计算、完成率环、状态构成、粘性表头、批量核对与撤销 | [北线](https://fruge365.github.io/ui-craft/assets.html) |
| 图标与插画体系 | 24 网格 + 1.8 描边、视觉重量校正、状态图形与色成对、插画分三档、三种空状态不共用 | [格致](https://fruge365.github.io/ui-craft/icons.html) |
| 指挥大屏 · 能源墙 | 远距读数、缺报与零值可区分、单位与时间口径 | [凌日](https://fruge365.github.io/ui-craft/orbital.html) · [江湾](https://fruge365.github.io/ui-craft/bigscreen.html) |
| 客运信息屏 | 几秒内读出班次、闸口与改闸 | [渡口](https://fruge365.github.io/ui-craft/departures.html) |
| 客厅电视 | 十英尺字阶、只用方向键、暗环境、overscan 安全区 | [燕居](https://fruge365.github.io/ui-craft/television.html) |
| 竖屏数字标牌 | 一屏一件事、动态字段坐标固定、无输入 | [厅刊](https://fruge365.github.io/ui-craft/signage.html) |
| 自助终端 | 站立操作、强光对比、已满项给出替代去处、打印回执 | [和济](https://fruge365.github.io/ui-craft/kiosk.html) |
| 收银台双屏 | 店员屏与顾客屏职责分离、两屏数字同源 | [台口](https://fruge365.github.io/ui-craft/pos.html) |
| 手持终端 | 手套热区、一次扫码一个回执、差异行双通道标记 | [仓位](https://fruge365.github.io/ui-craft/pda.html) |
| 电子价签 | 一位元灰阶、刷新闪屏代价、1.2 米远读 | [架签](https://fruge365.github.io/ui-craft/esl.html) |
| 腕表 | 圆屏内切安全区、三个数字两个动作、防误触 | [拾野](https://fruge365.github.io/ui-craft/watch.html) |
| 车机与 HUD | 驻车/行车状态分离、行驶中控件真阻断、降级说明 | [行野](https://fruge365.github.io/ui-craft/vehicle.html) |
| AR 眼镜 | 窄视场两块卡片、锚定真实物体、手势失败回落语音 | [眺望](https://fruge365.github.io/ui-craft/arglass.html) |
| VR 头显 | 注视+确认两步、按视角算目标尺寸、三种降级 | [沉积](https://fruge365.github.io/ui-craft/vr.html) |
| 双屏工位 | 主屏执行、辅屏只读、一条操作一份审计 | [值守](https://fruge365.github.io/ui-craft/dualmonitor.html) |
| 平板分屏 | 选句即批注、批注能回原文、分栏可调内容不跳 | [案头](https://fruge365.github.io/ui-craft/tablet.html) |
| 折叠屏 | 形态变化不重置选中项与滚动位置、折痕避开交互 | [展签](https://fruge365.github.io/ui-craft/foldable.html) |
| 家居面板 | 实测与设定分离、低亮度暖字、情景写清影响范围 | [栖居](https://fruge365.github.io/ui-craft/homepanel.html) |
| 品牌官网 | 主推单品的材质与体量、留白与段落节奏 | [LUMA](https://fruge365.github.io/ui-craft/website.html) |
| 业务平台 | 任务密度、语义用色、搜索筛选与批量处理 | [澄序](https://fruge365.github.io/ui-craft/platform.html) |
| App 与小程序 | 草稿、返回、扫码直达、单手可达 | [栖庭巡检](https://fruge365.github.io/ui-craft/field-app.html) · [报修](https://fruge365.github.io/ui-craft/repair-mini.html) |

## 风格速览

点击截图可打开页面。想在自己的项目中使用某种方向，可以把图下的设计描述与业务需求一起发给技能。

### 企业大屏与运营台

| **集团经营驾驶舱 · 衡远** | **产线监控墙 · 铸线** |
| --- | --- |
| [![深蓝黑驾驶舱，六项指标带迷你趋势、区域气泡图、效率环与告警列表](docs/images/cockpit.png)](https://fruge365.github.io/ui-craft/cockpit.html) | [![深墨绿产线屏，七工位状态图、班次产出双条、OEE 环与壁厚控制图](docs/images/shopfloor.png)](https://fruge365.github.io/ui-craft/shopfloor.html) |
| 集团与区域两种口径切换，全部面板同源刷新。六项指标带趋势微图与同比方向，漏斗标出每段流失。 | 停机的工位在图上直接变灰打叉，超温节点显示实测值。班次时钟与交班倒计时常驻。 |

| **数据治理台 · 枢机** | **设备运行控制台 · 北线** |
| --- | --- |
| [![深色导航加浅色内容区，表格带权限列，右侧是实时审计轨迹](docs/images/governance.png)](https://fruge365.github.io/ui-craft/governance.html) | [![深色运营控制台，四张指标卡带火花线、完成率环、状态构成与粘性表头表格](docs/images/assets-console.png)](https://fruge365.github.io/ui-craft/assets.html) |
| 权限按数据建模，受限行拒绝写操作并给出原因。⌘K 同时搜命令与对象，每个写操作实时进审计。 | 指标随筛选范围实时重算，改动一个条件全部联动。批量核对先列出将加入与将跳过的项。 |

### 设备与工业界面

| **客厅电视 · 燕居** | **自助挂号机 · 和济** |
| --- | --- |
| [![暗底客厅大屏，金色续看标题、横排片单与遥控按键提示](docs/images/television.png)](https://fruge365.github.io/ui-craft/television.html) | [![白底自助机，时段网格、右侧小结与底部出票说明](docs/images/kiosk.png)](https://fruge365.github.io/ui-craft/kiosk.html) |
| 三米外先读到主标题与续看进度。方向键换行、左右选片，确认打开详情，返回回到原选中项。 | 站立状态选时段，已满时段置灰并说明人工窗口去处。摘要固定右上，改选不回头。 |

| **手持终端 · 仓位** | **收银台双屏 · 台口** |
| --- | --- |
| [![黄黑工业手持机，绿底液晶屏上是扫码输入与盘点行](docs/images/pda.png)](https://fruge365.github.io/ui-craft/pda.html) | [![深色收银主屏与浅色顾客副屏并排，金额大字居中](docs/images/pos.png)](https://fruge365.github.io/ui-craft/pos.html) |
| 戴手套也要一次扫对。重复扫描不累加，差异行同时用颜色和符号标出。 | 店员的明细与顾客的金额来自同一份状态，副屏只读不参与计算。 |

| **腕表训练 · 拾野** | **车机与 HUD · 行野** |
| --- | --- |
| [![圆形表壳内的绿色进度环、配速大字与两个圆角按钮](docs/images/watch.png)](https://fruge365.github.io/ui-craft/watch.html) | [![深色座舱屏，上方抬头显示速度与限速，下方媒体卡与车况卡](docs/images/vehicle.png)](https://fruge365.github.io/ui-craft/vehicle.html) |
| 抬腕一秒只读三个数。边缘 12% 不放可点区域，结束训练藏在长按之后。 | 驻车可完整操作，行车只留速度、限速、下一转向与续航，控件真被置灰。 |

| **AR 眼镜 · 眺望** | **VR 头显 · 沉积** |
| --- | --- |
| [![眼镜第一人称视场，绿色虚线安全区与两块锚定卡片](docs/images/arglass.png)](https://fruge365.github.io/ui-craft/arglass.html) | [![双目并排的沉浸视场，中央紫色准星与地层卡片](docs/images/vr.png)](https://fruge365.github.io/ui-craft/vr.html) |
| 窄视场只放两块卡片。内容挂在真实物体上，手势识别失败立刻给出语音后路。 | 注视指向、手势确认，两步之间可取消。追踪丢失、有障碍、晕动各有一套降级。 |

| **双屏工位 · 值守** | **平板分屏 · 案头** |
| --- | --- |
| [![左宽屏排程时间轴，右竖屏告警与历史记录](docs/images/dualmonitor.png)](https://fruge365.github.io/ui-craft/dualmonitor.html) | [![平板内左正文右批注，选中句高亮并挂批注卡](docs/images/tablet.png)](https://fruge365.github.io/ui-craft/tablet.html) |
| 主屏做决定，辅屏查参考。辅屏只读，定位动作把焦点送回主屏。 | 选句即挂批注，点批注能回到原句。宽文视图仍保留追加入口。 |

| **折叠屏 · 展签** | **家居面板 · 栖居** |
| --- | --- |
| [![折叠屏展开双列，中间一条折痕，左侧展品列表右侧详情](docs/images/foldable.png)](https://fruge365.github.io/ui-craft/foldable.html) | [![深色铜饰面板，三个房间旋钮与情景列表](docs/images/homepanel.png)](https://fruge365.github.io/ui-craft/homepanel.html) |
| 合起单列、展开双列。切换形态不丢选中项与滚动位置，折痕处不放交互。 | 实测温度与设定温度分开显示，情景切换要说出影响了哪几个房间。 |

| **图标与插画体系 · 格致** | **电梯厅标牌 · 厅刊** |
| --- | --- |
| [![浅色图标样张，30 枚线性图标网格、重量校正对照、插画三档与三种空状态](docs/images/icons.png)](https://fruge365.github.io/ui-craft/icons.html) | [![竖屏标牌，大标题、三条日程与底部二维码带](docs/images/signage.png)](https://fruge365.github.io/ui-craft/signage.html) |
| 30 枚图标共用 24 网格与 1.8 描边，圆形按墨量放大 6%。状态图形与色成对定义，单色打印仍可辨。 | 十几秒里读出下一场的时间、名称与楼层。动态字段只换值不换位置。 |

| **电子价签 · 架签** | **折叠屏 · 展签** |
| --- | --- |
| [![竖屏标牌，大标题、三条日程与底部二维码带](docs/images/signage.png)](https://fruge365.github.io/ui-craft/signage.html) | [![灰底货架上的纸质价签，促销价与单位价并排](docs/images/esl.png)](https://fruge365.github.io/ui-craft/esl.html) |
| 十几秒里读出下一场的时间、名称与楼层。动态字段只换值不换位置。 | 一位元灰阶没有动画和悬停，价格最大、单位价其次，其余能读即可。 |

<details>
<summary><strong>更多界面风格</strong> · 花艺、蓝晒、赛道、像素、指挥大屏、建筑导览</summary>

| **花艺画册 · 花序** | **工程蓝晒 · 晒图室** |
| --- | --- |
| [![花序以莓红色大标题配整幅桃粉花束摄影](docs/images/bloom.png)](https://fruge365.github.io/ui-craft/bloom.html) | [![钴蓝制图纸上用白色线稿分解家具，用亮黄指出选中的部件](docs/images/blueprint.png)](https://fruge365.github.io/ui-craft/blueprint.html) |
| 用莓果红作底，让花材摄影占据半幅页面。品种、价格与花束尺寸排在另一侧。 | 让整张屏幕成为蓝图，部件的爆炸视图占据中心，亮黄标出正在装配的零件。 |

| **赛道计时 · 折返** | **像素掌机 · 芽间** |
| --- | --- |
| [![朱红跑道、白色斜体分秒与近黑排名带](docs/images/splitline.png)](https://fruge365.github.io/ui-craft/splitline.html) | [![薄荷绿背景、淡紫掌机外壳和像素温室里的专注计时器](docs/images/sprout.png)](https://fruge365.github.io/ui-craft/sprout.html) |
| 用斜体大数字做第一眼的焦点，切换计时点时领跑选手与成绩同步改变。 | 薄荷绿与淡紫机身组成的掌上计时器，像素花床记录已完成的专注段数。 |

| **深色指挥大屏 · 凌日** | **黄黑公共导视 · 渡口** |
| --- | --- |
| [![暗色地球轨迹图、航天器遥测和过站时间窗](docs/images/orbital.png)](https://fruge365.github.io/ui-craft/orbital.html) | [![高对比的离港时刻、登船闸口和方向箭头](docs/images/departures.png)](https://fruge365.github.io/ui-craft/departures.html) |
| 值班员切换目标，在同一幅轨迹图上读出接收窗口。 | 旅客远看时间和闸口，走近后再读船次与延误信息。 |

| **暖白极简 · LUMA 空间音箱** | **淡紫音乐海报 · 声场室内乐周** |
| --- | --- |
| [![暖白背景上的织物音箱、留白和产品标题](docs/images/luma-website.png)](https://fruge365.github.io/ui-craft/website.html) | [![淡紫海报、深色波形和两天的演出日程](docs/images/programme.png)](https://fruge365.github.io/ui-craft/programme.html) |
| 用留白与织物细节呈现产品的材质，适合主推单品的品牌官网。 | 用衬线大标题、波形和日期组织首屏，向下衔接演出日程。 |

| **材料样本馆** | **河岸建筑图志** |
| --- | --- |
| [![石纹、木纹和织物纹理样本排成目录](docs/images/materials.png)](https://fruge365.github.io/ui-craft/materials.html) | [![河岸示意图、编号与地点索引](docs/images/atlas.png)](https://fruge365.github.io/ui-craft/atlas.html) |
| 看纹理选材料，按材质和色调缩小范围，再放进同一张规格表比较。 | 沿示意河道找建筑，再切到地点目录，按编号核对同一站。 |

| **库区作业板** | **早班调度简报** |
| --- | --- |
| [![仓库平面与高亮货位](docs/images/depot.png)](https://fruge365.github.io/ui-craft/depot.html) | [![调度趋势与优先补车站点](docs/images/mobility-desktop.png)](https://fruge365.github.io/ui-craft/mobility.html) |
| 从库区平面或货位目录找同一地址，预览货位后填写盘点。 | 从早高峰趋势判断哪里需要补车，区分实测、缺报与预测。 |

**移动服务 · 栖庭巡检 App 与园区报修小程序**

同一品牌用两种信息密度服务不同用户。左侧给技师看下一项工单和班次，右侧给访客确认地点、选择问题并提交。[打开巡检 App 示例](https://fruge365.github.io/ui-craft/field-app.html) · [打开报修小程序示例](https://fruge365.github.io/ui-craft/repair-mini.html)

![两个手机界面并排，左为青绿的技师巡检班表，右为浅色的访客报修表单](docs/images/qiting-mobile.png)

</details>

## 按平台安装和使用

在目标项目的根目录打开终端，展开你的开发工具，运行对应的**安装命令**。然后在该工具里打开同一个项目，把**调用示例**发到对话中。下面的 `gh` 命令使用 GitHub CLI 的 `skill install` 功能，默认安装到当前项目。[GitHub CLI 安装说明](https://cli.github.com/manual/gh_skill_install)

<details open>
<summary><strong>Codex</strong> · 用 <code>$</code> 点名技能</summary>

```sh
gh skill install fruge365/ui-craft ui-craft@v11.3.0 --agent codex
```

在 Codex 对话中输入 `$`，选择 `ui-craft`，也可以直接发送下面这条需求。

```text
$ui-craft 为港口做一张 1920×1080 的离港大屏。乘客站在三米外，需要先看到下一班船、目的地和闸口。用黄黑导视风格，并为手机提供按时间排列的班表。
```

项目安装位置为 `.agents/skills/ui-craft/`。[Codex 技能文档](https://developers.openai.com/codex/skills/)

</details>

<details>
<summary><strong>Claude Code</strong> · 用 <code>/ui-craft</code> 调用</summary>

```sh
gh skill install fruge365/ui-craft ui-craft@v11.3.0 --agent claude-code
```

在 Claude Code 对话中输入技能名和需求。

```text
/ui-craft 为桌面音箱做一个品牌官网。用暖白背景和大幅产品特写，第一屏能查看两种外壳材质，手机上保留切换入口。
```

项目安装位置为 `.claude/skills/ui-craft/`。[Claude Code 技能文档](https://code.claude.com/docs/en/skills)

</details>

<details>
<summary><strong>Cursor</strong> · 在 Agent 输入框中选择技能</summary>

```sh
gh skill install fruge365/ui-craft ui-craft@v11.3.0 --agent cursor
```

打开 Cursor Agent，输入 `/` 并选择 `ui-craft`，接着输入“把材料目录做成一本饰面样册。用真实纹理作为主图，保留材质和色调筛选，手机上也能比较两个候选。”

项目安装位置为 `.agents/skills/ui-craft/`。[Cursor 技能文档](https://cursor.com/docs/skills)

</details>

<details>
<summary><strong>GitHub Copilot</strong> · 适用于 VS Code Chat 和 Copilot CLI</summary>

```sh
gh skill install fruge365/ui-craft ui-craft@v11.3.0 --agent github-copilot
```

在 VS Code Chat 的 Agent 模式或 Copilot CLI 中输入技能名和需求。

```text
/ui-craft 为仓库值班员设计货位工作台。桌面显示货架平面和选中货位，手机可以按地址找货；库存不足时同时使用文字和符号。
```

项目安装位置为 `.agents/skills/ui-craft/`。已打开的 Copilot CLI 会话可用 `/skills reload` 刷新。[VS Code 用法](https://code.visualstudio.com/docs/agent-customization/agent-skills) · [Copilot CLI 用法](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)

</details>

<details>
<summary><strong>Gemini CLI</strong> · 用 <code>/skills list</code> 查看，在需求中点名</summary>

```sh
gh skill install fruge365/ui-craft ui-craft@v11.3.0 --agent gemini-cli
```

在 Gemini CLI 中输入 `/skills list`，看到 `ui-craft` 后发送“使用 ui-craft 做一个室内乐周官网。用海报式标题，按日期排节目，让观众能收藏跨日场次。”首次激活时按客户端提示继续。

项目安装位置为 `.agents/skills/ui-craft/`。[Gemini CLI 技能文档](https://geminicli.com/docs/cli/skills/)

</details>

<details>
<summary><strong>OpenCode</strong> · 在需求中指定技能名</summary>

```sh
gh skill install fruge365/ui-craft ui-craft@v11.3.0 --agent opencode
```

在 OpenCode 对话中发送“使用 ui-craft 设计城市建筑导览。宽屏把地图与地点索引并排，手机切换视图时保留刚刚选中的建筑。”Agent 会按需加载技能。

项目安装位置为 `.agents/skills/ui-craft/`。[OpenCode 技能文档](https://opencode.ai/docs/skills/)

</details>

<details>
<summary><strong>TRAE 国际版 / TRAE 国内版</strong> · 按版本选择命令</summary>

**国际版**

```sh
gh skill install fruge365/ui-craft ui-craft@v11.3.0 --agent trae
```

**国内版**

```sh
gh skill install fruge365/ui-craft ui-craft@v11.3.0 --agent trae-cn
```

在 TRAE 的智能体对话中发送“用 ui-craft 技能做一个微信报修小程序。访客扫码后能看到房间位置、选择问题并提交，操作区要适合单手使用。”

两个版本的项目安装位置均为 `.trae/skills/ui-craft/`。[TRAE 技能文档](https://docs.trae.cn/ide_skills?lang=zh)

</details>

<details>
<summary><strong>Qwen Code</strong> · 用 <code>/ui-craft</code> 调用</summary>

```sh
gh skill install fruge365/ui-craft ui-craft@v11.3.0 --agent qwen-code
```

在 Qwen Code 输入 `/skills` 可看到已安装的技能。要开始设计，可直接输入技能名和需求。

```text
/ui-craft 设计单车调度的晨班工作台，用一张趋势图和缺车站点列表帮助调度员决定先补哪一站。
```

项目安装位置为 `.qwen/skills/ui-craft/`。[Qwen Code 技能文档](https://qwenlm.github.io/qwen-code-docs/en/users/features/skills/)

</details>

<details>
<summary><strong>Windsurf / Devin Desktop</strong> · 通过 Skills CLI 安装</summary>

在项目根目录运行，Skills CLI 1.7.6 需要 Node.js 22.20 或更高版本。

```sh
npx skills add fruge365/ui-craft --skill ui-craft --agent windsurf --copy
```

在 Devin Desktop 的本地会话中发送“/ui-craft 做一页手机阅读器，支持调整字号、切换纸色，并在换字号后保持阅读位置。”在 Windsurf 会话也可直接写“使用 ui-craft”，再描述页面需求。

此命令写入 `.windsurf/skills/ui-craft/`，Devin Desktop 兼容该项目路径。[Devin Desktop 自定义说明](https://docs.devin.ai/desktop/devin-local/customizations)

</details>

使用其他兼容工具时，可在 [skills.sh](https://www.skills.sh/fruge365/ui-craft/ui-craft) 复制安装命令，运行后从列表选择你的工具。

## 在线评审台

打开 [fruge365.github.io/ui-craft](https://fruge365.github.io/ui-craft/) 可以在浏览器里逐页体验 46 个样页，切换 390 / 1024 / 1440 / 1920 四种画布，并在任意元素上留标注、打视觉评分、导出 JSON 或 Markdown 评审单。

评审台本身用深色外壳刻意压低存在感：被评审的作品是屏幕上唯一的亮面。顶栏只留一个主操作，导入导出收进「更多」菜单。

![深色评审台，左侧样页索引、中央大幅预览与右侧方向说明](docs/images/review-shell.png)

本地启动同一个评审台：

```sh
npm start
```

默认监听 `127.0.0.1:4173`。也可用 `npm start -- 4180` 换端口。标注通过元素选择器与预览尺寸定位，保存在当前浏览器，不经过服务器。

## 设计约束从哪来

技能里的判断不是风格偏好，每一条都能追到一个设备事实：

- **注意力预算**：驾驶一瞥、跑步一秒、排队几分钟，决定信息量与层级数量的上限。
- **触控与视线**：站立操作 48 px、戴手套 44 px、圆屏内切 76%、折痕 30—40 px 不可点。
- **刷新代价**：电子纸整刷闪黑、局部留影，所以价签只写必要信息。
- **形态保持**：折叠屏、分屏、旋转后必须保住选中项与滚动位置。
- **降级路径**：追踪丢失、周边障碍、晕动、断网、打印失败，每种都要有可见的替代动作。
- **状态分离**：驻车与行车、实测与设定、焦点与选中，混在一起就是设计缺陷。
- **口径同源**：大屏上的每个数字都写着统计范围、时间口径与数据延迟；切换口径时全部面板一起变，不允许只换 KPI。
- **权限可见**：导航按权限渲染，受限项拒绝写操作并给出原因与申请入口，而不是点进去撞 403。
- **图形语法**：图标共用网格与描边，圆形按墨量补偿；状态图形与状态色成对定义，任一单独失效仍可辨。
- **插画分档**：说明性、叙事性、数据性三档的画风与尺寸不同；「没数据」「没权限」「加载失败」不能共用一张图。

`skills/ui-craft/references/` 下按场景分开写，共 25 篇，装进项目后按当前任务加载对应的一篇就够。

## 仓库结构

```text
html-review/            评审台与 46 个独立样页，发布到 GitHub Pages
skills/ui-craft/        技能本体：SKILL.md、references/、assets/tokens.css
docs/images/            样页截图
scripts/                发布测试与开发用探针
serve-review.cjs        本地评审服务
```

`npm test` 会检查发布目录只含预期文件、每页离线可渲染、内联脚本可解析、技能与 README 的相对链接都在包内。`scripts/layout-probe.cjs` 与 `scripts/interaction-probe.cjs` 是开发用探针，用无头 Chrome 检查 1440 与 390 两个宽度下的溢出、热区与主路径行为，不参与发布。

## 其他获取方式

| 发布平台 | 如何使用 |
| --- | --- |
| [GitHub Releases](https://github.com/fruge365/ui-craft/releases/tag/v11.3.0) | 下载 `ui-craft-v11.3.0.zip`，解压后把整个 `ui-craft` 文件夹复制到对应平台的技能目录。以 Codex 为例，入口应在 `.agents/skills/ui-craft/SKILL.md`。保留包内的 `SKILL.md`、`references/` 和 `assets/`。 |
| [skills.sh](https://www.skills.sh/fruge365/ui-craft/ui-craft) | 在目标项目执行 `npx skills add fruge365/ui-craft --skill ui-craft`，按提示选开发工具。 |
| [Agent Skill Hub](https://agentskillhub.dev/u/fruge365/sk/ui-craft) | 打开条目，复制 **Install command** 中的 `npx skhub add fruge365/ui-craft`，在目标项目执行。 |

## 命名说明

仓库名与技能名统一为 `ui-craft`。评审台导出的 JSON 仍使用 `schema: forma-review/v1`，样页内的 `data-forma` 属性与 `forma-*` 本地存储键也保留旧前缀——它们是评审台与样页之间的既有契约（导入时按该 schema 判定），改动会让已有的评审文件无法再导入，因此不在改名范围内。