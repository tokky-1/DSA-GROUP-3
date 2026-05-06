import { CheckCircle, Circle, Loader2 } from 'lucide-react'

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ProgressOverlay({ steps, stepIndex, percentage, error }) {
  const dashOffset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="card w-full max-w-md p-6 animate-slide-up">
        <h2 className="text-brand-800 dark:text-white font-semibold text-center text-lg mb-6">
          Converting your handwriting…
        </h2>

        {/* Circular progress */}
        <div className="flex justify-center mb-6">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r={RADIUS}
                fill="none"
                strokeWidth="8"
                className="stroke-brand-100 dark:stroke-gray-800"
              />
              <circle
                cx="60" cy="60" r={RADIUS}
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className="stroke-brand-500 dark:stroke-brand-400"
                style={{
                  strokeDasharray: CIRCUMFERENCE,
                  strokeDashoffset: dashOffset,
                  transition: 'stroke-dashoffset 0.6s ease',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-brand-700 dark:text-white">{percentage}%</span>
              <span className="text-xs text-brand-400 dark:text-gray-500 mt-0.5">complete</span>
            </div>
          </div>
        </div>

        {/* Current step label */}
        <div className="text-center mb-5 min-h-[1.5rem]">
          {stepIndex >= 0 && stepIndex < steps.length && (
            <p className="text-brand-600 dark:text-brand-400 text-sm font-medium animate-fade-in">
              {steps[stepIndex].label}…
            </p>
          )}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>

        {/* Step list */}
        <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
          {steps.map((step, idx) => {
            const done = idx < stepIndex
            const active = idx === stepIndex
            const pending = idx > stepIndex

            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active ? 'bg-brand-50 dark:bg-gray-800' : ''
                }`}
              >
                <div className="shrink-0">
                  {done && <CheckCircle className="w-4 h-4 text-brand-500 dark:text-brand-400" />}
                  {active && <Loader2 className="w-4 h-4 text-brand-500 dark:text-brand-400 animate-spin" />}
                  {pending && <Circle className="w-4 h-4 text-brand-200 dark:text-gray-700" />}
                </div>
                <span className={`text-sm ${
                  done   ? 'text-brand-500 dark:text-gray-400' :
                  active ? 'text-brand-700 dark:text-white font-medium' :
                           'text-brand-300 dark:text-gray-600'
                }`}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
