// useChatSocket.ts (файл повинен мати розширення .ts)

import { useState, useEffect, useRef, useCallback } from 'react';

// --- Типи ---

/** Тип для обробника вхідних WebSocket повідомлень. */
type MessageHandler = (data: any) => void;

/** Тип для функції відправки JSON повідомлень. */
type SendJsonFunction = (message: object) => void;

/** Інтерфейс для об'єкта, який повертає хук. */
interface ChatSocketHook {
  isConnected: boolean;
  sendJsonMessage: SendJsonFunction;
}

// --- Конфігурація ---

const AUTH_TOKEN: string = 'MOCKED_AUTH_TOKEN'; // !!! ЗАМІНІТЬ НА ВАШ РЕАЛЬНИЙ ТОКЕН !!!
const WS_BASE_URL: string = 'ws://127.0.0.1:8000/ws/chat/';
const WS_URL: string = `${WS_BASE_URL}?token=${AUTH_TOKEN}`;

// --- Хук useChatSocket ---

export const useChatSocket = (onMessageReceived: MessageHandler): ChatSocketHook => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);

  const sendJsonMessage: SendJsonFunction = useCallback((message: object) => {
    if (socketRef.current instanceof WebSocket && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error(
        "WebSocket не підключений (ReadyState:",
        socketRef.current?.readyState,
        "). Повідомлення не надіслано:",
        message
      );
    }
  }, []);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket: Підключено');
      setIsConnected(true);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessageReceived) {
          onMessageReceived(data);
        }
      } catch (e) {
        console.error("Помилка парсингу JSON з WebSocket:", event.data, e);
      }
    };

    ws.onclose = (e: CloseEvent) => {
      console.log('WebSocket: Відключено', e);
      setIsConnected(false);
    };

    ws.onerror = (err: Event) => {
      console.error('WebSocket: Помилка', err);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [onMessageReceived]);

  return { isConnected, sendJsonMessage };
};