export default function Perfil() {
  return (
    <main className="max-w-4xl mx-auto mt-8 px-4 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6 flex gap-6 items-center">
        <img
          src="https://via.placeholder.com/100"
          className="w-24 h-24 rounded-full"
          alt=""
        />

        <div>
          <h1 className="text-2xl font-bold">usuario_demo</h1>
          <p className="text-gray-500">@usuario_demo</p>

          <div className="flex gap-6 mt-4 text-sm">
            <span><b>10</b> posts</span>
            <span><b>120</b> seguidores</span>
            <span><b>80</b> siguiendo</span>
          </div>
        </div>
      </div>
    </main>
  );
}
