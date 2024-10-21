import mongoose from 'mongoose';

const ticketCollection = "tickets";

const ticketSchema = mongoose.Schema({
    code: String,
    amount: Number,
    purchaser: String,
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
            quantity: { type: Number },
            price: { type: Number }, // Corrección aquí
        }
    ],
    purchase_datetime: { type: Date, default: Date.now }
});

const TicketModel = mongoose.model(ticketCollection, ticketSchema);

export default TicketModel;


