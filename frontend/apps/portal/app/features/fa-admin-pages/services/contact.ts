import { portalRequest } from '../../../kernel/http';

export interface ContactInquiryInput {
  name: string;
  company: string;
  tel: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactInquiry(input: ContactInquiryInput): Promise<void> {
  await portalRequest('/portal/contact/inquiries', {
    auth: false,
    method: 'POST',
    body: { ...input },
  });
}
