import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Task, TaskList, ViewType } from '../types';

interface AppState {
  tasks: Task[];
  lists: TaskList[];
  activeView: ViewType;
}

const initialLists: TaskList[] = [
  { id: 'inbox', name: '收集箱', color: '#6B7280' },
  { id: 'personal', name: '个人', color: '#3B82F6' },
  { id: 'work', name: '工作', color: '#8B5CF6' },
  { id: 'study', name: '学习', color: '#10B981' },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getDefaultTasks(): Task[] {
  const today = new Date().toISOString().split('T')[0];
  return [
    {
      id: generateId(),
      title: '欢迎使用 My Todo',
      description: '这是一个简洁的跨平台待办应用。点击任务可以编辑详情，点击左侧圆圈标记完成。',
      completed: false,
      priority: 'medium',
      dueDate: today,
      dueTime: null,
      listId: 'inbox',
      repeat: 'none',
      createdAt: Date.now(),
      completedAt: null,
      tags: [],
    },
    {
      id: generateId(),
      title: '尝试创建一个新任务',
      description: '',
      completed: false,
      priority: 'high',
      dueDate: today,
      dueTime: null,
      listId: 'personal',
      repeat: 'none',
      createdAt: Date.now() - 10000,
      completedAt: null,
      tags: [],
    },
  ];
}

const initialState: AppState = {
  tasks: [],
  lists: initialLists,
  activeView: 'today',
};

type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'ADD_LIST'; payload: TaskList }
  | { type: 'UPDATE_LIST'; payload: TaskList }
  | { type: 'DELETE_LIST'; payload: string };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return {
        ...action.payload,
        lists: action.payload.lists.length ? action.payload.lists : initialLists,
      };
    case 'SET_VIEW':
      return { ...state, activeView: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case 'TOGGLE_TASK': {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (!task) return state;
      const updated = {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? Date.now() : null,
      };
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload ? updated : t)),
      };
    }
    case 'ADD_LIST':
      return { ...state, lists: [...state.lists, action.payload] };
    case 'UPDATE_LIST':
      return {
        ...state,
        lists: state.lists.map((l) => (l.id === action.payload.id ? action.payload : l)),
      };
    case 'DELETE_LIST': {
      const newLists = state.lists.filter((l) => l.id !== action.payload);
      const fallbackId = newLists[0]?.id || 'inbox';
      return {
        ...state,
        lists: newLists,
        tasks: state.tasks.map((t) =>
          t.listId === action.payload ? { ...t, listId: fallbackId } : t
        ),
      };
    }
    default:
      return state;
  }
}

const STORAGE_KEY = 'my-todo-app-v1';

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } else {
        dispatch({ type: 'LOAD_STATE', payload: { ...initialState, tasks: getDefaultTasks() } });
      }
    } catch {
      dispatch({ type: 'LOAD_STATE', payload: { ...initialState, tasks: getDefaultTasks() } });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
