const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Seguidor = sequelize.define('Seguidor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    seguidorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      onDelete: 'CASCADE',
      field: 'seguidor_id'
    },
    seguidoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      onDelete: 'CASCADE',
      field: 'seguido_id'
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion'
    }
  }, {
    tableName: 'seguidores',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['seguidor_id', 'seguido_id']
      }
    ],
    validate: {
      noAutoSeguimiento() {
        if (this.seguidorId === this.seguidoId) {
          throw new Error('Un usuario no puede seguirse a sí mismo');
        }
      }
    }
  });

  return Seguidor;
};