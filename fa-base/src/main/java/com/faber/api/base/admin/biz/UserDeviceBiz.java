package com.faber.api.base.admin.biz;

import com.faber.api.base.admin.entity.User;
import com.faber.api.base.admin.entity.UserDevice;
import com.faber.api.base.admin.mapper.UserDeviceMapper;
import com.faber.core.constant.FaSetting;
import com.faber.core.exception.BuzzException;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.Date;

/**
 * BASE-用户设备
 *
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2024-01-11 14:52:44
 */
@Service
public class UserDeviceBiz extends BaseBiz<UserDeviceMapper,UserDevice> {

    @Resource
    private FaSetting faSetting;

    @Resource
    UserBiz userBiz;

    @Override
    public void decorateOne(UserDevice i) {
        User user = userBiz.getByIdWithCache(i.getUserId());
        if (user != null) {
            i.setUserName(user.getName());
        }
    }

    public void updateMine(UserDevice entity) {
        long count = lambdaQuery()
                .eq(UserDevice::getDeviceId, entity.getDeviceId())
                .count();

        if (count > 1) {
            throw new BuzzException("重复设备编码，请联系管理员");
        }

        if (count == 0) {
            entity.setUserId(getCurrentUserId());
            entity.setEnable(faSetting.getApp().isDeviceDefaultAllow()); // 默认不允许访问
            entity.setLastOnlineTime(new Date());
            this.save(entity);
            return;
        }

        UserDevice entityDB = lambdaQuery()
                .eq(UserDevice::getDeviceId, entity.getDeviceId())
                .one();
        entityDB.setUserId(getCurrentUserId());
        entityDB.setModel(entity.getModel());
        entityDB.setManufacturer(entity.getManufacturer());
        entityDB.setOs(entity.getOs());
        entityDB.setOsVersion(entity.getOsVersion());
        this.updateById(entityDB);
    }

    public UserDevice getByDeviceId(String deviceId) {
        long count = lambdaQuery()
                .eq(UserDevice::getDeviceId, deviceId)
                .count();

        if (count > 1) {
            throw new BuzzException("重复设备编码，请联系管理员");
        }

        if (count == 0) {
            return null;
        }

        UserDevice entityDB = lambdaQuery()
                .eq(UserDevice::getDeviceId, deviceId)
                .one();
        return entityDB;
    }

    public void updateLastOnlineTime(int id) {
        lambdaUpdate()
                .set(UserDevice::getLastOnlineTime, LocalDateTime.now())
                .eq(UserDevice::getId, id)
                .update();
    }

}