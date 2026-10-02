import React, { useState } from 'react';
import type { AIAnalysisReport, BusinessInput, RoadmapPhase, RoadmapTask } from '../../types';
import { 
  Calendar, 
  User, 
  ChevronRight, 
  ListTodo
} from 'lucide-react';

interface Props {
  report: AIAnalysisReport;
  input: BusinessInput;
}

export const ImplementationPlanDashboard: React.FC<Props> = ({ report, input }) => {
  const curr = input.currency || '$';
  
  // Local state for interactive status updates
  const [phases, setPhases] = useState<RoadmapPhase[]>(report.roadmapPhases || []);

  const totalTasks = phases.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = phases.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'Completed').length, 0);
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleTaskStatusChange = (phaseIdx: number, taskId: string, newStatus: RoadmapTask['status']) => {
    const updated = [...phases];
    const task = updated[phaseIdx].tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      // Auto-update phase status if all completed
      const allComp = updated[phaseIdx].tasks.every(t => t.status === 'Completed');
      const anyInProg = updated[phaseIdx].tasks.some(t => t.status === 'In Progress' || t.status === 'Completed');
      updated[phaseIdx].status = allComp ? 'Completed' : anyInProg ? 'In Progress' : 'Not Started';
      setPhases(updated);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Overall Implementation Progress Bar */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ListTodo className="w-6 h-6 text-blue-600" />
            Strategic Implementation Plan & Roadmap
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Turn recommendations into an actionable step-by-step business execution roadmap.
          </p>
        </div>

        <div className="w-full md:w-64 bg-gray-50 p-4 rounded-xl border border-gray-100 shrink-0">
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-gray-700">Implementation Progress</span>
            <span className="text-blue-600">{progressPct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block text-right">{completedTasks} of {totalTasks} Tasks Completed</span>
        </div>
      </div>

      {/* Visual Step-by-Step Timeline Diagram */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-x-auto scrollbar-none">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Execution Sequence Overview</h3>
        <div className="flex items-center gap-4 min-w-[700px]">
          {phases.map((ph, idx) => (
            <React.Fragment key={ph.phaseNumber}>
              <div className={`flex-1 p-4 rounded-xl border transition-all ${
                ph.status === 'Completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                ph.status === 'In Progress' ? 'bg-blue-50 border-blue-200 text-blue-900' :
                'bg-gray-50 border-gray-200 text-gray-600'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-gray-900 border border-gray-200">
                    Phase {ph.phaseNumber}
                  </span>
                  <span className="text-[10px] font-semibold">{ph.duration}</span>
                </div>
                <h4 className="text-xs font-bold truncate mb-1">{ph.title}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                  ph.status === 'Completed' ? 'bg-emerald-200 text-emerald-800' :
                  ph.status === 'In Progress' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
                }`}>
                  {ph.status}
                </span>
              </div>

              {idx < phases.length - 1 && (
                <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Detailed Phase Checklist Cards */}
      <div className="space-y-6">
        {phases.map((ph, phaseIdx) => (
          <div key={ph.phaseNumber} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm border border-blue-100">
                  P{ph.phaseNumber}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{ph.title}</h3>
                  <p className="text-xs text-gray-500">{ph.objective}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Timeline: {ph.duration}</span>
              </div>
            </div>

            {/* Task Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3 pl-2">Task</th>
                    <th className="pb-3">Responsible Role</th>
                    <th className="pb-3">Dates</th>
                    <th className="pb-3">Budget</th>
                    <th className="pb-3">Priority</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2">Expected Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ph.tasks.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 pl-2 font-semibold text-gray-900 max-w-[200px]">
                        {t.task}
                      </td>

                      <td className="py-3.5 text-gray-600 font-medium">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {t.role}
                        </span>
                      </td>

                      <td className="py-3.5 text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {t.startDate}
                        </span>
                      </td>

                      <td className="py-3.5 font-semibold text-gray-900">
                        {curr}{t.budget.toLocaleString()}
                      </td>

                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {t.priority}
                        </span>
                      </td>

                      <td className="py-3.5">
                        <select
                          value={t.status}
                          onChange={(e) => handleTaskStatusChange(phaseIdx, t.id, e.target.value as any)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                            t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            t.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            t.status === 'Delayed' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Delayed">Delayed</option>
                        </select>
                      </td>

                      <td className="py-3.5 pr-2 text-gray-600 text-[11px] leading-relaxed">
                        {t.expectedResult}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
