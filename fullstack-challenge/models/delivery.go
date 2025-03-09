package models

// Delivery representa a estrutura de uma entrega
type Delivery struct {
	ID          int     `json:"id"`                       // ID da entrega, usado como identificador único
	NomeCliente string  `json:"cliente"`                  // Nome do cliente associado à entrega
	Peso        float64 `json:"peso"`                     // Peso da entrega em quilogramas
	Endereco    string  `json:"endereco"`                 // Endereço onde a entrega deve ser realizada
	Bairro      string  `json:"bairro"`                   // Bairro onde a entrega deve ser realizada
	Complemento string  `json:"complemento"`              // Complemento do endereço (ex: apartamento, bloco)
	Cidade      string  `json:"cidade"`                   // Cidade onde a entrega deve ser realizada
	Estado      string  `json:"estado"`                   // Estado onde a entrega deve ser realizada
	Pais        string  `json:"pais"`                     // País onde a entrega deve ser realizada
	Latitude    float64 `json:"geolocalizacao_latitude"`  // Latitude da localização geográfica da entrega
	Longitude   float64 `json:"geolocalizacao_longitude"` // Longitude da localização geográfica da entrega
}
