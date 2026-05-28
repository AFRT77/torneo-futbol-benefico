const assert = require("node:assert/strict");
const { describe, it, before, after } = require("node:test");

process.env.ADMIN_PASSWORD = "admin";
process.env.JWT_SECRET = "test-secret";

const { app } = require("../servidor");

let server;
let baseUrl;

function listen(appInstance) {
    return new Promise(function (resolve, reject) {
        const httpServer = appInstance.listen(0, "127.0.0.1", function () {
            const address = httpServer.address();
            resolve({
                server: httpServer,
                baseUrl: "http://127.0.0.1:" + address.port
            });
        });

        httpServer.on("error", reject);
    });
}

async function requestJson(path, options) {
    const response = await fetch(baseUrl + path, options);
    const body = await response.json();

    return {
        response,
        body
    };
}

describe("smoke tests", function () {
    before(async function () {
        const started = await listen(app);
        server = started.server;
        baseUrl = started.baseUrl;
    });

    after(async function () {
        await new Promise(function (resolve, reject) {
            server.close(function (error) {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    });

    it("serves public API defaults without MongoDB", async function () {
        const endpoints = [
            ["/api/prueba", "object"],
            ["/api/torneo", "object"],
            ["/api/categorias", "array"],
            ["/api/categorias/benjamin", "object"],
            ["/api/categorias/alevin", "object"],
            ["/api/partidos", "array"],
            ["/api/partidos/benjamin", "array"],
            ["/api/partidos/alevin", "array"],
            ["/api/patrocinadores", "array"],
            ["/api/sorteos", "array"]
        ];

        for (let i = 0; i < endpoints.length; i++) {
            const endpoint = endpoints[i][0];
            const expectedType = endpoints[i][1];
            const { response, body } = await requestJson(endpoint);

            assert.equal(response.status, 200, endpoint);

            if (expectedType === "array") {
                assert.equal(Array.isArray(body), true, endpoint);
                assert.ok(body.length > 0, endpoint);
            } else {
                assert.equal(typeof body, "object", endpoint);
                assert.notEqual(body, null, endpoint);
            }
        }
    });

    it("serves static pages", async function () {
        const pages = [
            "/",
            "/index.html",
            "/cuadrante.html?categoria=benjamin",
            "/cuadrante.html?categoria=alevin",
            "/patrocinadores.html",
            "/login.html",
            "/admin.html"
        ];

        for (let i = 0; i < pages.length; i++) {
            const response = await fetch(baseUrl + pages[i]);
            const body = await response.text();

            assert.equal(response.status, 200, pages[i]);
            assert.match(response.headers.get("content-type"), /text\/html/, pages[i]);
            assert.ok(body.includes("<!DOCTYPE html>"), pages[i]);
        }
    });

    it("authenticates admin and protects admin endpoints", async function () {
        const badLogin = await requestJson("/api/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: "incorrecta"
            })
        });

        assert.equal(badLogin.response.status, 401);

        const login = await requestJson("/api/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: "admin"
            })
        });

        assert.equal(login.response.status, 200);
        assert.equal(typeof login.body.token, "string");

        const missingToken = await requestJson("/api/categorias/admin/todas");
        assert.equal(missingToken.response.status, 401);

        const protectedEndpoints = [
            "/api/categorias/admin/todas",
            "/api/partidos/admin/todos",
            "/api/patrocinadores/admin/todos",
            "/api/sorteos/admin/todos"
        ];

        for (let i = 0; i < protectedEndpoints.length; i++) {
            const { response, body } = await requestJson(protectedEndpoints[i], {
                headers: {
                    Authorization: "Bearer " + login.body.token
                }
            });

            assert.equal(response.status, 200, protectedEndpoints[i]);
            assert.equal(Array.isArray(body), true, protectedEndpoints[i]);
            assert.ok(body.length > 0, protectedEndpoints[i]);
        }
    });
});
