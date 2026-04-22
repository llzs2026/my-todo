import { useState } from 'react';
import { Plus, Flag } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Task, Priority } from '../types';

export default function QuickAdd() {
  const { dispatch, state } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('none');
  const [dueDate, setDueDate] = useState('');
  const [listId, setListId] = useState(state.lists[0]?.id || 'inbox');

  function handleSubmit() {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      title: title.trim(),
      description: '',
      completed: false,
      priority,
      dueDate: dueDate || null,
      dueTime: null,
      listId,
      repeat: 'none',
      createdAt: Date.now(),
      completedAt: null,
      tags: [],
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    setTitle('');
    setPriority('none');
    setDueDate('');
    setExpanded(false);
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors text-left"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm">添加任务</span>
        </button>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="准备做什么？"
            className="w-full text-base px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="">无日期</option>
              <option value={todayStr}>今天</option>
              <option value={tomorrowStr}>明天</option>
            </select>

            <select
              value={listId}
              onChange={(e) => setListId(e.target.value)}
              className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {state.lists.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
              {(['none', 'low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`p-1.5 rounded-md transition-colors ${
                    priority === p
                      ? p === 'high'
                        ? 'bg-red-100 text-red-600'
                        : p === 'medium'
                        ? 'bg-yellow-100 text-yellow-600'
                        : p === 'low'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-200 text-gray-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={p === 'high' ? '高优先级' : p === 'medium' ? '中优先级' : p === 'low' ? '低优先级' : '无优先级'}
                >
                  <Flag className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setExpanded(false);
                setTitle('');
                setPriority('none');
                setDueDate('');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              添加任务
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
