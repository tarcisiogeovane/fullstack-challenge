package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/tarcisiogeovane/fullstack-challenge/config"
	"github.com/tarcisiogeovane/fullstack-challenge/middleware"
	"github.com/tarcisiogeovane/fullstack-challenge/models"
)

var validate *validator.Validate

// Estrutura de dados com tags de validação
type Delivery struct {
	ID          int     `json:"id"`
	NomeCliente string  `json:"cliente" validate:"required,min=3"`
	Peso        float64 `json:"peso" validate:"required,gt=0"`
	Endereco    string  `json:"endereco" validate:"required"`
	Bairro      string  `json:"bairro"`
	Complemento string  `json:"complemento"`
	Cidade      string  `json:"cidade"`
	Estado      string  `json:"estado"`
	Pais        string  `json:"pais"`
	Latitude    float64 `json:"geolocalizacao_latitude"`
	Longitude   float64 `json:"geolocalizacao_longitude"`
}

// Inicializa o validador
func init() {
	validate = validator.New()
}

// Criar uma nova entrega
func createDelivery(w http.ResponseWriter, r *http.Request) {
	var newDelivery models.Delivery
	err := json.NewDecoder(r.Body).Decode(&newDelivery)
	if err != nil {
		http.Error(w, "Erro ao decodificar JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Validação dos campos
	err = validate.Struct(newDelivery)
	if err != nil {
		http.Error(w, fmt.Sprintf("Erro de validação: %s", err.Error()), http.StatusBadRequest)
		return
	}

	// Inserção no banco
	_, err = config.DB.Exec(`
		INSERT INTO deliveries (cliente, peso, endereco, bairro, complemento, cidade, estado, pais, geolocalizacao_latitude, geolocalizacao_longitude)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		newDelivery.NomeCliente, newDelivery.Peso, newDelivery.Endereco, newDelivery.Bairro,
		newDelivery.Complemento, newDelivery.Cidade, newDelivery.Estado, newDelivery.Pais,
		newDelivery.Latitude, newDelivery.Longitude,
	)
	if err != nil {
		http.Error(w, "Erro ao salvar no banco de dados: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newDelivery)
}

// Listar todas as entregas
func listDeliveries(w http.ResponseWriter, r *http.Request) {
	rows, err := config.DB.Query("SELECT id, cliente, peso, endereco, bairro, complemento, cidade, estado, pais, geolocalizacao_latitude, geolocalizacao_longitude FROM deliveries")
	if err != nil {
		http.Error(w, "Erro ao buscar entregas: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var deliveries []models.Delivery
	for rows.Next() {
		var delivery models.Delivery
		err := rows.Scan(
			&delivery.ID, &delivery.NomeCliente, &delivery.Peso, &delivery.Endereco,
			&delivery.Bairro, &delivery.Complemento, &delivery.Cidade, &delivery.Estado,
			&delivery.Pais, &delivery.Latitude, &delivery.Longitude,
		)
		if err != nil {
			http.Error(w, "Erro ao processar dados do banco", http.StatusInternalServerError)
			return
		}
		deliveries = append(deliveries, delivery)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(deliveries)
}

// Buscar entrega por ID
func getDeliveryByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var delivery models.Delivery
	err = config.DB.QueryRow("SELECT id, cliente, peso, endereco, bairro, complemento, cidade, estado, pais, geolocalizacao_latitude, geolocalizacao_longitude FROM deliveries WHERE id = ?", id).
		Scan(&delivery.ID, &delivery.NomeCliente, &delivery.Peso, &delivery.Endereco, &delivery.Bairro, &delivery.Complemento, &delivery.Cidade, &delivery.Estado, &delivery.Pais, &delivery.Latitude, &delivery.Longitude)
	if err != nil {
		http.Error(w, "Entrega não encontrada", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(delivery)
}

// Atualizar entrega
func updateDelivery(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var updatedDelivery models.Delivery
	err = json.NewDecoder(r.Body).Decode(&updatedDelivery)
	if err != nil {
		http.Error(w, "Erro ao decodificar JSON", http.StatusBadRequest)
		return
	}

	_, err = config.DB.Exec(`
		UPDATE deliveries SET cliente = ?, peso = ?, endereco = ? WHERE id = ?`,
		updatedDelivery.NomeCliente, updatedDelivery.Peso, updatedDelivery.Endereco, id)
	if err != nil {
		http.Error(w, "Erro ao atualizar no banco de dados", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Entrega atualizada com sucesso!"})
}

// Deletar entrega
func deleteDelivery(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	_, err = config.DB.Exec("DELETE FROM deliveries WHERE id = ?", id)
	if err != nil {
		http.Error(w, "Erro ao deletar no banco de dados", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Entrega removida com sucesso!"})
}

// Configurar e iniciar o servidor
func main() {
	// Conectar ao banco
	config.ConnectDatabase()

	if err := config.DB.Ping(); err != nil {
		log.Fatalf("Erro ao conectar ao banco de dados: %v", err)
	}

	// Criar roteador
	r := mux.NewRouter()

	// Rotas públicas
	r.HandleFunc("/deliveries", createDelivery).Methods("POST")
	r.HandleFunc("/deliveries", listDeliveries).Methods("GET")
	r.HandleFunc("/deliveries/{id:[0-9]+}", getDeliveryByID).Methods("GET")
	r.HandleFunc("/deliveries/{id:[0-9]+}", updateDelivery).Methods("PUT")
	r.HandleFunc("/deliveries/{id:[0-9]+}", deleteDelivery).Methods("DELETE")

	// rotas protegidas com middleware
	r.Handle("/secure/deliveries", middleware.ValidateToken(http.HandlerFunc(createDelivery))).Methods("POST")
	r.Handle("/secure/deliveries", middleware.ValidateToken(http.HandlerFunc(listDeliveries))).Methods("GET")

	//iniciar o servidor
	fmt.Println("Iniciando servidor na porta 8080...")
	log.Fatal(http.ListenAndServe(":8080", r))
	fmt.Println("Servidor encerrado.")
}
