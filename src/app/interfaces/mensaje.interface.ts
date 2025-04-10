export interface Mensaje {
    _id: string;
    title: string;
    body: string;
    senderId: string;
    audience: 'all' | 'single';
    receiverId?: string;
    createdAt?: Date;
    sentAt?: Date;
  }
  