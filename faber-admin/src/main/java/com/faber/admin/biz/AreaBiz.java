package com.faber.admin.biz;

import com.faber.admin.entity.Area;
import com.faber.admin.mapper.AreaMapper;
import com.faber.admin.vo.AreaTree;
import com.faber.common.biz.BaseBiz;
import com.faber.common.constant.DictConstants;
import com.faber.common.exception.BuzzException;
import com.faber.common.map.AMapUtils;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.util.IpUtils;
import com.faber.common.util.Query;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import tk.mybatis.mapper.entity.Example;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 中国行政地区表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-21 09:55:39
 */
@Service
public class AreaBiz extends BaseBiz<AreaMapper, Area> {

    @Resource
    private DictBiz dictBiz;

    @Autowired
    private AMapUtils aMapUtils;

    @Override
    public boolean save(Area entity) {
        long count = this.lambdaQuery().eq(Area::getAreaCode, entity.getAreaCode()).count();
        if (count > 0) throw new BuzzException("编码重复");
        return super.save(entity);
    }

    @Override
    public boolean updateById(Area entity) {
        long count = this.lambdaQuery()
                .eq(Area::getAreaCode, entity.getAreaCode())
                .ne(Area::getId, entity.getId())
                .count();
        if (count > 0) throw new BuzzException("编码重复");
        return super.updateById(entity);
    }

    @Override
    public TableResultResponse<Area> selectPageByQuery(Query query) {
        TableResultResponse<Area> table = super.selectPageByQuery(query);
        table.getData().addDict("level", dictBiz.getByCode(DictConstants.AreaLevel.DICT_LABEL));
        return table;
    }

//    /**
//     * 根据areaCode查询Area
//     * @param areaCode
//     * @return
//     */
//    public Area selectByAreaCode(long areaCode) {
//        Example example = new Example(Area.class);
//        example.createCriteria().andEqualTo("areaCode", areaCode);
//        return mapper.selectOneByExample(example);
//    }

    public ObjectRestResponse path(long areaCode) {
        List<Area> list = pathLine(areaCode);
        List<AreaTree> tree = getChildren(list, 0);

        Map<String, Object> data = new HashMap<>();
        data.put("list", list);
        data.put("tree", tree);
        return new ObjectRestResponse().data(data);
    }

    public Area findByAreaCode(Long areaCode) {
        if (areaCode == null) return null;
        if (areaCode == 100000000000L) {
            Area area = new Area();
            area.setAreaCode(100000000000L);
            area.setParentCode(0L);
            area.setName("中国");
            area.setShortName("中国");
            area.setMergerName("中国");
            area.setId(0);
            area.setLevel(DictConstants.AreaLevel.Value.NATION);
            return area;
        }

        return this.lambdaQuery().eq(Area::getAreaCode, areaCode).one();
    }

    public List<Area> findSubAreaList(Long areaCode) {
        return this.lambdaQuery().eq(Area::getParentCode, areaCode).list();
    }

    /**
     * 节点ID向上查找至根节点
     *
     * @param areaCode
     * @return
     */
    public List<Area> pathLine(long areaCode) {
        Area area = this.findByAreaCode(areaCode);
        if (area == null) return new ArrayList<>();
        if (area.getLevel() == null) throw new BuzzException("地区编码重复，需要联系管理员修改配置");
        List<Area> list = new ArrayList<>();
        if (area.getLevel() != DictConstants.AreaLevel.Value.PROVINCE && area.getLevel() != DictConstants.AreaLevel.Value.NATION) {
            list.addAll(pathLine(area.getParentCode()));
        }
        list.add(area);
        return list;
    }

    public Long getAreaLevelCode(List<Area> areaList, int level) {
        if (level >= areaList.size()) return null;
        return areaList.get(level).getAreaCode();
    }

    public String getAreaLevelName(List<Area> areaList, int level) {
        if (level >= areaList.size()) return null;
        return areaList.get(level).getName();
    }

    public String getAreaLevelShortName(List<Area> areaList, int level) {
        if (level >= areaList.size()) return null;
        return areaList.get(level).getShortName();
    }

    private List<AreaTree> getChildren(List<Area> list, int nodeIndex) {
        if (nodeIndex >= list.size()) return null;

        // 当前选中的节点
        Area bean = list.get(nodeIndex);

        // 获取选中的节点的兄弟节点
        List<Area> childList = this.findSubAreaList(bean.getParentCode());

        List<AreaTree> nodeList = new ArrayList<>();
        childList.forEach(c -> {
            List<AreaTree> children = null;
            // 递归获取选中节点的子节点
            if (c.getAreaCode().longValue() == bean.getAreaCode().longValue()) {
                children = getChildren(list, nodeIndex + 1);
            }
            AreaTree treeNode = new AreaTree();
            treeNode.setId(c.getAreaCode());
            treeNode.setParentId(c.getParentCode());
            treeNode.setName(c.getName());
            treeNode.setChildren(children);
            treeNode.setHasChildren(c.getLevel() != DictConstants.AreaLevel.Value.VILLAGE);

            nodeList.add(treeNode);
        });

        return nodeList;
    }

    /**
     * 根据地址解析地址
     *
     * @param name
     * @param level
     * @return
     */
    public List<Area> findDeepestArea(String name, int level) {
        List<Area> list = new ArrayList<>();
        String followName = name;
        for (int i = level; i <= DictConstants.AreaLevel.Value.VILLAGE; i++) {
            Long parentCode = null;
            if (list.size() > 0) {
                Area preArea = list.get(list.size() - 1);
                parentCode = preArea.getAreaCode();
                // 替换地区中匹配过的第一个地区名称，只替换一次
                // 防止出现"淮安市淮安区车桥镇车东村"这种情况，会导致替换两次
                if (followName.contains(preArea.getName())) {
                    followName = followName.replaceFirst(preArea.getName(), "");
                } else {
                    followName = followName.replaceFirst(preArea.getShortName(), "");
                }
            }
            Area area = findChopPreArea(followName, i, 0, parentCode);
            if (area == null) break;
            list.add(area);
        }
        return list;
    }

    public Area findChopPreArea(String name, int level, int chopIndex, Long parentCode) {
        if (chopIndex > name.length()) return null;
        String chopName = name.substring(chopIndex); // 切割前N个字符
        Area area = findFirstArea(chopName, level, 1, parentCode);
        if (area == null && chopIndex < name.length()) {
            chopIndex += 1;
            area = findChopPreArea(name, level, chopIndex, parentCode);
        }
        return area;
    }

    private Area findFirstArea(String name, int level, int length, Long parentCode) {
        if (length > name.length()) return null;
        String tryName = name.substring(0, length);
        Area area = findArea(level, tryName, parentCode);
        if (area == null && length < name.length()) {
            length += 1;
            area = findFirstArea(name, level, length, parentCode);
        }
        return area;
    }

    private Area findArea(int level, String name, Long parentCode) {
        List<Area> list = lambdaQuery().eq(Area::getLevel, level)
                .like(Area::getName, name)
                .eq(parentCode != null, Area::getParentCode, parentCode)
                .list();
        if (list == null || list.size() != 1) return null;
        return list.get(0);
    }

    public Map<String, Object> locIp() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String ip = IpUtils.getRequestIp(request);
        Map<String, Object> map = aMapUtils.getLocByIp(ip);
        map.put("ip", ip);
        return map;
    }

    public List<Area> findChildrenList(String parentCode) {
        return lambdaQuery()
                .eq(Area::getParentCode, parentCode)
                .orderByAsc(Area::getAreaCode)
                .list();
    }

    /**
     * 根据地区名称、父级地区编码查找唯一地址匹配
     * 1. 完整匹配
     * 2. 若完整匹配未匹配到，去除后缀再次匹配
     *
     * @param name 地区名称
     * @param parentCode 父级地区编码
     * @return
     */
    public Area findByNameOrParentCode(String name, Long parentCode, Integer level) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }

        List<Area> list = lambdaQuery()
                .like(Area::getName, name)
                .eq(parentCode != null, Area::getParentCode, parentCode)
                .eq(level != null, Area::getLevel, level)
                .list();
        String levelLabel =DictConstants.AreaLevel.LABEL.get(level +"");
        if (list == null || list.isEmpty()) {
            // 2. 若完整匹配未匹配到，去除后缀再次匹配
            String checkName = name;
            String[] removeSuffix = new String[]{"省", "市", "县", "区", "乡", "村"};
            for (String suffix : removeSuffix) {
                if (checkName.endsWith(suffix)) {
                    checkName = checkName.replaceAll(suffix, "");
                }
            }

            // 无后缀可以去除
            if (checkName.equals(name)) {
                throw new BuzzException("[" + levelLabel + "]匹配地址失败");
            }

            return this.findByNameOrParentCode(checkName, parentCode, level);
        }
        if (list.size() > 1) {
            throw new BuzzException("[" + levelLabel + "]匹配到多条地址记录，请检查");
        }
        return list.get(0);
    }

    /**
     * 通过经纬度查找最近的地点
     * @param lng 经度
     * @param lat 纬度
     * @return
     */
    public Long findByLoc(BigDecimal lng, BigDecimal lat) {
        return baseMapper.findClosetByLoc(lng, lat);
    }

    public Area findAreaByLoc(BigDecimal lng, BigDecimal lat) {
        Long areaCode = this.findByLoc(lng, lat);
        return this.findByAreaCode(areaCode);
    }

    /**
     * 截取不同层级的地址编码，智能向上截取
     * @param areaCode
     * @param areaLevel DictConstants.AreaLevel.Value
     * @return
     */
    public static Long chopAreaCodeToLevelX(Long areaCode, Area.Level areaLevel) {
        if (areaCode == null) return areaCode;
        if (areaLevel.value == Area.Level.NATION.value) return areaCode;
        if (areaLevel.value > Area.Level.COUNTRY.value) return areaCode;
        if (areaCode.toString().length() != 12) return areaCode;
        return Long.parseLong(areaCode.toString().substring(0, (areaLevel.value + 1) * 2)) * (int) Math.pow(10, (5 - areaLevel.value) * 2);
    }

    public static String chopAreaCodeToLevelX2(Long areaCode, Integer areaLevel) {
        if (areaLevel <= Area.Level.COUNTY.value) {
            return areaCode.toString().substring(0, (areaLevel + 1) * 2);
        }
        return areaCode.toString().substring(0, (areaLevel - 2) * 3 + 6);
    }

}