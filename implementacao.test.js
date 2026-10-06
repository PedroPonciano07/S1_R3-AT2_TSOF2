import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "./src/app.js";

describe("IMPLEMENTAÇÃO - TESTES DA API", () => {

    let clienteId;
    let montadoraId;

    // =========================================================
    // CLIENTES
    // =========================================================

    describe("Suíte de Testes - Clientes", () => {

        // CT-001
        test("CT-001 - Cadastro de cliente com dados válidos", async () => {

            const cliente = {
                nome: "Cliente Teste",
                cpf: "12345678909",
                cep: "13010000",
                numero: "100",
                complemento: "Casa"
            };

            const response = await request(app)
                .post("/clientes")
                .send(cliente);

            expect(response.status).toBe(201);
            expect(response.body).toBeDefined();
            expect(response.body.data).toBeDefined();

            clienteId = response.body.data.insertId;

            expect(clienteId).toBeGreaterThan(0);
        });


        // CT-002
        test("CT-002 - Cadastro de cliente com nome inválido", async () => {

            const cliente = {
                nome: "A",
                cpf: "98765432100",
                cep: "13010000",
                numero: "100",
                complemento: "Casa"
            };

            const response = await request(app)
                .post("/clientes")
                .send(cliente);

            expect(response.status).toBe(500);
            expect(response.body).toBeDefined();
        });


        // CT-003
        test("CT-003 - Cadastro de cliente com CEP inválido", async () => {

            const cliente = {
                nome: "Cliente Teste",
                cpf: "11144477735",
                cep: "12345",
                numero: "100",
                complemento: "Casa"
            };

            const response = await request(app)
                .post("/clientes")
                .send(cliente);

            expect(response.status).toBe(500);
            expect(response.body).toBeDefined();
        });


        // CT-004
        test("CT-004 - Listagem de clientes cadastrados", async () => {

            const response = await request(app)
                .get("/clientes");

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.data).toBeDefined();
            expect(Array.isArray(response.body.data)).toBe(true);
        });


        // CT-005
        test("CT-005 - Atualização de cliente existente", async () => {

            if (!clienteId) {

                const cadastro = await request(app)
                    .post("/clientes")
                    .send({
                        nome: "Cliente Atualizacao",
                        cpf: "52998224725",
                        cep: "13010000",
                        numero: "200",
                        complemento: "Casa"
                    });

                expect(cadastro.status).toBe(201);

                clienteId = cadastro.body.data.insertId;
            }

            const response = await request(app)
                .put(`/clientes?id=${clienteId}`)
                .send({
                    nome: "Cliente Atualizado",
                    cpf: "52998224725",
                    cep: "13010000",
                    numero: "300",
                    complemento: "Apartamento"
                });

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });

// CT-006
test("CT-006 - Exclusão de cliente existente", async () => {

    // Criamos um cliente exclusivo para este teste,
    // para não apagar o cliente que será usado nos testes de veículos.

    const cadastro = await request(app)
        .post("/clientes")
        .send({
            nome: "Cliente Exclusao",
            cpf: "39053344705",
            cep: "13010000",
            numero: "400",
            complemento: "Casa"
        });

    expect(cadastro.status).toBe(201);

    const idExclusao = cadastro.body.data.insertId;

    expect(idExclusao).toBeGreaterThan(0);

    const response = await request(app)
        .delete(`/clientes/${idExclusao}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
});

        // CT-007
        test("CT-007 - Cadastro de montadora com dados válidos", async () => {

            const montadora = {
                nome: "Toyota",
                pais: "Japao"
            };

            const response = await request(app)
                .post("/montadoras")
                .send(montadora);

            expect(response.status).toBe(201);
            expect(response.body).toBeDefined();
            expect(response.body.data).toBeDefined();

            montadoraId = response.body.data.insertId;

            expect(montadoraId).toBeGreaterThan(0);
        });


        // CT-008
        test("CT-008 - Cadastro de montadora com nome inválido", async () => {

            const montadora = {
                nome: "A",
                pais: "Brasil"
            };

            const response = await request(app)
                .post("/montadoras")
                .send(montadora);

            expect(response.status).toBe(500);
            expect(response.body).toBeDefined();
        });


        // CT-009
        test("CT-009 - Atualização de montadora inexistente", async () => {

            const response = await request(app)
                .put("/montadoras?id=999999")
                .send({
                    nome: "Honda",
                    pais: "Japao"
                });

            expect(response.status).toBe(404);
            expect(response.body).toBeDefined();
        });


        // CT-010
        test("CT-010 - Listagem de montadoras cadastradas", async () => {

            const response = await request(app)
                .get("/montadoras");

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.data).toBeDefined();
            expect(Array.isArray(response.body.data)).toBe(true);
        });

    });


    // =========================================================
    // VEÍCULOS
    // =========================================================

    describe("Suíte de Testes - Veículos", () => {

        // CT-011
        test("CT-011 - Cadastro de veículo com dados válidos", async () => {

            // Criar cliente caso não exista
            if (!clienteId) {

                const cliente = await request(app)
                    .post("/clientes")
                    .send({
                        nome: "Cliente Veiculo",
                        cpf: "39053344705",
                        cep: "13010000",
                        numero: "500",
                        complemento: "Casa"
                    });

                expect(cliente.status).toBe(201);

                clienteId = cliente.body.data.insertId;
            }


            // Criar montadora caso não exista
            if (!montadoraId) {

                const montadora = await request(app)
                    .post("/montadoras")
                    .send({
                        nome: "Volkswagen",
                        pais: "Alemanha"
                    });

                expect(montadora.status).toBe(201);

                montadoraId = montadora.body.data.insertId;
            }


            const veiculo = {
                idCliente: clienteId,
                idMontadora: montadoraId,
                modelo: "Golf",
                placa: "ABC1D23",
                ano: 2024,
                cor: "Preto",
                valor: 85000
            };

            const response = await request(app)
                .post("/veiculos")
                .send(veiculo);

            expect(response.status).toBe(201);
            expect(response.body).toBeDefined();
            expect(response.body.data).toBeDefined();
        });


        // CT-012
        test("CT-012 - Cadastro de veículo com valor inválido", async () => {

            const veiculo = {
                idCliente: clienteId,
                idMontadora: montadoraId,
                modelo: "Civic",
                placa: "DEF4G56",
                ano: 2024,
                cor: "Branco",
                valor: -1000
            };

            const response = await request(app)
                .post("/veiculos")
                .send(veiculo);

            expect(response.status).toBe(500);
            expect(response.body).toBeDefined();
        });


        // CT-013
        test("CT-013 - Cadastro de veículo com ano inválido", async () => {

            const veiculo = {
                idCliente: clienteId,
                idMontadora: montadoraId,
                modelo: "Corolla",
                placa: "GHI7J89",
                ano: 1800,
                cor: "Prata",
                valor: 90000
            };

            const response = await request(app)
                .post("/veiculos")
                .send(veiculo);

            expect(response.status).toBe(500);
            expect(response.body).toBeDefined();
        });

    });

});