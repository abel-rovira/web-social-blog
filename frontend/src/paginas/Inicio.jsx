import { Heart, MessageCircle, Bookmark } from "lucide-react";

export default function Inicio() {
  return (
    <main className="max-w-3xl mx-auto mt-8 space-y-6 px-4">
      {[1, 2, 3].map((post) => (
        <article
          key={post}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
        >
          {/* header */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src="https://via.placeholder.com/40"
              className="w-10 h-10 rounded-full"
              alt=""
            />
            <div>
              <p className="font-semibold text-gray-900">usuario_demo</p>
              <p className="text-sm text-gray-500">hace 2h</p>
            </div>
          </div>

          {/* contenido */}
          <h2 className="text-xl font-bold mb-2 text-gray-900">
            Cómo mejorar tu productividad como dev
          </h2>

          <p className="text-gray-700 mb-4">
            Aquí va un extracto atractivo de la publicación para enganchar al lector…
          </p>

          {/* acciones */}
          <div className="flex justify-between items-center text-gray-500">
            <div className="flex gap-6">
              <button className="flex items-center gap-1 hover:text-red-500">
                <Heart className="w-5 h-5" /> 12
              </button>
              <button className="flex items-center gap-1 hover:text-blue-500">
                <MessageCircle className="w-5 h-5" /> 4
              </button>
            </div>
            <button className="hover:text-yellow-500">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </article>
      ))}
    </main>
  );
}
