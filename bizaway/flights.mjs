export async function buscarVuelosDeIda(codigoOrigen, codigoDestino, fechaSalida) {
    const apiKey = 'sh428739766321522266746152871799'; // Reemplaza con tu propia clave de API de Skyscanner
    const url = `https://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-US/${codigoOrigen}-sky/${codigoDestino}-sky/${fechaSalida}?apiKey=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error al buscar vuelos de ida:', error);
      return null;
    }
  }