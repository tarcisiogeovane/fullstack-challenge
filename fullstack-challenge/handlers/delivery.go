package handlers

import (
	"encoding/json" // Pacote para codificação e decodificação JSON
	"net/http"      // Pacote para manipulação de requisições e respostas HTTP
	"strconv"

	"github.com/tarcisiogeovane/fullstack-challenge/config" // Importa o pacote de configuração
)

// Delivery representa a estrutura de uma entrega
type Delivery struct {
	ID          int     `json:"id"`          // ID da entrega
	NomeCliente string  `json:"nomeCliente"` // Nome do cliente
	Peso        float64 `json:"peso"`        // Peso da entrega
	Logradouro  string  `json:"logradouro"`  //
	Numero      string  `json':"numero"`     //
	Bairro      string  `json:"bairro"`      // Bairro da entrega
	Complemento string  `json:"complemento"` // Complemento do endereço
	Cidade      string  `json:"cidade"`      // Cidade da entrega
	Estado      string  `json:"estado"`      // Estado da entrega
	Pais        string  `json:"pais"`        // País da entrega
	Latitude    string  `json:"latitude"`    // Latitude da geolocalização
	Longitude   string  `json:"longitude"`   // Longitude da geolocalização
}

// GetAllDeliveries lista todas as entregas
func GetAllDeliveries(w http.ResponseWriter, r *http.Request) {
	// Chama a função para obter todas as entregas do banco de dados
	deliveries, err := config.GetDeliveries()
	if err != nil {
		// Se ocorrer um erro, responde com erro interno do servidor
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Define o tipo de conteúdo da resposta como JSON
	w.Header().Set("Content-Type", "application/json")
	// Codifica a lista de entregas em JSON e envia na resposta
	json.NewEncoder(w).Encode(deliveries)
}

// CreateDelivery cria uma nova entrega
func CreateDelivery(w http.ResponseWriter, r *http.Request) {
	var delivery Delivery
	// Decodifica o corpo da requisição em um objeto Delivery
	if err := json.NewDecoder(r.Body).Decode(&delivery); err != nil {
		// Se ocorrer um erro na decodificação, responde com erro de requisição ruim
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Chama a função para criar a nova entrega no banco de dados
	err := config.CreateDelivery(delivery.NomeCliente, delivery.Peso, delivery.Logradouro, delivery.Numero, delivery.Bairro,
		delivery.Complemento, delivery.Cidade, delivery.Estado, delivery.Pais, delivery.Latitude, delivery.Longitude)
	if err != nil {
		// Se ocorrer um erro, responde com erro interno do servidor
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Responde com status 201 (Criado) ao sucesso
	w.WriteHeader(http.StatusCreated)
}

// UpdateDelivery atualiza uma entrega existente
func UpdateDelivery(w http.ResponseWriter, r *http.Request) {
	var delivery Delivery
	// Decodifica o corpo da requisição em um objeto Delivery
	if err := json.NewDecoder(r.Body).Decode(&delivery); err != nil {
		// Se ocorrer um erro na decodificação, responde com erro de requisição ruim
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Chama a função para atualizar a entrega no banco de dados
	err := config.UpdateDelivery(delivery.ID, delivery.NomeCliente, delivery.Peso, delivery.Logradouro, delivery.Numero, delivery.Bairro,
		delivery.Complemento, delivery.Cidade, delivery.Estado, delivery.Pais, delivery.Latitude, delivery.Longitude)
	if err != nil {
		// Se ocorrer um erro, responde com erro interno do servidor
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Responde com status 200 (OK) ao sucesso
	w.WriteHeader(http.StatusOK)
}

// GetDelivery puxa uma entrega pelo ID
func GetDelivery(w http.ResponseWriter, r *http.Request) {
	// Obtém o ID da query string
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "ID não fornecido", http.StatusBadRequest)
		return
	}

	// Converte para inteiro
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	// Chama a função para obter a entrega pelo ID
	delivery, err := config.GetDeliveryByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Responde com JSON
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(delivery)
}

// DeleteDelivery remove uma entrega pelo ID
func DeleteDelivery(w http.ResponseWriter, r *http.Request) {
	var request struct {
		ID int `json:"id"` // Estrutura para capturar o ID da entrega
	}
	// Decodifica o corpo da requisição em um objeto de requisição
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		// Se ocorrer um erro na decodificação, responde com erro de requisição ruim
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Chama a função para deletar a entrega no banco de dados
	err := config.DeleteDelivery(request.ID)
	if err != nil {
		// Se ocorrer um erro, responde com erro interno do servidor
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Responde com status 200 (OK) ao sucesso
	w.WriteHeader(http.StatusOK)
}
