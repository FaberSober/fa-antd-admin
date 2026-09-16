import { type FormEvent, useState } from 'react';
import type { MetaFunction } from 'react-router-dom';
import { PortalRequestTimeoutError } from '../../../kernel/http';
import { createPortalMeta } from '../../../kernel/seo';
import pageStyles from '../../../shared/styles/page.module.css';
import { Breadcrumbs } from '../../../shared/ui/Breadcrumbs';
import { type ContactInquiryInput, submitContactInquiry } from '../services/contact';
import styles from './contact.module.css';

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: '联系我们｜FA Portal',
    description: '联系 FA AI 团队，交流产品、解决方案和智能化项目需求。',
    path: '/contact',
  });

const initialForm: ContactInquiryInput = {
  name: '',
  company: '',
  tel: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function updateField(field: keyof ContactInquiryInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;
    if (!form.name.trim() || !form.tel.trim() || !form.subject.trim() || !form.message.trim()) {
      setStatus('error');
      setMessage('请完整填写联系人、电话、咨询主题和咨询内容。');
      return;
    }

    setStatus('submitting');
    setMessage('正在提交，请稍候…');
    try {
      await submitContactInquiry(form);
      setStatus('success');
      setMessage('提交成功，我们会尽快与你联系。');
      setForm(initialForm);
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof PortalRequestTimeoutError ? '提交超时，请检查网络后重试。' : error instanceof Error ? error.message : '提交失败，请稍后重试。',
      );
    }
  }

  return (
    <>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.pageHeaderInner}>
          <Breadcrumbs items={[{ label: '联系我们' }]} />
          <p className={pageStyles.eyebrow}>CONTACT</p>
          <h1>聊聊你的业务问题</h1>
          <p className={pageStyles.lead}>无论是产品体验、方案咨询还是合作设想，我们都希望先听见真实需求。</p>
        </div>
      </header>
      <section className={pageStyles.section}>
        <div className={styles.layout}>
          <div>
            <p className={pageStyles.eyebrow}>GET IN TOUCH</p>
            <h2>保持联系</h2>
            <dl className={styles.contactList}>
              <div className={styles.contactItem}>
                <dt>商务咨询</dt>
                <dd>请通过右侧表单留下联系方式</dd>
              </div>
              <div className={styles.contactItem}>
                <dt>工作时间</dt>
                <dd>周一至周五 09:00–18:00</dd>
              </div>
              <div className={styles.contactItem}>
                <dt>服务方式</dt>
                <dd>远程交流 · 方案共创 · 项目交付</dd>
              </div>
            </dl>
          </div>

          <form className={styles.form} onSubmit={submit}>
            <div className={styles.field}>
              <label htmlFor="contact-name">联系人 *</label>
              <input id="contact-name" maxLength={100} onChange={(event) => updateField('name', event.target.value)} value={form.name} />
            </div>
            <div className={styles.field}>
              <label htmlFor="contact-company">公司</label>
              <input id="contact-company" maxLength={200} onChange={(event) => updateField('company', event.target.value)} value={form.company} />
            </div>
            <div className={styles.field}>
              <label htmlFor="contact-tel">联系电话 *</label>
              <input id="contact-tel" inputMode="tel" maxLength={32} onChange={(event) => updateField('tel', event.target.value)} value={form.tel} />
            </div>
            <div className={styles.field}>
              <label htmlFor="contact-email">邮箱</label>
              <input id="contact-email" maxLength={255} onChange={(event) => updateField('email', event.target.value)} type="email" value={form.email} />
            </div>
            <div className={styles.fieldFull}>
              <label htmlFor="contact-subject">咨询主题 *</label>
              <input id="contact-subject" maxLength={200} onChange={(event) => updateField('subject', event.target.value)} value={form.subject} />
            </div>
            <div className={styles.fieldFull}>
              <label htmlFor="contact-message">咨询内容 *</label>
              <textarea id="contact-message" maxLength={4000} onChange={(event) => updateField('message', event.target.value)} value={form.message} />
            </div>
            <button className={styles.submit} disabled={status === 'submitting'} type="submit">
              {status === 'submitting' ? '提交中…' : '提交咨询'}
            </button>
            {message ? (
              <p aria-live="polite" className={styles.message} data-status={status}>
                {message}
              </p>
            ) : null}
          </form>
        </div>
      </section>
      <section className={pageStyles.section}>
        <div className={styles.map}>
          <span>地图能力将在提供正式办公地址后接入</span>
        </div>
      </section>
    </>
  );
}
