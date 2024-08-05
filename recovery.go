package main

// Usage: 
// copy this code to https://replit.com/languages/go
// and change the encrypted_password variable below (see comments below for steps to acquite the encrypted password)

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
  "crypto/sha256"
  "fmt"
)

const (
  DefaultEncryptionKey  = "just for obfuscation"
)

func Decrypt(encKey []byte, encData string) (string, error) {
	enc, _ := base64.StdEncoding.DecodeString(encData)

	block, err := aes.NewCipher(encKey)
	if err != nil {
		return "", err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonceSize := aesGCM.NonceSize()
	nonce, ciphertext := enc[:nonceSize], enc[nonceSize:]

	plaintext, err := aesGCM.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}

func main() {

  // to acquire the password hash, in the navidrome config directory
  // $ sudo apt install sqlite3
  // $ sqlite3
  // > .open navidrome.db
  // > .headers on
  // > .mode column
  // > select user_name, password from user;

  // and copy the user password to the following variable:

  // encrypted_password := "encrypted password here"
  // the below example should decrypt as admin123
  encrypted_password := "2pP/9CuhQ1z0eIB83QBdYpB+2gKR8BaMZV6BgHjylTMTP3AR"

  data := sha256.Sum256([]byte(DefaultEncryptionKey))
	encKey := data[0:]

  decrypted_password, err := Decrypt(encKey, encrypted_password)

  if err != nil {
    fmt.Println("error: ", err)
  } else {
    fmt.Println("Decrypted password: ", decrypted_password)
  }
}


  // source of the pieces:
  
  // https://github.com/navidrome/navidrome/blob/94e36d7f60cccc1ef2715b648f9b1eddce6d5ba4/db/migration/20210616150710_encrypt_all_passwords.go
  // https://github.com/navidrome/navidrome/blob/94e36d7f60cccc1ef2715b648f9b1eddce6d5ba4/consts/consts.go#L25
  // https://github.com/navidrome/navidrome/blob/94e36d7f60cccc1ef2715b648f9b1eddce6d5ba4/utils/encrypt.go#L39