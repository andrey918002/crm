// ChatPage.tsx

import { useState, useEffect, useCallback, type ChangeEvent, type FormEvent } from 'react';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { Send, MessageSquare, Satellite, XCircle } from 'lucide-react';
// import { useChatSocket } from './useChatSocket'; // Припускаємо, що useChatSocket.ts поруч

// --- Мокаю useChatSocket для незалежності коду ---
// !!! ПОТРІБНО ЗАМІНИТИ НА РЕАЛЬНИЙ ХУК В ПРОЄКТІ !!!
const useChatSocket = (handleIncomingMessage: (data: IncomingWSData) => void) => {
  const isConnected = true; // Мок-статус
  const sendJsonMessage = (message: any) => {
    console.log('WS Message Sent:', message);
    // Імітація негайного оновлення UI для send_message
    if (message.command === 'send_message') {
      const tempMessage: Message = {
        id: Date.now(),
        content: message.content,
        sender: { id: 999, username: 'You', is_current_user: true }, // Мок
        timestamp: new Date().toISOString(),
      };
      handleIncomingMessage({ type: 'chat.message', chat_id: message.chat_id, message: tempMessage, sender: 'You' });
    }
  };

  useEffect(() => {
    // Імітація WS підключення
    console.log("WebSocket connected.");
    return () => {
      console.log("WebSocket disconnected.");
    };
  }, []);

  return { isConnected, sendJsonMessage };
};

// --- 1. Інтерфейси для Типобезпеки ---

interface Sender {
  id: number;
  username: string;
  is_current_user?: boolean;
}

interface Message {
  id: number;
  content: string;
  sender: Sender;
  timestamp: string;
}

interface Chat {
  id: number;
  title: string;
  unread_count: number;
  last_message: Message | null;
  participants: Sender[];
}

interface IncomingWSData {
  type: string; // 'chat.message'
  chat_id: number;
  message: Message;
  sender: string; // 'user_1'
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// --- 2. Конфігурація ---

const AUTH_TOKEN: string = 'MOCKED_AUTH_TOKEN';
const REST_BASE_URL: string = '/api';
const CHAT_API_URL: string = `${REST_BASE_URL}/chat/chats`;
const AUTH_HEADERS: { Authorization: string } = { Authorization: `Token ${AUTH_TOKEN}` };

// --- 3. Компонент ChatPage ---

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageContent, setNewMessageContent] = useState<string>('');
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  const handleIncomingMessage = useCallback((data: IncomingWSData) => {
    if (data.type === 'chat.message' && data.message && data.chat_id) {
      const { message, chat_id } = data;

      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === chat_id) {
          const updatedChat: Chat = { ...chat, last_message: message };

          if (chat_id === activeChatId) {
            setMessages(prev => [...prev, message]);
          } else {
            updatedChat.unread_count = (updatedChat.unread_count || 0) + 1;
          }
          return updatedChat;
        }
        return chat;
      }));
    }
  }, [activeChatId]);

  const { isConnected, sendJsonMessage } = useChatSocket(handleIncomingMessage);

  // 1. Початкове Завантаження (REST GET /api/chat/chats/)
  useEffect(() => {
    async function fetchChats() {
      try {
        const response: AxiosResponse<Chat[] | PaginatedResponse<Chat>> = await axios.get(CHAT_API_URL, { headers: AUTH_HEADERS });
        const data = response.data;

        if (Array.isArray(data)) {
          setChats(data);
        } else if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) {
          setChats(data.results);
        } else {
          console.error("Неочікуваний формат відповіді API для чатів:", data);
          setChats([]);
        }

      } catch (error) {
        console.error("Помилка завантаження списку чатів:", (error as AxiosError).message);
      }
    }
    fetchChats();
  }, []);

  // 2. Відкриття Чату (REST GET /api/chat/chats/{id}/ та WS mark_as_read)
  const openChat = async (chatId: number) => {
    setActiveChatId(chatId);
    setMessages([]);
    setLoadingMessages(true);

    try {
      const response = await axios.get<Chat & { messages: Message[] }>(`${CHAT_API_URL}/${chatId}/`, { headers: AUTH_HEADERS });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error(`Помилка завантаження історії чату ${chatId}:`, (error as AxiosError).message);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }

    sendJsonMessage({
      command: 'mark_as_read',
      chat_id: chatId,
    });

    setChats(prevChats => prevChats.map(chat =>
      chat.id === chatId ? { ...chat, unread_count: 0 } : chat
    ));
  };

  // Хелпер для отримання активного чату
  const activeChat = chats.find(c => c.id === activeChatId);

  // 3. Відправка Повідомлення (WS send_message)
  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!activeChatId || !newMessageContent.trim()) return;

    // Оновлення UI відбудеться через handleIncomingMessage у useChatSocket (мокі),
    // як для отримання, так і для відправлення, щоб уніфікувати логіку.
    sendJsonMessage({
      command: 'send_message',
      chat_id: activeChatId,
      content: newMessageContent.trim(),
    });

    setNewMessageContent('');
  };

  const handleContentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessageContent(e.target.value);
  }

  return (
    <div className="w-full flex h-screen bg-gray-50 antialiased">

      {/* Список Чатів */}
      <div className="w-full md:w-80 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-blue-600" /> Чати
          </h2>
          <div className={`mt-2 text-sm font-medium flex items-center ${isConnected ? 'text-green-600' : 'text-red-500'}`}>
            <Satellite size={16} className={`mr-1 ${isConnected ? 'animate-pulse' : ''}`} />
            {isConnected ? 'Статус: Online' : 'Статус: Offline'}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {chats.map((chat: Chat) => (
            <div
              key={chat.id}
              onClick={() => openChat(chat.id)}
              className={`p-4 cursor-pointer border-b transition duration-150 ease-in-out ${chat.id === activeChatId ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-100 border-gray-100'}`}
            >
              <div className="flex justify-between items-start">
                <div className="font-semibold text-gray-800 truncate">{chat.title}</div>
                {chat.unread_count > 0 &&
                  <span className="flex-shrink-0 ml-2 text-xs font-bold text-white bg-red-600 rounded-full h-5 w-5 flex items-center justify-center">
                    {chat.unread_count > 99 ? '99+' : chat.unread_count}
                  </span>
                }
              </div>
              <small className="block text-gray-500 mt-1 text-sm truncate">
                {chat.last_message ? chat.last_message.content : 'Немає повідомлень'}
              </small>
            </div>
          ))}
        </div>
      </div>

      {/* Вікно Повідомлень */}
      <div className="flex-grow flex flex-col bg-gray-50">
        {activeChatId ? (
          <>
            <header className="p-4 bg-white border-b border-gray-200 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">{activeChat?.title || `Чат #${activeChatId}`}</h3>
              {/* Можна додати список учасників тут */}
            </header>

            {/* Відображення Повідомлень */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 128px)' }}>
              {loadingMessages ? (
                <div className="text-center text-gray-500 pt-10">Завантаження історії повідомлень...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 pt-10">Повідомлень ще немає. Почніть розмову!</div>
              ) : (
                messages.map((msg: Message) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender?.is_current_user ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-md ${
                        msg.sender?.is_current_user
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                      }`}
                    >
                      <div className="font-bold text-xs mb-1">
                        {msg.sender?.is_current_user ? 'Ви' : msg.sender?.username || 'Невідомий'}
                      </div>
                      <p className="text-sm break-words">{msg.content}</p>
                      <span className="block text-right text-xs mt-1 opacity-70">
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Форма Відправки */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200 flex space-x-3">
              <input
                type="text"
                value={newMessageContent}
                onChange={handleContentChange}
                placeholder={isConnected ? "Введіть повідомлення..." : "Очікування підключення..."}
                disabled={!isConnected}
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={!isConnected || !newMessageContent.trim()}
                className="flex-shrink-0 px-5 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 transition duration-150"
                title="Надіслати"
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow text-gray-500">
            <XCircle size={48} className="mb-4 text-blue-300" />
            <p className="text-lg">Оберіть чат для початку спілкування.</p>
          </div>
        )}
      </div>
    </div>
  );
}