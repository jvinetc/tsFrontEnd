import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getStops } from '../api/Stop';
import type { IStopResponse } from '../interface/Stop';

const StopsCircuit = () => {
  const location = useLocation();
  const { id } = location.state;
  const [stops, setStops] = useState<IStopResponse[]>([]);
  const [photos, setPhotos] = useState<[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [stop, setStop] = useState<IStopResponse>();
  const [pageToken, setPageToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadStops();
  }, []);

  const loadStops = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const { data } = await getStops({ planId: id, pageToken });
      setStops(data.stops);
      setPageToken(data.nextPageToken);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  const openModal = (photoUrls: [], stopL: IStopResponse) => {
    setStop(stopL);
    setPhotos(photoUrls);
    setModalOpen(true);
  }

  const stateTranslations: Record<string, string> = {
    delivered_to_recipient:'Entregado al destinatario',
    delivered_to_third_party:'Entregado a un tercero',
    delivered_to_mailbox: 'Dejado en un buzon',
    delivered_to_safe_place:'Dejado en lugar seguro',
    delivered_to_pickup_point: 'Dejado en un punto de recogida',
    picked_up_from_customer:'Retirado de la tienda',
    picked_up_unmanned:'',
    picked_up_from_locker:'',
    failed_not_home: 'Fallido, nadie en casa',
    failed_cant_find_address:'Fallido, direccion no encontrada',
    failed_no_parking: 'Fallido, No hay donde estacionar',
    failed_no_time: 'Fallido, fuer de hora',
    failed_package_not_available: 'Fallido, paquete no disponible',
    failed_missing_required_proof: 'Fallido, perdido con ruebas',
    unattempted: 'No asignado'
  };

  const translateState = (state: string): string => {
    return stateTranslations[state] ?? state;
  };

  return (
    <div>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-left">
            <th className="p-2">Id Circuit</th>
            <th className="p-2">Actividad</th>
            <th className="p-2">Tienda</th>
            <th className="p-2">Conductor</th>
            <th className="p-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading && stops?.length > 0 &&
            stops.map((p: IStopResponse) => (
              <tr key={p.id} className="border-b dark:border-gray-600">
                <td className="p-2">
                  <button
                    onClick={() => openModal(p?.deliveryInfo?.photoUrls, p)}
                    className="text-blue-600 dark:text-blue-400 underline relative group"
                  >
                    {p.id.slice(0, 12)}...
                  </button>
                </td>
                <td className="p-2">{p.activity}</td>
                <td className="p-2">{p.orderInfo.sellerName}</td>
                <td className="p-2">{p.driverIdentifier}</td>
                <td className="p-2">{translateState(p.deliveryInfo.state)}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <br />
      {pageToken && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => {
              setPageToken('');
              loadStops();
            }}
            className="px-5 py-2 rounded font-medium bg-gray-200 w-20%
            hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 
            dark:text-white transition-colors"
          >
            Volver al inicio
          </button>
          <button
            onClick={loadStops}
            disabled={isLoading}
            className={`rounded font-medium transition-colors w-15% ${isLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            {isLoading ? 'Cargando...' : 'Ver más'}
          </button>
        </div>
      )}

      {modalOpen && photos && stop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-2xl max-w-2xl w-full animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
              📦 Evidencia de Entrega
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {photos.map((photo, index) => (
                <a
                  key={index}
                  href={photo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <img
                    src={photo}
                    alt={`Evidencia ${index + 1}`}
                    className="w-full h-24 sm:h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-transform group-hover:scale-105"
                  />
                  <span className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver evidencia
                  </span>
                </a>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">📍 Datos de la entrega</p>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li><strong>Destinatario:</strong> {stop.recipient.name}</li>
                <li><strong>Teléfono:</strong> {stop.recipient.phone}</li>
                <li><strong>Dirección:</strong> {stop.address.address}</li>
                <li><strong>Receptor:</strong> {stop.deliveryInfo.driverProvidedRecipientNotes}</li>
                <li><strong>Estado:</strong> {translateState(stop.deliveryInfo.state)}</li>
              </ul>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setModalOpen(false)}
                className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StopsCircuit