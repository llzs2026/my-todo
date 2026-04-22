import { Calendar, CalendarDays, CheckCircle2, Inbox, Layout, ListTodo, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { isToday, isTomorrow, isWithinInterval, addDays, startOfDay, parseISO, isBefore } from 'date-fns';
import { ViewType } from '../types';

const views = [
  { id: 'today' as ViewType, name: '今天', icon: Calendar },
  { id: 'tomorrow' as ViewType, name: '明天', icon: CalendarDays },
  { id: 'next7days' as ViewType, name: '最近7天', icon: ListTodo },
  { id: 'inbox' as ViewType, name: '收集箱', icon: Inbox },
  { id: 'completed' as ViewType, name: '已完成', icon: CheckCircle2 },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { state, dispatch } = useApp();
  const [showListManager, setShowListManager] = useState(false);
  const [newListName, setNewListName] = useState('');

  function getCount(viewId: ViewType): number {
    const { tasks } = state;
    switch (viewId) {
      case 'today':
        return tasks.filter((t) => {
          if (t.completed || !t.dueDate) return false;
          const date = parseISO(t.dueDate);
          return isToday(date) || isBefore(date, startOfDay(new Date()));
        }).length;
      case 'tomorrow':
        return tasks.filter((t) => !t.completed && t.dueDate && isTomorrow(parseISO(t.dueDate))).length;
      case 'next7days': {
        const today = startOfDay(new Date());
        const next7 = addDays(today, 7);
        return tasks.filter(
          (t) =>
            !t.completed &&
            t.dueDate &&
            isWithinInterval(parseISO(t.dueDate), { start: today, end: next7 })
        ).length;
      }
      case 'inbox':
        return tasks.filter((t) => !t.completed && t.listId === 'inbox').length;
      case 'completed':
        return tasks.filter((t) => t.completed).length;
      default:
        return tasks.filter((t) => !t.completed && t.listId === viewId).length;
    }
  }

  function handleAddList() {
    if (!newListName.trim()) return;
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    const newList = {
      id: Date.now().toString(36),
      name: newListName.trim(),
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    dispatch({ type: 'ADD_LIST', payload: newList });
    setNewListName('');
    setShowListManager(false);
  }

  return (
    <div className="flex flex-col h-full w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Layout className="w-6 h-6 text-primary-600" />
          <h1 className="text-lg font-bold text-gray-800">My Todo</h1>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          任务
        </div>
        {views.map((view) => {
          const Icon = view.icon;
          const isActive = state.activeView === view.id;
          const count = getCount(view.id);
          return (
            <button
              key={view.id}
              onClick={() => {
                dispatch({ type: 'SET_VIEW', payload: view.id });
                onClose?.();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 mx-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                <span>{view.name}</span>
              </div>
              {count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}

        <div className="mt-4 px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
          <span>清单</span>
        </div>
        {state.lists.map((list) => {
          const isActive = state.activeView === list.id;
          const count = getCount(list.id);
          return (
            <button
              key={list.id}
              onClick={() => {
                dispatch({ type: 'SET_VIEW', payload: list.id });
                onClose?.();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 mx-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: list.color }}
                />
                <span className="truncate">{list.name}</span>
              </div>
              {count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}

        <button
          onClick={() => setShowListManager(!showListManager)}
          className="w-full flex items-center gap-3 px-3 py-2 mx-2 mt-1 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>新建清单</span>
        </button>

        {showListManager && (
          <div className="px-5 py-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="清单名称"
                className="flex-1 text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
              />
              <button
                onClick={handleAddList}
                className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
              >
                添加
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
