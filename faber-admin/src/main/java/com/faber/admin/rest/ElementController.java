package com.faber.admin.rest;

import com.faber.admin.biz.ElementBiz;
import com.faber.admin.entity.Element;
import com.faber.common.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 权限点
 */
@Controller
@RequestMapping("/api/admin/element")
public class ElementController extends BaseController<ElementBiz, Element> {

//    /**
//     * 查找{@link Menu#getCode()}的子{@link Element}
//     * @param menuCode
//     * @return
//     */
//    @RequestMapping(value = "/listByMenuCode", method = RequestMethod.GET)
//    @ResponseBody
//    public ObjectRestResponse<List<Element>> listByMenuCode(@RequestParam String menuCode) {
//        List<Element> elements = baseBiz.selectByMenuCode(menuCode);
//        return new ObjectRestResponse<List<Element>>().data(elements);
//    }
//
//    @RequestMapping(value = "/user", method = RequestMethod.GET)
//    @ResponseBody
//    public ObjectRestResponse<List<Element>> getAuthorityElement(String menuId) {
//        String userId = getCurrentUserId();
//        List<Element> elements = baseBiz.getAuthorityElementByUserId(userId + "", menuId);
//        return new ObjectRestResponse<List<Element>>().data(elements);
//    }
//
//    @RequestMapping(value = "/user/menu", method = RequestMethod.GET)
//    @ResponseBody
//    public ObjectRestResponse<List<Element>> getAuthorityElement() {
//        String userId = getCurrentUserId();
//        List<Element> elements = baseBiz.getAuthorityElementByUserId(userId + "");
//        return new ObjectRestResponse<List<Element>>().data(elements);
//    }
}
