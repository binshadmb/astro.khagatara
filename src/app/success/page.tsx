export default function Success() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md text-center">
        <div className="text-6xl mb-4">✨</div>
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-300 mb-6">
          Your Khagatara report is being generated.
          You will receive it shortly.
        </p>
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <p className="text-gray-400 text-sm">
            Check your email for your full Vedic numerology report PDF.
          </p>
        </div>
        <a
          href="/"
          className="w-full bg-yellow-400 text-gray-950 font-bold rounded-xl p-4 block"
        >
          Calculate Another Report
        </a>
      </div>
    </main>
  )
}
