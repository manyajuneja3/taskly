import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
