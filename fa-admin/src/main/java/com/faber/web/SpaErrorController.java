package com.faber.web;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

/**
 * 为打包在同一个 Jar 中的前端应用提供 SPA 深链接回退。
 */
@Controller
public class SpaErrorController implements ErrorController {

    private static final String PORTAL_PREFIX = "/portal";
    private static final String PORTAL_SPA_FALLBACK = "/portal/__spa-fallback.html";

    private final ResourceLoader resourceLoader;

    public SpaErrorController(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @RequestMapping("/spa-error")
    public void handleNotFound(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String requestUri = normalizeRequestUri(
                (String) request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI),
                request.getContextPath()
        );

        if (requestUri == null || isBackendPath(requestUri)) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        if (requestUri.equals("/h5") || requestUri.equals(PORTAL_PREFIX)) {
            redirectToTrailingSlash(request, response, requestUri);
            return;
        }

        // 缺失的静态资源必须返回 404，不能回退成 text/html 的 SPA 入口。
        if (isStaticResourcePath(requestUri)) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        if (isPathWithin(requestUri, "/h5")) {
            forwardToSpaEntry(request, response, "/h5/index.html");
            return;
        }

        if (isPathWithin(requestUri, PORTAL_PREFIX)) {
            String prerenderedEntry = resolvePortalPrerenderedEntry(requestUri);
            forwardToSpaEntry(
                    request,
                    response,
                    prerenderedEntry != null ? prerenderedEntry : PORTAL_SPA_FALLBACK
            );
            return;
        }

        // admin 保持根路径部署，并承接 /login、/admin/** 等既有前端路由。
        forwardToSpaEntry(request, response, "/index.html");
    }

    private boolean isBackendPath(String requestUri) {
        return isPathWithin(requestUri, "/api")
                || isPathWithin(requestUri, "/outapi")
                || isPathWithin(requestUri, "/actuator");
    }

    private boolean isStaticResourcePath(String requestUri) {
        String fileName = requestUri.substring(requestUri.lastIndexOf('/') + 1);
        return fileName.contains(".")
                || isPathWithin(requestUri, "/assets")
                || isPathWithin(requestUri, "/plugins")
                || isPathWithin(requestUri, "/file")
                || isPathWithin(requestUri, "/static")
                || isPathWithin(requestUri, "/webjars")
                || isPathWithin(requestUri, "/h5/assets")
                || isPathWithin(requestUri, PORTAL_PREFIX + "/assets");
    }

    private boolean isPathWithin(String requestUri, String pathPrefix) {
        return requestUri.equals(pathPrefix) || requestUri.startsWith(pathPrefix + "/");
    }

    private String normalizeRequestUri(String requestUri, String contextPath) {
        if (requestUri == null || contextPath == null || contextPath.isEmpty()) {
            return requestUri;
        }
        if (requestUri.equals(contextPath)) {
            return "/";
        }
        return requestUri.startsWith(contextPath + "/")
                ? requestUri.substring(contextPath.length())
                : requestUri;
    }

    String resolvePortalPrerenderedEntry(String requestUri) {
        String relativePath = requestUri.substring(PORTAL_PREFIX.length());
        if (relativePath.contains("..") || relativePath.indexOf('\\') >= 0) {
            return null;
        }

        while (relativePath.endsWith("/") && !relativePath.isEmpty()) {
            relativePath = relativePath.substring(0, relativePath.length() - 1);
        }

        String entryPath = PORTAL_PREFIX + relativePath + "/index.html";
        Resource resource = resourceLoader.getResource("classpath:/static" + entryPath);
        return resource.exists() && resource.isReadable() ? entryPath : null;
    }

    private void redirectToTrailingSlash(
            HttpServletRequest request,
            HttpServletResponse response,
            String requestUri
    ) throws IOException {
        String redirectUrl = request.getContextPath() + requestUri + "/";
        if (request.getQueryString() != null) {
            redirectUrl += "?" + request.getQueryString();
        }
        response.sendRedirect(redirectUrl);
    }

    private void forwardToSpaEntry(HttpServletRequest request, HttpServletResponse response, String entryPath)
            throws ServletException, IOException {
        response.setStatus(HttpServletResponse.SC_OK);
        request.getRequestDispatcher(entryPath).forward(request, response);
    }
}
