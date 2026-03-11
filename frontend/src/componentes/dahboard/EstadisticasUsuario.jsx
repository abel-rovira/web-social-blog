import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Eye, Heart, MessageCircle, Calendar, TrendingUp, Users } from 'lucide-react';
import { publicacionesAPI } from '../../servicios/api';

const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6'];

const EstadisticasUsuario = ({ usuarioId }) => {
  const [periodo, setPeriodo] = useState('semana');
  const [estadisticas, setEstadisticas] = useState({
    vistas: 0,
    likes: 0,
    comentarios: 0,
    publicaciones: 0
  });
  const [datosGrafico, setDatosGrafico] = useState([]);
  const [topPublicaciones, setTopPublicaciones] = useState([]);

  useEffect(() => {
    cargarEstadisticas();
  }, [periodo, usuarioId]);

  const cargarEstadisticas = async () => {
    try {
      // Aquí conectarías con tu API real
      // Simulación de datos
      setEstadisticas({
        vistas: 15420,
        likes: 3421,
        comentarios: 892,
        publicaciones: 23
      });

      setDatosGrafico([
        { name: 'Lun', vistas: 1200, likes: 340 },
        { name: 'Mar', vistas: 1800, likes: 520 },
        { name: 'Mié', vistas: 1600, likes: 480 },
        { name: 'Jue', vistas: 2100, likes: 630 },
        { name: 'Vie', vistas: 2400, likes: 720 },
        { name: 'Sáb', vistas: 1800, likes: 540 },
        { name: 'Dom', vistas: 1300, likes: 390 },
      ]);

      setTopPublicaciones([
        { id: 1, titulo: 'El arte de escribir', vistas: 3240, likes: 892 },
        { id: 2, titulo: 'Encontrar tu voz', vistas: 2890, likes: 721 },
        { id: 3, titulo: 'Palabras simples', vistas: 2450, likes: 654 },
      ]);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const datosPie = [
    { name: 'Vistas', value: estadisticas.vistas },
    { name: 'Likes', value: estadisticas.likes },
    { name: 'Comentarios', value: estadisticas.comentarios },
  ];

  return (
    <div className="space-y-6">
      {/* Selector de período */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Tus Estadísticas</h2>
        <div className="flex gap-2">
          {['semana', 'mes', 'año'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                periodo === p
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vistas totales</p>
              <p className="text-3xl font-bold text-gray-900">{estadisticas.vistas.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 12% vs período anterior</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Likes recibidos</p>
              <p className="text-3xl font-bold text-gray-900">{estadisticas.likes.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 8% vs período anterior</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Comentarios</p>
              <p className="text-3xl font-bold text-gray-900">{estadisticas.comentarios.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 15% vs período anterior</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Publicaciones</p>
              <p className="text-3xl font-bold text-gray-900">{estadisticas.publicaciones}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">+3 este mes</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de barras */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad diaria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vistas" fill="#F59E0B" />
              <Bar dataKey="likes" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico circular */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosPie}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {datosPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top publicaciones */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tus publicaciones más populares</h3>
        <div className="space-y-4">
          {topPublicaciones.map((pub, index) => (
            <div key={pub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{pub.titulo}</h4>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {pub.vistas}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" /> {pub.likes}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EstadisticasUsuario;