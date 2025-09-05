import type { IPickUp } from "../interface/PickUp";
type CardProps = {
    pickUp: IPickUp;
    isActive: boolean;
    onSelect: () => void;
}
const PickupCard = ({ pickUp, isActive, onSelect }: CardProps) => (
    <div
        onClick={onSelect}
        className={`rounded-lg shadow border grid grid-cols-1 md:grid-cols-3 gap-1 p-4 cursor-pointer transition-colors ${isActive
            ? 'bg-beige dark:bg-beige-800 border-blue-300 dark:border-blue-500'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
    >
        {/* Información del stop */}
        <div className="space-y-3">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                Datos del conductor
            </h3>
            <h4 className="font-bold text-lg text-gray-800 dark:text-white">
                {`${pickUp.Driver?.User?.firstName} ${pickUp.Driver?.User?.lastName}`}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
               {`Patente: ${pickUp.Driver?.patente}`}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">📞 {pickUp.Driver?.User?.phone}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">📧 {pickUp.Driver?.User?.email}</p>
        </div>

        <div className="space-y-3">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                Datos de la tienda
            </h3>
            <h4 className="font-bold text-lg text-gray-800 dark:text-white">
                🛒 {pickUp.Sell?.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                {pickUp.Sell?.addresPickup}, {pickUp.Sell?.Comuna?.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">📞 {pickUp.Sell?.User?.phone}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">📧 {pickUp.Sell?.User?.email}</p>
        </div>
         <div className="space-y-3">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                Datos del punto
            </h3>
            <h4 className="font-bold text-lg text-gray-800 dark:text-white">
                 {pickUp.Stop?.addres}, {pickUp.Stop?.Comuna?.name}                
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">📞 {pickUp.Stop?.phone}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
               {`Destinatario: ${pickUp.Stop?.addresName}`}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{`Estado: ${pickUp.Stop?.status}`}</p>
        </div>
    </div>
);

export default PickupCard;