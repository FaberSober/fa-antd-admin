package com.faber.api.base.doc.biz;

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
import com.faber.core.constant.FaSetting;
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
@Service
public class OnlyofficeBiz {

    @Resource
    FaSetting faSetting;

    @Resource
    JwtManager jwtManager;

    @Resource
    FaFileUtility faFileUtility;

    @Resource
    FileSaveBiz fileSaveBiz;

    @Lazy
    @Resource
    UserBiz userBiz;

    public OpenFileRetVo openFile(String fileId, Mode mode) {
        OpenFileRetVo retVo = new OpenFileRetVo();
        retVo.setFileModel(openFileModal(fileId, mode));
        retVo.setDocumentApi(faSetting.getOnlyoffice().getOnlyofficeServer());
        return retVo;
    }

    /**
     * 打开office文件，生成与onlyoffice服务交互的jwt token，返回打开文件的配置
     *
     * @param fileId {@link FileSave#getId()}
     * @param mode
     * @return
     */
    public FileModel openFileModal(String fileId, Mode mode) {
        FileSave fileSave = fileSaveBiz.getById(fileId);

        FileModel fileModel = SpringUtil.getBean(FileModel.class);
        fileModel.setType(Type.desktop);

        DocumentType documentType = faFileUtility.getDocumentType(fileSave.getOriginalFilename());  // get the document type of the specified file
        fileModel.setDocumentType(documentType);

        Document document = fileModel.getDocument();
        document.setTitle(fileSave.getOriginalFilename());
        document.setFileType(fileSave.getExt());
        document.setKey(fileId); // 设置文件ID
        document.setUrl(faSetting.getOnlyoffice().getCallbackServer() + "api/base/admin/fileSave/getFile/" + fileId);

        EditorConfig editorConfig = fileModel.getEditorConfig();
        editorConfig.setLang("zh");
        editorConfig.setCallbackUrl(faSetting.getOnlyoffice().getCallbackServer() + "api/base/doc/onlyoffice/track");
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
        userBiz.setUserLogin(track.getUsers().get(0), "onlyoffice");
    }

    /**
     * 保存
     * @param track
     */
    public void saveTrack(Track track) {
        if (track.getActions() == null || track.getActions().isEmpty()) return;
        Action action = track.getActions().get(0);
        switch (action.getType()) {
            case edit:
                // 获取本次操作的用户ID
                action.getUserid();

                // 需要保存的文件URL，将此URL下载保存到本地。这里没有继续实现了，文件的更新放到了fa-disk网盘模块中进行处理。
                track.getUrl();
                break;
        }
    }

}
