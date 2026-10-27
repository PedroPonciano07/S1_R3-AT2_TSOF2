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

    // CT-014 ATÉ CT-038
    // =========================================================

    describe("Suíte de Testes - Validações dos Modelos", () => {

        const clienteValido = {
            nome: "Cliente de Teste",
            cpf: "12345678909",
            cep: "13010000",
            logradouro: "Rua Central",
            bairro: "Centro",
            cidade: "Campinas",
            uf: "SP",
            numero: "100",
            complemento: "Casa"
        };

        // CT-014
        test("CT-014 - Cadastro de cliente com CPF vazio", () => {
            expect(() => new Cliente(
                clienteValido.nome, "", clienteValido.cep,
                clienteValido.logradouro, clienteValido.bairro,
                clienteValido.cidade, clienteValido.uf,
                clienteValido.numero
            )).toThrow("CPF inválido");
        });

        // CT-015
        test("CT-015 - Cadastro de cliente com CEP curto", () => {
            expect(() => new Cliente(
                clienteValido.nome, clienteValido.cpf, "1234567",
                clienteValido.logradouro, clienteValido.bairro,
                clienteValido.cidade, clienteValido.uf,
                clienteValido.numero
            )).toThrow("CEP inválido");
        });

        // CT-016
        test("CT-016 - Cadastro de cliente com CEP longo", () => {
            expect(() => new Cliente(
                clienteValido.nome, clienteValido.cpf, "123456789",
                clienteValido.logradouro, clienteValido.bairro,
                clienteValido.cidade, clienteValido.uf,
                clienteValido.numero
            )).toThrow("CEP inválido");
        });

        // CT-017
        test("CT-017 - Cadastro de cliente com UF inválida", () => {
            expect(() => new Cliente(
                clienteValido.nome, clienteValido.cpf, clienteValido.cep,
                clienteValido.logradouro, clienteValido.bairro,
                clienteValido.cidade, "SPO",
                clienteValido.numero
            )).toThrow("UF inválida");
        });

        // CT-018
        test("CT-018 - Cadastro de cliente sem logradouro", () => {
            expect(() => new Cliente(
                clienteValido.nome, clienteValido.cpf, clienteValido.cep,
                "", clienteValido.bairro, clienteValido.cidade,
                clienteValido.uf, clienteValido.numero
            )).toThrow("Logradouro inválido");
        });

        // CT-019
        test("CT-019 - Cadastro de cliente sem bairro", () => {
            expect(() => new Cliente(
                clienteValido.nome, clienteValido.cpf, clienteValido.cep,
                clienteValido.logradouro, "", clienteValido.cidade,
                clienteValido.uf, clienteValido.numero
            )).toThrow("Bairro inválido");
        });

        // CT-020
        test("CT-020 - Cadastro de cliente sem cidade", () => {
            expect(() => new Cliente(
                clienteValido.nome, clienteValido.cpf, clienteValido.cep,
                clienteValido.logradouro, clienteValido.bairro, "",
                clienteValido.uf, clienteValido.numero
            )).toThrow("Cidade inválida");
        });

        // CT-021
        test("CT-021 - Cadastro de cliente sem número", () => {
            expect(() => new Cliente(
                clienteValido.nome, clienteValido.cpf, clienteValido.cep,
                clienteValido.logradouro, clienteValido.bairro,
                clienteValido.cidade, clienteValido.uf, ""
            )).toThrow("Número inválido");
        });

        // CT-022
        test("CT-022 - Cadastro de cliente com nome acima do limite", () => {
            expect(() => new Cliente(
                "C".repeat(101), clienteValido.cpf, clienteValido.cep,
                clienteValido.logradouro, clienteValido.bairro,
                clienteValido.cidade, clienteValido.uf,
                clienteValido.numero
            )).toThrow("Nome inválido");
        });

        // CT-023
        test("CT-023 - Edição de cliente com ID zero", () => {
            expect(() => Cliente.editar({
                ...clienteValido
            }, 0)).not.toThrow();
        });

        // CT-024
        test("CT-024 - Cadastro de montadora com país vazio", () => {
            expect(() => new Montadora("Toyota", ""))
                .toThrow("País inválido");
        });

        // CT-025
        test("CT-025 - Cadastro de montadora com país de um caractere", () => {
            expect(() => new Montadora("Toyota", "J"))
                .toThrow("País inválido");
        });

        // CT-026
        test("CT-026 - Cadastro de montadora com país acima do limite", () => {
            expect(() => new Montadora("Toyota", "P".repeat(46)))
                .toThrow("País inválido");
        });

        // CT-027
        test("CT-027 - Cadastro de montadora com nome acima do limite", () => {
            expect(() => new Montadora("M".repeat(61), "Brasil"))
                .toThrow("Nome inválido");
        });

        // CT-028
        test("CT-028 - Edição de montadora com ID negativo", () => {
            expect(() => Montadora.editar({
                nome: "Honda",
                pais: "Japão"
            }, -1)).toThrow("ID inválido");
        });

        // CT-029
        test("CT-029 - Cadastro de veículo sem ID da montadora", () => {
            expect(() => new Veiculo(
                null, 1, "Civic", "ABC1234",
                2024, "Preto", 85000
            )).toThrow("ID da montadora inválido");
        });

        // CT-030
        test("CT-030 - Cadastro de veículo sem ID do cliente", () => {
            expect(() => new Veiculo(
                1, null, "Civic", "ABC1234",
                2024, "Preto", 85000
            )).toThrow("ID do cliente inválido");
        });

        // CT-031
        test("CT-031 - Cadastro de veículo com modelo vazio", () => {
            expect(() => new Veiculo(
                1, 1, "", "ABC1234", 2024, "Preto", 85000
            )).toThrow("Modelo inválido");
        });

        // CT-032
        test("CT-032 - Cadastro de veículo com modelo acima do limite", () => {
            expect(() => new Veiculo(
                1, 1, "M".repeat(61), "ABC1234",
                2024, "Preto", 85000
            )).toThrow("Modelo inválido");
        });

        // CT-033
        test("CT-033 - Cadastro de veículo com placa curta", () => {
            expect(() => new Veiculo(
                1, 1, "Civic", "AB12", 2024, "Preto", 85000
            )).toThrow("Placa inválida");
        });

        // CT-034
        test("CT-034 - Cadastro de veículo com placa acima do limite", () => {
            expect(() => new Veiculo(
                1, 1, "Civic", "ABC12345678",
                2024, "Preto", 85000
            )).toThrow("Placa inválida");
        });

        // CT-035
        test("CT-035 - Cadastro de veículo com ano anterior a 1886", () => {
            expect(() => new Veiculo(
                1, 1, "Civic", "ABC1234", 1885, "Preto", 85000
            )).toThrow("Ano inválido");
        });

        // CT-036
        test("CT-036 - Cadastro de veículo com cor vazia", () => {
            expect(() => new Veiculo(
                1, 1, "Civic", "ABC1234", 2024, "", 85000
            )).toThrow("Cor inválida");
        });

        // CT-037
        test("CT-037 - Cadastro de veículo com cor acima do limite", () => {
            expect(() => new Veiculo(
                1, 1, "Civic", "ABC1234",
                2024, "C".repeat(31), 85000
            )).toThrow("Cor inválida");
        });

        // CT-038
        test("CT-038 - Cadastro de veículo com valor zero", () => {
            expect(() => new Veiculo(
                1, 1, "Civic", "ABC1234",
                2024, "Preto", 0
            )).toThrow("Valor inválido");
        });

    });


    });

});