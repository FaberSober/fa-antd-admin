import { useEffect, useState } from 'react';
import styles from './ImagePreviewGroup.module.css';

interface ImageLightboxProps {
  images: string[];
  activeIndex: number;
  label?: string;
  onClose: () => void;
  onActiveIndexChange: (index: number) => void;
}

export function ImageLightbox({ images, activeIndex, label = '生成图片', onClose, onActiveIndexChange }: ImageLightboxProps) {
  const activeImage = images[activeIndex];

  useEffect(() => {
    if (!activeImage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (images.length > 1 && event.key === 'ArrowLeft') {
        onActiveIndexChange((activeIndex - 1 + images.length) % images.length);
      }
      if (images.length > 1 && event.key === 'ArrowRight') {
        onActiveIndexChange((activeIndex + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage, activeIndex, images.length, onClose, onActiveIndexChange]);

  if (!activeImage) return null;

  const showPrevious = () => onActiveIndexChange((activeIndex - 1 + images.length) % images.length);
  const showNext = () => onActiveIndexChange((activeIndex + 1) % images.length);

  return (
    <div className={styles.overlay}>
      <button className={styles.backdrop} type="button" aria-label="关闭图片预览" onClick={onClose} />
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`${label} ${activeIndex + 1} 预览`}
        onClick={(event) => event.stopPropagation()}
      >
        <button className={styles.close} type="button" aria-label="关闭图片预览" onClick={onClose}>
          ×
        </button>
        {images.length > 1 ? (
          <button className={`${styles.navigate} ${styles.previous}`} type="button" aria-label="上一张图片" onClick={showPrevious}>
            ‹
          </button>
        ) : null}
        <img className={styles.fullImage} src={activeImage} alt={`${label} ${activeIndex + 1} 大图`} />
        {images.length > 1 ? (
          <button className={`${styles.navigate} ${styles.next}`} type="button" aria-label="下一张图片" onClick={showNext}>
            ›
          </button>
        ) : null}
        {images.length > 1 ? (
          <span className={styles.counter}>
            {activeIndex + 1} / {images.length}
          </span>
        ) : null}
      </div>
    </div>
  );
}

interface ImagePreviewGroupProps {
  className: string;
  images: string[];
}

export default function ImagePreviewGroup({ className, images }: ImagePreviewGroupProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className={className}>
        {images.map((url, index) => (
          <button className={styles.thumbnail} key={url} type="button" aria-label={`查看生成图片 ${index + 1} 大图`} onClick={() => setActiveIndex(index)}>
            <img src={url} alt={`生成图片 ${index + 1}`} loading="lazy" />
          </button>
        ))}
      </div>
      {activeIndex !== null ? (
        <ImageLightbox
          activeIndex={activeIndex}
          images={images}
          onClose={() => setActiveIndex(null)}
          onActiveIndexChange={setActiveIndex}
        />
      ) : null}
    </>
  );
}
