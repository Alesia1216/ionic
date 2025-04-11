export interface Usuario {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Mensaje {
  _id: string;
  title: string;
  body: string;
  senderId: string;
  audience: 'all' | 'single';
  receiverId?: string;
  createdAt?: Date;
  sentAt?: Date;
  readBy: {
    user: Usuario;
    readAt: Date;
    _id: string;
  }[];
}

export interface MensajeLeido {
  messageId: string;
  userId: string;
}