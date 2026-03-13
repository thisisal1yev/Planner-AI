import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Planner AI</h1>
          <p className="text-gray-500 mt-1 text-sm">Маркетплейс для организации мероприятий</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
