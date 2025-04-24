// types/index.ts
export interface Conversation {
    id: number;
    name: string;
    avatar?: string;
    lastMessage: string;
    timestamp: number;  
    online: boolean;
    active: boolean;
    messages: Array<Message> | []
}
  
export interface Message {
    id: number;
    content: string;
    timestamp: number;  
    sent: boolean;
    file?: {
      name: string;
      size: string;
    };
   
}