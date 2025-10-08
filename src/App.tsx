import { Navbar, Header, Footer } from '@/layouts';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-center">Main Content Area</h2>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
