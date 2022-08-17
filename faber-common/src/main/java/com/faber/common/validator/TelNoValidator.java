package com.faber.common.validator;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD})
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = {TelNoValidator.ValidatorInner.class})
public @interface TelNoValidator {
    String message() default "手机号格式错误";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    /**
     * 必须实现 ConstraintValidator接口
     */
    class ValidatorInner implements ConstraintValidator<TelNoValidator, String> {

        @Override
        public void initialize(TelNoValidator constraintAnnotation) {
        }

        /**
         * 校验逻辑的实现
         *
         * @param value 需要校验的 值
         * @return 布尔值结果
         */
        @Override
        public boolean isValid(String value, ConstraintValidatorContext context) {
            if (value == null) {
                return true;
            }
            if ("".equals(value)) {
                return true;
            }
            return ValidUtils.validTelNo(value);
        }
    }

}
