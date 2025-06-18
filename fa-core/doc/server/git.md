# Git
## Git Submodule

clone项目，并且初始化submodule子项目
```
git clone --recurse-submodules git@github.com:FaberSober/fa-admin.git
```

初始化submodule
```
git submodule init
```

拉去submodule项目文件到本地
```
git submodule update
```

删除submodule项目
```
git submodule deinit fa-app
```

### 备注
1. 删除项目后，在项目路径`.git\modules`删除同名文件夹
