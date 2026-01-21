export default function Explorar() {
  return (
    <main className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Explorar</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg mb-2">
              Publicación destacada
            </h3>
            <p className="text-gray-600 text-sm">
              Descubre contenido interesante creado por la comunidad.
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
