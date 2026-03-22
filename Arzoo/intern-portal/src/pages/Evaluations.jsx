import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { mockEvaluations } from "../data/mockData";

export default function Evaluations() {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState(mockEvaluations);
  const [editingId, setEditingId] = useState(null);
  const [editMarks, setEditMarks] = useState({});
  const isIntern = user?.role === "intern";
  const visibleEvals = isIntern ? evaluations.filter((e) => e.internId === user.id) : evaluations;

  const handleEdit = (ev) => {
    setEditingId(ev.id);
    setEditMarks({ taskMarks: ev.taskMarks, reportMarks: ev.reportMarks, attendance: ev.attendance });
  };

  const handleSave = (id) => {
    const total = Math.round((Number(editMarks.taskMarks) + Number(editMarks.reportMarks) + Number(editMarks.attendance)) / 3);
    setEvaluations(
      evaluations.map((e) => e.id === id ? { ...e, taskMarks: Number(editMarks.taskMarks), reportMarks: Number(editMarks.reportMarks), attendance: Number(editMarks.attendance), totalMarks: total } : e)
        .sort((a, b) => b.totalMarks - a.totalMarks).map((e, i) => ({ ...e, rank: i + 1 }))
    );
    setEditingId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isIntern ? "My Marks" : "Evaluations"}</h1>
      {isIntern && visibleEvals.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Task Marks", value: visibleEvals[0].taskMarks },
            { label: "Report Marks", value: visibleEvals[0].reportMarks },
            { label: "Attendance", value: `${visibleEvals[0].attendance}%` },
            { label: "Total Score", value: `${visibleEvals[0].totalMarks}%`, highlight: true },
          ].map((card) => (
            <div key={card.label} className={`bg-white rounded-xl p-5 border shadow-sm text-center ${card.highlight ? "border-green-200 bg-green-50" : "border-gray-100"}`}>
              <p className={`text-sm ${card.highlight ? "text-green-700" : "text-gray-500"}`}>{card.label}</p>
              <p className={`text-2xl font-bold mt-1 ${card.highlight ? "text-green-700" : "text-gray-800"}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">{isIntern ? "Score Breakdown" : "🏆 Leaderboard"}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Task</th>
                <th className="px-5 py-3">Report</th>
                <th className="px-5 py-3">Attendance</th>
                <th className="px-5 py-3">Total</th>
                {user?.role === "teamlead" && <th className="px-5 py-3">Action</th>}
              </tr>
            </thead>
            <tbody>
              {visibleEvals.map((ev) => (
                <tr key={ev.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <span className={`w-7 h-7 inline-flex items-center justify-center rounded-full text-sm font-semibold ${ev.rank === 1 ? "bg-yellow-100 text-yellow-700" : ev.rank === 2 ? "bg-gray-100 text-gray-700" : ev.rank === 3 ? "bg-orange-100 text-orange-700" : "bg-gray-50 text-gray-500"}`}>{ev.rank}</span>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-800">{ev.internName}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {editingId === ev.id ? <input type="number" value={editMarks.taskMarks} onChange={(e) => setEditMarks({ ...editMarks, taskMarks: e.target.value })} className="w-16 px-2 py-1 border rounded text-sm" /> : ev.taskMarks}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {editingId === ev.id ? <input type="number" value={editMarks.reportMarks} onChange={(e) => setEditMarks({ ...editMarks, reportMarks: e.target.value })} className="w-16 px-2 py-1 border rounded text-sm" /> : ev.reportMarks}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {editingId === ev.id ? <input type="number" value={editMarks.attendance} onChange={(e) => setEditMarks({ ...editMarks, attendance: e.target.value })} className="w-16 px-2 py-1 border rounded text-sm" /> : `${ev.attendance}%`}
                  </td>
                  <td className="px-5 py-3"><span className="text-sm font-semibold text-green-700">{ev.totalMarks}%</span></td>
                  {user?.role === "teamlead" && (
                    <td className="px-5 py-3">
                      {editingId === ev.id ? (
                        <span><button onClick={() => handleSave(ev.id)} className="text-green-600 text-sm mr-2">Save</button><button onClick={() => setEditingId(null)} className="text-gray-400 text-sm">Cancel</button></span>
                      ) : <button onClick={() => handleEdit(ev)} className="text-green-600 text-sm">Edit</button>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
