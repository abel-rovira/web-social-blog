export default function CrearPublicacion() {
  return (
    <main className="max-w-2xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Crear publicación</h1>

      <form className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <input
          type="text"
          placeholder="Título"
          className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <textarea
          rows="6"
          placeholder="¿Qué quieres compartir?"
          className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Publicar
        </button>
      </form>
    </main>
  );
}
