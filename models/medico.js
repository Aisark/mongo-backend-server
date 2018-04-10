var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'Se requiere el nombre'] },
    img: { type: String, required: false },
    usuarios: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'Se requiere usuario'] },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'Se requiere hospital'] }
});


module.exports = mongoose.model('Medico', medicoSchema);