import type { IPayment } from '../interface/Payment';
import type { IStop } from '../interface/Stop';



const PaymentTable = ({ payment, stops, isActive, onSelect }: {payment: IPayment, stops:IStop[], isActive: boolean, onSelect: () => void }) => {
    return (
        <div>

            <div onClick={onSelect} key={payment.id} className={isActive ? "bg-beige dark:bg-beige-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 p-4"
                : "bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 p-4"}>
                <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">Orden: {payment?.buy_order}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">🛒 {payment?.Sell?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tarjeta: **** **** **** {payment?.card_detail?.slice(-4)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Fecha: {payment?.createAt ? new Date(payment?.createAt).toLocaleString() :
                        new Date().toLocaleString().toLocaleString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Estado: {payment?.status}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Monto: ${payment?.amount?.toLocaleString('es-Es')}.-</p>
                </div>
                <div>
                    <ul className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                        {stops && stops.map((stop, i) => (
                            <li
                                key={i}
                                className="border-l-4 border-blue-500 pl-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-md shadow-sm p-3"
                            >
                                <p className="font-medium">Comuna: {stop.Comuna?.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Direccion: {stop.addres}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tarifa: ${stop.Rate?.price?.toLocaleString()}.-</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Estado: {stop.status}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default PaymentTable