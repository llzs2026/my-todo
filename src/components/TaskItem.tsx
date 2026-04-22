import { Check, Flag, Calendar } from 'lucide-react';
import { Task } from '../types';
import { useApp } from '../store/AppContext';
import { formatDate, isOverdue } from '../utils/dateUtils';

interface Props {
  task: Task;
  onEdit: () => void;
}

const priorityConfig = {
  high: { color: 'text-red-500', bg: 'bg-red-50', label: '高' },
  medium: { color: 'text-yellow-500', bg: 'bg-yellow-50', label: '中' },
  low: { color: 'text-blue-500', bg: 'bg-blue-50', label: '低' },
  none: { color: 'text-gray-300', bg: 'bg-gray-50', label: '' },
};

export default function TaskItem({ task, onEdit }: Props) {
  const { dispatch, state } = useApp();
  const p = priorityConfig[task.priority];
  const list = state.lists.find((l) => l.id === task.listId);
  const overdue = isOverdue(task.dueDate);

  return (
    <div
      className="group flex items-start gap-3 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onEdit}
    >
      <button
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          task.completed
            ? 'bg-primary-500 border-primary-500'
            : 'border-gray-300 hover:border-primary-400'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: 'TOGGLE_TASK', payload: task.id });
        }}
      >
        {task.completed && <Check className="w-3 h-3 text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
          {task.title}
        </div>
        {(task.dueDate || list) && (
          <div className="flex items-center gap-3 mt-1.5">
            {task.dueDate && (
              <span className={`inline-flex items-center gap-1 text-xs ${overdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                <Calendar className="w-3 h-3" />
                {formatDate(task.dueDate)}
                {task.dueTime && ` ${task.dueTime}`}
                {overdue && ' (已逾期)'}
              </span>
            )}
            {list && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: list.color }} />
                {list.name}
              </span>
            )}
          </div>
        )}
      </div>

      {task.priority !== 'none' && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${p.bg} ${p.color}`}>
          <Flag className="w-3 h-3" />
          {p.label}
        </div>
      )}
    </div>
  );
}
