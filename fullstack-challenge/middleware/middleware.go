package middleware

import (
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
)

// Verifica se o token JWT é válido
func ValidateToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Obtenha o token da autorização
		tokenString := r.Header.Get("Authorization")
		tokenString = strings.TrimPrefix(tokenString, "Bearer ")

		// Verifica se o token está presente
		if tokenString == "" {
			http.Error(w, "Token não fornecido", http.StatusUnauthorized)
			return
		}

		// Verifica o token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Verifica o método de assinatura do token
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, http.ErrNotSupported
			}
			// Retorna a chave usada para assinar o token
			return []byte("sua-chave-secreta"), nil // Substitua pela sua chave secreta
		})

		if err != nil || !token.Valid {
			http.Error(w, "Token inválido", http.StatusUnauthorized)
			return
		}

		// Chama o próximo handler se o token for válido
		next.ServeHTTP(w, r)
	})
}
