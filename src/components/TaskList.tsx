import { useApp } from '../store/AppContext';
import { isToday, isTomorrow, isWithinInterval, addDays, startOfDay, parseISO, format, isBefore } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import TaskItem from './TaskItem';
import { useState } from 'react';
import TaskModal from './TaskModal';
import { ClipboardList } from 'lucide-react';

export default function TaskListView() {
  const { state } = useApp();
  const [editingTask, setEditingTask] = useState<string | null>(null);

  function getFilteredTasks() {
    const { tasks, activeView } = state;
    switch (activeView) {
      case 'today':
        return tasks.filter((t) => {
          if (t.completed || !t.dueDate) return false;
          const date = parseISO(t.dueDate);
          return isToday(date) || isBefore(date, startOfDay(new Date()));
        });
      case 'tomorrow':
        return tasks.filter((t) => !t.completed && t.dueDate && isTomorrow(parseISO(t.dueDate)));
      case 'next7days': {
        const today = startOfDay(new Date());
        const next7 = addDays(today, 7);
        return tasks.filter(
          (t) =>
            !t.completed &&
            t.dueDate &&
            isWithinInterval(parseISO(t.dueDate), { start: today, end: next7 })
        );
      }
      case 'completed':
        return tasks
          .filter((t) => t.completed)
          .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
      case 'inbox':
        return tasks.filter((t) => !t.completed && t.listId === 'inbox');
      default:
        return tasks.filter((t) => !t.completed && t.listId === activeView);
    }
  }

  function getViewTitle(): string {
    switch (state.activeView) {
      case 'today':
        return '今天';
      case 'tomorrow':
        return '明天';
      case 'next7days':
        return '最近7天';
      case 'inbox':
        return '收集箱';
      case 'completed':
        return '已完成';
      default: {
        const list = state.lists.find((l) => l.id === state.activeView);
        return list?.name || '任务';
      }
    }
  }

  function getViewSubtitle(): string {
    switch (state.activeView) {
      case 'today':
        return format(new Date(), 'M月d日 EEEE', { locale: zhCN });
      case 'tomorrow':
        return format(addDays(new Date(), 1), 'M月d日 EEEE', { locale: zhCN });
      default:
        return `${getFilteredTasks().length} 个待办`;
    }
  }

  const tasks = getFilteredTasks();
  const editingTaskData = state.tasks.find((t) => t.id === editingTask);

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-5 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-900">{getViewTitle()}</h2>
          <p className="text-sm text-gray-500 mt-1">{getViewSubtitle()}</p>
        </div>

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ClipboardList className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-500">没有任务</p>
            <p className="text-sm mt-1">享受你的自由时光，或者添加一个新任务</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={() => setEditingTask(task.id)} />
            ))}
          </div>
        )}
      </div>

      {editingTaskData && (
        <TaskModal task={editingTaskData} onClose={() => setEditingTask(null)} />
      )}
    </>
  );
}
