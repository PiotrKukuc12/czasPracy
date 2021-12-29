```
aplikacja do mierzenia czasu pracowników
openapi: 3.0.0
info:
  version: '1'
  title: czas pracy api
  description: api do mierzenia czasu pracy pracownikow
paths: 
  /:  
  post: 
    description: Zwraca nowego pracownika oraz zapisuje go do bazy danych
    requestBody:
      required: true
      content:
        application/json:
          schema: 
            type: object
            required:
              - name
              - opis
            properties:
              name:
                type: string
              opis:
                type: string
    responses: 
      '200':
        description: Pomyślna odpowiedź servera
        content:
          application/json:
            schema:
              type: object
              required: 
                - name
                - opis
              properties:
                name: 
                  type: string
                historia:
                  type: array
                opis:
                  type: string
                rozpoczęcie:
                  type: Date,
                zakończnie:
                  type: Date,
                czasPracy:
                  type: number
      '500':
        description: Invalid request
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
  /zakonczenie:
  put:
    description: Zwraca zaktualizowany objekt, z zakończonym zadaniem.
    requestBody:
      application/json:
        schema:
          type: object
          required:
            - name
          properties:
            name:
              type: string
    responses:
      '200':
        description: Pomyślne zakończenie zadania i zapisanie go w histori.
        content:
        application/json:
          schema:
            type: object
            properties:
              message:
                type: string
      '500':
        description: Złe wysłanie zapytania 
        content:
        application/json:
          schema:
            type: object
            properties:
              message:
                type: string
  /rozpoczecie:
  put:
    description: Zwraca zaktualizowany objekt, z nowo rozpoczętym zadaniem.
    requestBody:
      application/json:
        schema:
          type: object
          required:
            - name
            - opis
          properties:
            name:
              type: string
            opis:
              type: string
    responses:
      '200':
        description: Pomyślne rozpoczęcie zadania i zapisanie go w histori.
        content:
        application/json:
          schema:
            type: object
            properties:
              message:
                type: string
      '500':
        description: Złe wysłanie zapytania 
        content:
        application/json:
          schema:
            type: object
            properties:
              message:
                type: string
  /historia/:name
  get:
    description: Zwraca całą historie czasów pracy danego pracownika

    responses: 
      '200':
      description: 
      content:
        application/json:
          schema:
            type: object
            properties:
                  name: 
                    type: string
                  historia:
                    type: array
                  opis:
                    type: string
                  rozpoczęcie:
                    type: Date,
                  zakończnie:
                    type: Date,
                  czasPracy:
                    type: number
      '500':
      description:  Złe wysłanie zapytania
      content:
        application/json:
          schema:
            type: object
            properties:
              message: 
                type: string
  components:
    schemas:
      Pracownik:
        type: object
        required:
          -name
          -opis
        properties:
          name: 
            type: string
          historia:
            type: array
          opis:
            type: string
          rozpoczęcie:
            type: Date,
          zakończnie:
            type: Date,
          czasPracy:
            type: number
```
