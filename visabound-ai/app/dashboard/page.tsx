
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, Thomas
          </h1>
          <p className="text-gray-400 mt-2">
            Here’s your Dashboard overview
          </p>
        </div>

        {/* Placeholder Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">
            Your personalized feed
          </h2>
          <p className="text-gray-400 text-sm">
            Updates tailored to your visa status will appear here.
          </p>
        </div>

      </div>
    </div>
  );
}