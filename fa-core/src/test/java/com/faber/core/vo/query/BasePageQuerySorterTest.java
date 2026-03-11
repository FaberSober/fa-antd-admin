package com.faber.core.vo.query;

import com.faber.core.exception.BuzzException;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * BasePageQuery setSorter方法SQL注入防护测试
 * 
 * @author xu.pengfei
 * @date 2025/1/2
 */
public class BasePageQuerySorterTest {

    @Test
    public void testValidSorterFormats() {
        BasePageQuery<Object> query = new BasePageQuery<>();

        // 测试有效的排序格式
        assertDoesNotThrow(() -> {
            query.setSorter("id ASC");
            assertEquals("id ASC", query.getSorter());
        });

        assertDoesNotThrow(() -> {
            query.setSorter("createTime DESC");
            assertEquals("createTime DESC", query.getSorter());
        });

        assertDoesNotThrow(() -> {
            query.setSorter("user_name asc");
            assertEquals("user_name asc", query.getSorter());
        });

        assertDoesNotThrow(() -> {
            query.setSorter("userName desc");
            assertEquals("userName desc", query.getSorter());
        });

        // 测试多个排序字段
        assertDoesNotThrow(() -> {
            query.setSorter("id ASC, createTime DESC");
            assertEquals("id ASC, createTime DESC", query.getSorter());
        });

        // 测试空值和null
        assertDoesNotThrow(() -> {
            query.setSorter(null);
            assertNull(query.getSorter());
        });

        assertDoesNotThrow(() -> {
            query.setSorter("");
            assertEquals("", query.getSorter());
        });

        assertDoesNotThrow(() -> {
            query.setSorter("   ");
            assertEquals("", query.getSorter());
        });
    }

    @Test
    public void testInvalidSorterFormats() {
        BasePageQuery<Object> query = new BasePageQuery<>();

        // 测试格式错误的排序字符串
        assertThrows(BuzzException.class, () -> {
            query.setSorter("id"); // 缺少ASC/DESC
        });

        assertThrows(BuzzException.class, () -> {
            query.setSorter("id INVALID"); // 无效的排序方向
        });

        assertThrows(BuzzException.class, () -> {
            query.setSorter("123field ASC"); // 字段名不能以数字开头
        });

        assertThrows(BuzzException.class, () -> {
            query.setSorter("field-name ASC"); // 包含连字符
        });
    }

    @Test
    public void testSqlInjectionPrevention() {
        BasePageQuery<Object> query = new BasePageQuery<>();

        // 测试SQL注入攻击
        assertThrows(BuzzException.class, () -> {
            query.setSorter("id; DROP TABLE users; --");
        });

        assertThrows(BuzzException.class, () -> {
            query.setSorter("id' OR '1'='1' --");
        });

        assertThrows(BuzzException.class, () -> {
            query.setSorter("id UNION SELECT * FROM users");
        });

        assertThrows(BuzzException.class, () -> {
            query.setSorter("id/*comment*/ ASC");
        });

        assertThrows(BuzzException.class, () -> {
            query.setSorter("(SELECT COUNT(*) FROM users) ASC");
        });
    }

    @Test
    public void testDangerousCharacters() {
        BasePageQuery<Object> query = new BasePageQuery<>();

        // 测试危险字符
        String[] dangerousInputs = {
                "id; ASC",
                "id-- ASC",
                "id/* ASC",
                "id*/ ASC",
                "id' ASC",
                "id\" ASC",
                "id< ASC",
                "id> ASC",
                "id= ASC",
                "id( ASC",
                "id) ASC",
                "id+ ASC",
                "id- ASC",
                "id* ASC",
                "id/ ASC",
                "id% ASC",
                "id| ASC",
                "id& ASC",
                "id^ ASC",
                "id~ ASC",
                "id? ASC",
                "id: ASC",
                "id@ ASC",
                "id# ASC",
                "id! ASC",
                "id$ ASC",
                "id[ ASC",
                "id] ASC",
                "id{ ASC",
                "id} ASC",
                "id\\ ASC"
        };

        for (String dangerousInput : dangerousInputs) {
            assertThrows(BuzzException.class, () -> {
                query.setSorter(dangerousInput);
            }, "应该拒绝危险字符输入: " + dangerousInput);
        }
    }

    @Test
    public void testSqlKeywordsPrevention() {
        BasePageQuery<Object> query = new BasePageQuery<>();

        // 测试SQL关键字
        String[] sqlKeywordInputs = {
                "SELECT ASC",
                "INSERT DESC",
                "UPDATE ASC",
                "DELETE DESC",
                "DROP ASC",
                "CREATE DESC",
                "ALTER ASC",
                "TRUNCATE DESC",
                "UNION ASC",
                "JOIN DESC"
        };

        for (String keywordInput : sqlKeywordInputs) {
            assertThrows(BuzzException.class, () -> {
                query.setSorter(keywordInput);
            }, "应该拒绝包含SQL关键字的输入: " + keywordInput);
        }
    }

    @Test
    public void testFieldNameLengthValidation() {
        BasePageQuery<Object> query = new BasePageQuery<>();

        // 测试过长的字段名
        String longFieldName = "a".repeat(51) + " ASC";
        assertThrows(BuzzException.class, () -> {
            query.setSorter(longFieldName);
        });

        // 测试刚好50个字符的字段名（应该通过）
        String maxLengthFieldName = "a".repeat(50) + " ASC";
        assertDoesNotThrow(() -> {
            query.setSorter(maxLengthFieldName);
        });
    }
}