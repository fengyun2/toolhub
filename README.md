# 前端工具大全

## 环境准备

1. 安装依赖
```bash
pnpm install
```

2. 启动
```bash
pnpm tauri dev
```

## 踩坑

- 下载依赖很慢(即第一次运行 `pnpm tauri dev` 很慢)
解决方案: (推荐)
步骤一：设置 Rustup 镜像， 修改配置 `~/.zshrc` or `~/.bashrc`
```bash
export RUSTUP_DIST_SERVER="https://rsproxy.cn"
export RUSTUP_UPDATE_ROOT="https://rsproxy.cn/rustup"
```

步骤二：安装 Rust（请先完成步骤一的环境变量导入并 source rc 文件或重启终端生效）

```bash
curl --proto '=https' --tlsv1.2 -sSf https://rsproxy.cn/rustup-init.sh | sh
```

> 若步骤二提示安装失败，且临时切换到root权限(sudo -i)，再执行一次。

步骤三：设置 crates.io 镜像， 修改配置 `~/.cargo/config`，已支持git协议和sparse协议，>=1.68 版本建议使用 sparse-index，速度更快。

在 `$HOME/.cargo/config.toml` 添加以下内容：
```toml
[source.crates-io]
replace-with = 'rsproxy-sparse'
[source.rsproxy]
registry = "https://rsproxy.cn/crates.io-index"
[source.rsproxy-sparse]
registry = "sparse+https://rsproxy.cn/index/"
[registries.rsproxy]
index = "https://rsproxy.cn/crates.io-index"
[net]
git-fetch-with-cli = true
```
首先，创建一个新的镜像源 [source.ustc]，然后将默认的 crates-io 替换成新的镜像源: replace-with = 'ustc'。

简单吧？只要这样配置后，以往需要去 crates.io 下载的包，会全部从科大的镜像地址下载，速度刷刷的...