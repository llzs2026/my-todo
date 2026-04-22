import { useState } from 'react';
import { X, Trash2, Save, Flag, Calendar, List, Repeat } from 'lucide-react';
import { Task, Priority, RepeatType } from '../types';
import { useApp } from '../store/AppContext';

interface Props {
  task: Task;
  onClose: () => void;
}

const priorities: { value: Priority; label: string; color: string; activeClass: string }[] = [
  { value: 'none', label: '无', color: 'text-gray-500', activeClass: 'bg-gray-100 text-gray-700 border-gray-300' },
  { value: 'low', label: '低', color: 'text-blue-500', activeClass: 'bg-blue-50 text-blue-700 border-blue-300' },
  { value: 'medium', label: '中', color: 'text-yellow-500', activeClass: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
  { value: 'high', label: '高', color: 'text-red-500', activeClass: 'bg-red-50 text-red-700 border-red-300' },
];

const repeats: { value: RepeatType; label: string }[] = [
  { value: 'none', label: '不重复' },
  { value: 'daily', label: '每天' },
  { value: 'weekly', label: '每周' },
  { value: 'workdays', label: '工作日' },
  { value: 'monthly', label: '每月' },
  { value: 'yearly', label: '每年' },
];

export default function TaskModal({ task, onClose }: Props) {
  const { dispatch, state } = useApp();
  const [form, setForm] = useState({ ...task });

  function handleSave() {
    dispatch({ type: 'UPDATE_TASK', payload: form });
    onClose();
  }

  function handleDelete() {
    if (confirm('确定要删除这个任务吗？')) {
      dispatch({ type: 'DELETE_TASK', payload: task.id });
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">编辑任务</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">任务名称</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="添加备注..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={form.dueDate || ''}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value || null })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">截止时间</label>
              <input
                type="time"
                value={form.dueTime || ''}
                onChange={(e) => setForm({ ...form, dueTime: e.target.value || null })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setForm({ ...form, priority: p.value })}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    form.priority === p.value
                      ? p.activeClass
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">清单</label>
              <div className="relative">
                <List className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={form.listId}
                  onChange={(e) => setForm({ ...form, listId: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white appearance-none"
                >
                  {state.lists.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">重复</label>
              <div className="relative">
                <Repeat className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={form.repeat}
                  onChange={(e) => setForm({ ...form, repeat: e.target.value as RepeatType })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white appearance-none"
                >
                  {repeats.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            删除
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
