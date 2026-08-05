FROM golang:1.22 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o avitogi-backend ./app

FROM debian:bookworm-slim

WORKDIR /app

COPY --from=builder /app/avitogi-backend .

EXPOSE 8085

CMD ["./avitogi-backend"]
