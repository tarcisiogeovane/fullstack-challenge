package routes

import (
	"github.com/gorilla/mux"                                  // Importa o pacote mux para manipulação de rotas
	"github.com/tarcisiogeovane/fullstack-challenge/handlers" // Importa os handlers da aplicação
)

// SetupRoutes configura as rotas da aplicação
func SetupRoutes() *mux.Router {
	router := mux.NewRouter() // Cria um novo roteador usando o pacote mux

	// Rotas para operações com entregas (deliveries)
	router.HandleFunc("/deliveries", handlers.GetAllDeliveries).Methods("GET")           // Retorna todas as entregas
	router.HandleFunc("/deliveries/delivery", handlers.GetDelivery).Methods("GET")       // Retorna uma entrega específica pelo ID
	router.HandleFunc("/deliveries/create", handlers.CreateDelivery).Methods("POST")     // Cria uma nova entrega
	router.HandleFunc("/deliveries/update/{id}", handlers.UpdateDelivery).Methods("PUT") // Atualiza uma entrega existente pelo ID
	router.HandleFunc("/deliveries/delete", handlers.DeleteDelivery).Methods("DELETE")   // Deleta uma entrega pelo ID
	return router                                                                        // Retorna o roteador configurado
}
