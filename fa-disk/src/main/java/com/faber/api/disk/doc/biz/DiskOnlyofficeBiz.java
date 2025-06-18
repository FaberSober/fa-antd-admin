package com.faber.api.disk.doc.biz;

import cn.hutool.core.util.StrUtil;
import cn.hutool.extra.spring.SpringUtil;
import com.faber.api.base.admin.biz.FileSaveBiz;
import com.faber.api.base.admin.biz.UserBiz;
import com.faber.api.base.admin.entity.FileSave;
import com.faber.api.base.doc.dto.Action;
import com.faber.api.base.doc.dto.Track;
import com.faber.api.base.doc.manager.jwt.JwtManager;
import com.faber.api.base.doc.models.enums.DocumentType;
import com.faber.api.base.doc.models.enums.Mode;
import com.faber.api.base.doc.models.enums.Type;
import com.faber.api.base.doc.models.filemodel.Document;
import com.faber.api.base.doc.models.filemodel.EditorConfig;
import com.faber.api.base.doc.models.filemodel.FileModel;
import com.faber.api.base.doc.utils.FaFileUtility;
import com.faber.api.base.doc.vo.ret.OpenFileRetVo;
import com.faber.api.disk.store.biz.StoreFileBiz;
import com.faber.api.disk.store.biz.StoreFileHisBiz;
import com.faber.api.disk.store.entity.StoreFile;
import com.faber.api.disk.store.entity.StoreFileHis;
import com.faber.core.constant.FaSetting;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Farando
 * @date 2023/3/13 16:33
 * @description
 */
@Slf4j
@Service
public class DiskOnlyofficeBiz {

    @Resource
    FaSetting faSetting;

    @Resource
    JwtManager jwtManager;

    @Resource
    FaFileUtility faFileUtility;

    @Resource
    FileSaveBiz fileSaveBiz;

    @Resource
    StoreFileBiz storeFileBiz;

    @Resource
    StoreFileHisBiz storeFileHisBiz;

    @Lazy
    @Resource
    UserBiz userBiz;

    public OpenFileRetVo openFile(Integer storeFileId, Mode mode) {
        OpenFileRetVo retVo = new OpenFileRetVo();
        retVo.setFileModel(openFileModal(storeFileId, mode));
        retVo.setDocumentApi(faSetting.getOnlyoffice().getOnlyofficeServer());
        return retVo;
    }

    /**
     * 打开office文件，生成与onlyoffice服务交互的jwt token，返回打开文件的配置
     *
     * @param storeFileId {@link StoreFile#getId()}
     * @param mode
     * @return
     */
    public FileModel openFileModal(Integer storeFileId, Mode mode) {
        StoreFile storeFile = storeFileBiz.getById(storeFileId);
        String fileId = storeFile.getFileId();

        FileSave fileSave = fileSaveBiz.getById(fileId);

        FileModel fileModel = SpringUtil.getBean(FileModel.class);
        fileModel.setType(Type.desktop);

        DocumentType documentType = faFileUtility.getDocumentType(fileSave.getOriginalFilename());  // get the document type of the specified file
        fileModel.setDocumentType(documentType);

        Document document = fileModel.getDocument();
        document.setTitle(storeFile.getName());
        document.setFileType(fileSave.getExt());

        // 不要忘记每次编辑和保存文档时，都必须重新生成document.key。
        document.setKey(storeFileId + "_" + fileId); // 设置文件ID

        // onlyoffice下载文件的URL，onlyoffice服务器需要能访问到该URL
        document.setUrl(faSetting.getOnlyoffice().getCallbackServer() + "api/base/admin/fileSave/getFile/" + fileId);

        EditorConfig editorConfig = fileModel.getEditorConfig();
        editorConfig.setLang("zh");
        editorConfig.setCallbackUrl(faSetting.getOnlyoffice().getCallbackServer() + "api/disk/doc/onlyoffice/track"); // 回调
        editorConfig.setMode(mode);

        Map<String, Object> map = new HashMap<>();
        map.put("type", fileModel.getType());
        map.put("documentType", documentType);
        map.put("document", document);
        map.put("editorConfig", editorConfig);

        String token = jwtManager.createToken(map);
        fileModel.setToken(token);

        return fileModel;
    }

    public void track(final Track track) {
        // 设置操作用户
        setTrackUserToContext(track);

        switch (track.getStatus()) {
            case EDITING:
                break;
            case SAVE:
            case MUST_FORCE_SAVE:
                this.saveTrack(track);
                break;
            case CORRUPTED:
                break;
            case CORRUPTED_FORCE_SAVE:
                break;
        }
    }

    /**
     * 检查onlyoffice的回调，查找操作用户，设置到上下文中
     * @param track
     */
    public void setTrackUserToContext(Track track) {
        if (track.getUsers() == null || track.getUsers().isEmpty()) return;
        userBiz.setUserLogin(track.getUsers().get(0));
    }

    /**
     * 保存
     * @param track
     */
    public void saveTrack(Track track) {
        if (StrUtil.isEmpty(track.getUrl())) return;

        StoreFile storeFile = storeFileBiz.getById(track.getKey().split("_")[0]);

        if (track.getActions() == null || track.getActions().isEmpty()) return;
        Action action = track.getActions().get(0);
        switch (action.getType()) {
            case edit:
                // 获取本次操作的用户ID
                String userId = action.getUserid();
                userBiz.setUserLogin(userId);

                try {
                    // 需要保存的文件URL，将此URL下载保存到本地。
                    FileSave fileSave = fileSaveBiz.download(track.getUrl(), storeFile.getName());

                    // 更新最新的文件
                    storeFileBiz.lambdaUpdate()
                            .set(StoreFile::getFileId, fileSave.getId())
                            .eq(StoreFile::getId, storeFile.getId())
                            .update();

                    // 记录文件历史记录
                    StoreFileHis storeFileHis = new StoreFileHis();
                    storeFileHis.setStoreFileId(storeFile.getId());
                    storeFileHis.setFileSaveId(fileSave.getId());
                    storeFileHis.setFileName(storeFile.getName());

                    // 增加版本号
                    int curVer = storeFileHisBiz.getStoreFileMaxVer(storeFile.getId());
                    storeFileHis.setVer(curVer + 1);

                    // 记录文件变更记录
                    if (StrUtil.isNotEmpty(track.getChangesurl())) {
                        try {
                            FileSave changeFileSave = fileSaveBiz.download(track.getChangesurl(), "changes.zip");
                            storeFileHis.setChangeFileId(changeFileSave.getId());
                        } catch (Exception e) {
                            log.error(e.getMessage(), e);
                        }
                    }

                    storeFileHisBiz.save(storeFileHis);
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                }

                break;
        }
    }

}
