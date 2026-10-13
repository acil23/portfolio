import {
  createContactMessage,
  deleteContactMessage,
  getContactMessageById,
  getContactMessagesAdmin,
  updateContactMessage,
} from "@/server/repositories/contact.repository";

export async function createContact(data: {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}) {
  return createContactMessage(data);
}

export async function fetchContactMessagesAdmin() {
  return getContactMessagesAdmin();
}

export async function fetchContactMessageAdminById(id: string) {
  return getContactMessageById(id);
}

export async function updateContactAdmin(id: string, data: { isRead: boolean }) {
  return updateContactMessage(id, data);
}

export async function deleteContactAdmin(id: string) {
  return deleteContactMessage(id);
}
