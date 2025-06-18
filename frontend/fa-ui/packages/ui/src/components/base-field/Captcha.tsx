import React, {CSSProperties, useEffect, useRef, useState} from 'react';

export interface CaptchaProps {
  onCodeChange?: (code: string) => void;
  style?: CSSProperties;
}

/**
 * 图片验证码
 * @author xu.pengfei
 * @date 2021/6/16
 */
export default function Captcha({ onCodeChange, style }: CaptchaProps) {
  const canvasRef = useRef<any | null>();
  const [code, setCode] = useState('');

  const config = {
    // code: '',
    codeLength: 4,
    fontSizeMin: 26,
    fontSizeMax: 30,
    backgroundColorMin: 240,
    backgroundColorMax: 250,
    colorMin: 10,
    colorMax: 20,
    lineColorMin: 40,
    lineColorMax: 180,
    contentWidth: 96,
    contentHeight: 38,
    showError: false, // 默认不显示验证码的错误信息
  };

  // 生成一个随机数
  function randomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function drawPic() {
    randomCode();
  }

  // 生成一个随机的颜色
  function randomColor(min: number, max: number) {
    const r = randomNum(min, max);
    const g = randomNum(min, max);
    const b = randomNum(min, max);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function drawText(ctx: any, txt: string, i: number) {
    ctx.fillStyle = randomColor(config.colorMin, config.colorMax);
    const fontSize = randomNum(config.fontSizeMin, config.fontSizeMax);
    ctx.font = `${fontSize}px SimHei`;
    const padding = 10;
    const offset = (config.contentWidth - 40) / (code.length - 1);
    let x = padding;
    if (i > 0) {
      x = padding + i * offset;
    }
    let y = randomNum(config.fontSizeMax, config.contentHeight - 5);
    if (fontSize > 40) {
      y = 40;
    }
    const deg = randomNum(-10, 10);
    // 修改坐标原点和旋转角度
    ctx.translate(x, y);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(txt, 0, 0);
    // 恢复坐标原点和旋转角度
    ctx.rotate((-deg * Math.PI) / 180);
    ctx.translate(-x, -y);
  }

  function drawLine(ctx: any) {
    // 绘制干扰线
    for (let i = 0; i < 1; i += 1) {
      ctx.strokeStyle = randomColor(config.lineColorMin, config.lineColorMax);
      ctx.beginPath();
      ctx.moveTo(randomNum(0, config.contentWidth), randomNum(0, config.contentHeight));
      ctx.lineTo(randomNum(0, config.contentWidth), randomNum(0, config.contentHeight));
      ctx.stroke();
    }
  }

  function drawDot(ctx: any) {
    // 绘制干扰点
    for (let i = 0; i < 100; i += 1) {
      ctx.fillStyle = randomColor(0, 255);
      ctx.beginPath();
      ctx.arc(randomNum(0, config.contentWidth), randomNum(0, config.contentHeight), 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  function reloadPic() {
    drawPic();
  }

  // 随机生成验证码
  function randomCode() {
    let random = '';
    // 去掉了I l i o O
    const str = 'QWERTYUPLKJHGFDSAZXCVBNMqwertyupkjhgfdsazxcvbnm1234567890';
    for (let i = 0; i < config.codeLength; i += 1) {
      const index = Math.floor(Math.random() * 57);
      random += str[index];
    }
    setCode(random);
  }

  useEffect(() => {
    drawPic();
  }, []);

  useEffect(() => {
    if (canvasRef.current === null) return;

    if (onCodeChange) {
      onCodeChange(code);
    }

    const ctx = canvasRef.current.getContext('2d');
    ctx.textBaseline = 'bottom';
    // 绘制背景
    ctx.fillStyle = randomColor(config.backgroundColorMin, config.backgroundColorMax);
    ctx.fillRect(0, 0, config.contentWidth, config.contentHeight);
    // 绘制文字
    for (let i = 0; i < code.length; i += 1) {
      drawText(ctx, code[i], i);
    }
    drawLine(ctx);
    drawDot(ctx);
  }, [code]);

  return (
    <div style={{ width: 100, height: 38, ...style }}>
      <canvas ref={canvasRef} onClick={() => reloadPic()} width={100} height={38} />
    </div>
  );
}
