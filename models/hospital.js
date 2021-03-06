var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'Campo necesario'] }
}, { collection: 'Hospitales' });





module.exports = mongoose.model('Hospital', hospitalSchema);