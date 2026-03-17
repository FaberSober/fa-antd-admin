package com.faber.api.base.admin.biz;

import com.faber.api.base.admin.entity.LogApi;
import com.faber.api.base.admin.mapper.LogApiMapper;
import com.faber.core.vo.tree.TreeNode;
import com.faber.core.web.biz.BaseBiz;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * URL请求日志
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class LogApiBiz extends BaseBiz<LogApiMapper, LogApi> {

    @Resource ConfigSysBiz configSysBiz;

    public void deleteAll() {
        LogApi logApi = lambdaQuery()
                .orderByDesc(LogApi::getId)
                .last("LIMIT 1")
                .one();
        if (logApi == null) {
            return;
        }
        Long id = logApi.getId();
        deleteLessMinId(id);
    }

    public void deleteOverSize() {
        Integer logSaveMaxNum = configSysBiz.getConfig().getLogSaveMaxNum();
        if (logSaveMaxNum < 0) return;

        LogApi logApi = lambdaQuery()
                .orderByDesc(LogApi::getId)
                .last("LIMIT " + logSaveMaxNum + ", 1")
                .one();
        if (logApi == null) {
            return;
        }
        Long id = logApi.getId();
        deleteLessMinId(id);
    }

    public void deleteLessMinId(Long id) {
        int rowCount = baseMapper.deleteOverSize(id);
        while (rowCount > 0) {
            rowCount = baseMapper.deleteOverSize(id);
        }
    }

    public List<TreeNode<Object>> listLogFiles() {
        File logDir = new File("./log");
        if (!logDir.exists() || !logDir.isDirectory()) {
            return new ArrayList<>();
        }
        return listFilesRecursive(logDir, "");
    }

    private List<TreeNode<Object>> listFilesRecursive(File dir, String path) {
        List<TreeNode<Object>> nodes = new ArrayList<>();
        File[] files = dir.listFiles();
        if (files == null) return nodes;

        // Sort: directories first, then files by name
        Arrays.sort(files, Comparator.comparing(File::isDirectory).reversed().thenComparing(File::getName));

        for (File file : files) {
            String currentPath = path.isEmpty() ? file.getName() : path + "/" + file.getName();
            TreeNode<Object> node = new TreeNode<>();
            node.setId(currentPath);
            node.setName(file.getName());
            
            Map<String, Object> sourceData = new HashMap<>();
            sourceData.put("isDir", file.isDirectory());
            sourceData.put("size", file.length());
            sourceData.put("sizeStr", formatFileSize(file.length()));
            node.setSourceData(sourceData);

            if (file.isDirectory()) {
                node.setChildren(listFilesRecursive(file, currentPath));
                node.setHasChildren(!node.getChildren().isEmpty());
            } else {
                node.setHasChildren(false);
            }
            nodes.add(node);
        }
        return nodes;
    }

    public List<String> readLogFile(String filePath, int lines) {
        File file = new File("./log", filePath);
        if (!file.exists() || !file.isFile()) {
            throw new RuntimeException("Log file not found: " + filePath);
        }

        List<String> result = new ArrayList<>();
        try (RandomAccessFile raf = new RandomAccessFile(file, "r")) {
            long length = raf.length();
            if (length == 0) return result;

            long pos = length - 1;
            int count = 0;
            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();

            while (pos >= 0 && count < lines) {
                raf.seek(pos);
                int b = raf.read();
                if (b == '\n') {
                    if (baos.size() > 0) {
                        byte[] bytes = baos.toByteArray();
                        reverseBytes(bytes);
                        result.add(0, new String(bytes, java.nio.charset.StandardCharsets.UTF_8));
                        baos.reset();
                        count++;
                    }
                } else if (b != '\r') {
                    baos.write(b);
                }
                pos--;
            }
            if (baos.size() > 0 && count < lines) {
                byte[] bytes = baos.toByteArray();
                reverseBytes(bytes);
                result.add(0, new String(bytes, java.nio.charset.StandardCharsets.UTF_8));
            }
        } catch (IOException e) {
            throw new RuntimeException("Error reading log file", e);
        }
        return result;
    }

    private void reverseBytes(byte[] array) {
        int i = 0;
        int j = array.length - 1;
        while (i < j) {
            byte temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            i++;
            j--;
        }
    }

    public void downloadLogFile(String filePath) {
        File file = new File("./log", filePath);
        if (!file.exists() || !file.isFile()) {
            throw new RuntimeException("Log file not found: " + filePath);
        }

        try {
            com.faber.core.utils.FaFileUtils.downloadFile(file);
        } catch (IOException e) {
            throw new RuntimeException("Error downloading log file", e);
        }
    }

    private String formatFileSize(long size) {
        if (size <= 0) return "0B";
        final String[] units = new String[]{"B", "KB", "MB", "GB", "TB"};
        int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
        return new java.text.DecimalFormat("#,##0.#").format(size / Math.pow(1024, digitGroups)) + " " + units[digitGroups];
    }

}
