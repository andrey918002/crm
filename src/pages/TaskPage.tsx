// TaskPage.tsx

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { Plus, CheckCircle, Trash2, ListChecks, UserCheck } from 'lucide-react';

// --- Інтерфейси ---

interface Task {
  id: number;
  title: string;
  status: 'New' | 'In Progress' | 'Completed';
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// --- Конфігурація ---

const AUTH_TOKEN: string = 'MOCKED_AUTH_TOKEN';
const REST_BASE_URL: string = '/api';
const TASKS_API_URL: string = `${REST_BASE_URL}/tasks`;
const AUTH_HEADERS: { Authorization: string } = { Authorization: `Token ${AUTH_TOKEN}` };

// --- Компонент TaskPage ---

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'my'>('all'); // Додаємо фільтр

  // Хелпер для вибору масиву з пагінованої/непагінованої відповіді
  const extractTasks = (data: Task[] | PaginatedResponse<Task>): Task[] => {
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) {
      return data.results;
    }
    console.error("Неочікуваний формат відповіді API для задач:", data);
    return [];
  };

  // 1. Завантаження всіх задач (GET /api/tasks/)
  const fetchTasks = async () => {
    setLoading(true);
    setFilter('all');
    try {
      const response: AxiosResponse<Task[] | PaginatedResponse<Task>> = await axios.get(TASKS_API_URL, { headers: AUTH_HEADERS });
      setTasks(extractTasks(response.data));
    } catch (error) {
      console.error("Помилка завантаження всіх задач:", (error as AxiosError).message);
    } finally {
      setLoading(false);
    }
  };

  // 5. Функція для отримання задач поточного користувача (GET /api/tasks/my_tasks/)
  const fetchMyTasks = async () => {
    setLoading(true);
    setFilter('my');
    try {
      const response: AxiosResponse<Task[] | PaginatedResponse<Task>> = await axios.get(`${TASKS_API_URL}/my_tasks/`, { headers: AUTH_HEADERS });
      setTasks(extractTasks(response.data));
    } catch (error) {
      console.error("Помилка завантаження особистих задач:", (error as AxiosError).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Створення нової задачі (POST /api/tasks/)
  const createTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post<Task>(TASKS_API_URL, { title: newTaskTitle }, { headers: AUTH_HEADERS });
      // Оновлюємо список, лише якщо поточний фільтр "Всі" або, якщо логіка бекенду додає нові задачі до "Моїх"
      setTasks(prevTasks => [...prevTasks, response.data]);
      setNewTaskTitle('');
    } catch (error) {
      console.error("Помилка створення задачі:", (error as AxiosError).message);
    }
  };

  // 3. Зміна статусу на "Completed" (POST /api/tasks/{id}/complete/)
  const completeTask = async (taskId: number) => {
    try {
      await axios.post(`${TASKS_API_URL}/${taskId}/complete/`, {}, { headers: AUTH_HEADERS });
      setTasks(prevTasks => prevTasks.map(task =>
        task.id === taskId ? { ...task, status: 'Completed' } : task
      ));
    } catch (error) {
      console.error("Помилка виконання задачі:", (error as AxiosError).message);
    }
  };

  // 4. Видалення задачі (DELETE /api/tasks/{id}/)
  const deleteTask = async (taskId: number) => {
    try {
      await axios.delete(`${TASKS_API_URL}/${taskId}/`, { headers: AUTH_HEADERS });
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Помилка видалення задачі:", (error as AxiosError).message);
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.target.value);
  }

  // --- Хелпери стилів ---
  const getStatusClasses = (status: Task['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 ring-green-500';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700 ring-yellow-500';
      case 'New':
      default:
        return 'bg-blue-100 text-blue-700 ring-blue-500';
    }
  }

  // --- JSX Рендеринг ---
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Хедер та Фільтри */}
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <ListChecks className="text-blue-600" size={32} /> Сторінка Завдань
          </h1>
          <p className="text-gray-500 mt-1">Керуйте своїми задачами та проектами.</p>

          {/* Кнопки завантаження/фільтрації */}
          <div className="mt-5 flex space-x-3">
            <button
              onClick={fetchTasks}
              disabled={loading || filter === 'all'}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition duration-150 ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
            >
              <ListChecks size={18} className="mr-2" />
              Всі Задачі
            </button>
            <button
              onClick={fetchMyTasks}
              disabled={loading || filter === 'my'}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition duration-150 ${filter === 'my' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
            >
              <UserCheck size={18} className="mr-2" />
              Мої Задачі
            </button>
          </div>
        </header>

        {/* Форма створення */}
        <form onSubmit={createTask} className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100 flex space-x-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={handleTitleChange}
            placeholder="Нова назва завдання..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim() || loading}
            className="flex-shrink-0 flex items-center px-5 py-3 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 disabled:bg-gray-400 transition duration-150"
          >
            <Plus size={18} className="mr-2" />
            Створити
          </button>
        </form>

        {/* Список задач */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center p-8 text-lg text-gray-500">Завантаження задач...</div>
          ) : tasks.length === 0 ? (
            <p className="text-center p-8 text-lg text-gray-500 bg-white rounded-xl shadow-md">
              Задач за цим фільтром немає. Створіть нову!
            </p>
          ) : (
            tasks.map((task: Task) => (
              <div
                key={task.id}
                className={`bg-white rounded-xl p-5 shadow-md flex justify-between items-center transition-all duration-300 
                            ${task.status === 'Completed' ? 'opacity-70 border-l-4 border-green-500' : 'hover:shadow-lg border border-gray-100'}`}
              >
                <div className="flex-grow">
                  <h3 className={`text-lg font-semibold text-gray-900 ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                  {/* Статус - чіп */}
                  <span
                    className={`mt-1 inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${getStatusClasses(task.status)}`}
                  >
                      {task.status}
                  </span>
                </div>

                {/* Кнопки виконання/видалення */}
                <div className="flex space-x-3 ml-4">
                  {task.status !== 'Completed' && (
                    <button
                      onClick={() => completeTask(task.id)}
                      title="Позначити як Виконано"
                      className="p-2 text-sm font-medium rounded-full text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 transition duration-150 disabled:opacity-50"
                      disabled={loading}
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    title="Видалити Задачу"
                    className="p-2 text-sm font-medium rounded-full text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 transition duration-150 disabled:opacity-50"
                    disabled={loading}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}